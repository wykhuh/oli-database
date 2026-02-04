import { parse as papaparse } from "papaparse";
import List from "list.js";

let headerClasses = [];
let allRecords = [];
let listRecords = [];

//==========================
// fetch and process CSV
//==========================

export function getAndParseCSV(url, header = true, download = true) {
  return new Promise((resolve, reject) => {
    papaparse(url, {
      header: header,
      download: download,
      complete(results) {
        resolve(results.data);
      },
      error(err) {
        reject(err);
      },
    });
  });
}

export function processListData(data, config) {
  if (config.displayFields == undefined || config.displayFields === "") {
    return data;
  }

  // use Map instead of object to guarantee order of the keys
  let listRecords = [];

  // select fields in displayFields
  data.forEach((row) => {
    let newRow = new Map();
    config.displayFields.forEach((field) => {
      newRow.set(field, row.get(field));
    });
    if (config.link?.idField) {
      newRow.set(config.link.idField, row.get(config.link.idField));
    }

    listRecords.push(newRow);
  });

  return listRecords;
}

export function processAllData(data) {
  return (
    data
      // filter rows with all empty values
      .filter((row) => {
        return !Object.values(row).every((value) => ["", undefined].includes(value));
      })
      .map((row) => {
        return new Map(Object.entries(row));
      })
  );
}

//==========================
// all records table
//==========================

export function renderSortableTable(
  data,
  config,
  tableSelector = undefined,
  searchTerm = undefined,
) {
  let searchEl = document.getElementById("search-form");
  if (searchEl == undefined) return;

  let dataContainerEl = document.getElementById("data-container");
  if (dataContainerEl == undefined) return;

  allRecords = processAllData(data);
  listRecords = processListData(allRecords, config);

  let table = createListTable(listRecords, config, tableSelector);
  dataContainerEl.appendChild(table);

  addSortableTable(searchTerm);
}

export function createTable(data, config = {}, selector = undefined) {
  allRecords = processAllData(data);
  listRecords = processListData(allRecords, config);

  return createListTable(listRecords, config, selector);
}

function createListTable(data, config, selector) {
  let table = document.createElement("table");
  table.className = "list-table stripe-table";
  if (selector) {
    table.classList.add(selector);
  }

  //  create header row
  let theadEl = document.createElement("thead");
  theadEl.appendChild(createHeaderRow(data[0], config));
  table.appendChild(theadEl);

  // created table body
  let tbodyEl = document.createElement("tbody");
  tbodyEl.className = "list";

  // create rows
  data.forEach((row) => {
    tbodyEl.appendChild(createRow(row, config));
  });

  table.appendChild(tbodyEl);
  return table;
}

function createHeaderRow(row, config) {
  let rowEl = document.createElement("tr");

  row.forEach((value, key) => {
    if (key === config.link?.idField) {
      return;
    }

    let headerEl = document.createElement("th");
    headerEl.innerText = key;

    // add html markup for sortable table
    if (config.sortable) {
      let headerClass = key.replaceAll(" ", "-").toLowerCase();
      headerEl.dataset.sort = headerClass;
      if (value instanceof Date) {
        headerEl.dataset.sort = "timestamp";
      } else {
        headerEl.dataset.sort = headerClass;
      }
      headerEl.className = "sort";
      headerClasses.push(headerClass);
    }

    rowEl.appendChild(headerEl);
  });

  return rowEl;
}

function createRow(row, config) {
  let rowEl = document.createElement("tr");
  row.forEach((value, key) => {
    if (key === config.link?.idField) {
      return;
    }

    let tdEl = document.createElement("td");

    // add class for sortable table. for dates, we want to sort by timestamp
    if (value instanceof Date) {
      tdEl.className = "timestamp";
      tdEl.dataset.timestamp = value.getTime().toString();
    } else {
      tdEl.className = key.replaceAll(" ", "-").toLowerCase();
    }

    // create link
    if (key === config.link?.textField) {
      tdEl.classList.add("show-record");

      let linkEl = document.createElement("a");
      linkEl.className = "resource-link";
      linkEl.dataset.resourceId = row.get(config.link.idField);
      linkEl.href = `/${config.link.path}/?id=${row.get(config.link.idField)}`;
      linkEl.textContent = value;

      tdEl.appendChild(linkEl);
    } else if (value instanceof Date) {
      tdEl.innerText = value.toLocaleDateString();
    } else {
      tdEl.innerHTML = value;
    }
    rowEl.appendChild(tdEl);
  });

  return rowEl;
}

function addSortableTable(searchTerm) {
  // https://github.com/javve/list.js/issues/221 sorting dates
  var options = {
    valueNames: [
      ...headerClasses,
      { name: "timestamp", attr: "data-timestamp" },
      { name: "resource-link", attr: "data-resource-id" },
    ],
  };
  let sortableTable = new List("data-container", options);

  let inputEl = document.querySelector("#search-form");
  if (searchTerm) {
    // update rows in table based on search term
    sortableTable.search(searchTerm);
    // update value shown in <input>
    inputEl.value = searchTerm;
  }

  // create event so we can track the number of items shown in sortable table
  sortableTable.on("updated", (e) => {
    let items = sortableTable.matchingItems.map((i) => i.values());

    if (inputEl) {
      window.dispatchEvent(
        new CustomEvent("listUpdated", {
          detail: { items, value: inputEl.value },
        }),
      );
    }
  });
}

//==========================
// create table with field names in first column, values in second column
//==========================

function createFieldValueRow(field, value) {
  let row = document.createElement("tr");

  let headerCell = document.createElement("th");
  headerCell.textContent = field;
  headerCell.style.textAlign = "left";
  row.appendChild(headerCell);

  let valueCell = document.createElement("td");
  if (value instanceof Date) {
    valueCell.textContent = value.toLocaleDateString();
  } else {
    valueCell.textContent = value;
  }
  row.appendChild(valueCell);
  return row;
}

export function createFieldValueTable(data, fields, selector = null) {
  let table = document.createElement("table");
  if (selector) {
    table.className = selector;
  }

  fields.forEach((field) => {
    if (data[field] === "") return;

    let row = createFieldValueRow(field, data[field]);
    table.appendChild(row);
  });

  return table;
}
//==========================
// misc
//==========================

export function renderPageIntro(configData) {
  if (configData.title) {
    let titleEl = document.querySelector(".title");
    if (titleEl) {
      titleEl.textContent = configData.title;
    }
  }
  if (configData.summary) {
    let summaryEl = document.querySelector(".summary");
    if (summaryEl) {
      summaryEl.innerText = configData.summary;
    }
  }
}
