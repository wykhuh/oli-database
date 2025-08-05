let headerClasses = [];
let allRecords = [];
let listRecords = [];

//==========================
// fetch and process CSV
//==========================

export function getAndParseCSV(url, header = true, download = true) {
  return new Promise((resolve, reject) => {
    Papa.parse(url, {
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
  return data.map((row) => {
    return new Map(Object.entries(row));
  });
}

//==========================
// configuration
//==========================

export function processConfig(configData) {
  let displayFields = [];
  let title = "";
  let summary = "";

  configData.forEach((row) => {
    switch (row[0]) {
      case "displayFields":
        displayFields = row[1].split(",").map((field) => field.trim());
        break;
      case "title":
        title = row[1].trim();
        break;
      case "summary":
        summary = row[1].trim();
        break;
      default:
        break;
    }
  });

  return { displayFields, title, summary };
}

//==========================
// all records table
//==========================

export function renderSortableTable(data, config) {
  let searchEl = document.getElementById("search-form");
  if (searchEl == undefined) return;

  let dataContainerEl = document.getElementById("data-container");
  if (dataContainerEl == undefined) return;

  allRecords = processAllData(data);
  listRecords = processListData(allRecords, config);

  let table = createListTable(listRecords, config);
  dataContainerEl.appendChild(table);

  addSortableTable();
}

export function createTable(data, config = {}) {
  allRecords = processAllData(data);
  listRecords = processListData(allRecords, config);

  return createListTable(listRecords, config);
}

function createListTable(data, config) {
  let table = document.createElement("table");
  table.className = "list-table stripe-table";

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
    let headerClass = key.replaceAll(" ", "-").toLowerCase();
    headerEl.dataset.sort = headerClass;
    if (value instanceof Date) {
      headerEl.dataset.sort = "timestamp";
    } else {
      headerEl.dataset.sort = headerClass;
    }
    headerEl.className = "sort";
    headerClasses.push(headerClass);

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
      linkEl.dataset.rescoureId = row.get(config.link.idField);
      linkEl.href = `/${config.link.path}/${row.get(config.link.idField)}`;
      linkEl.textContent = value;

      tdEl.appendChild(linkEl);
    } else if (value instanceof Date) {
      tdEl.innerText = value.toLocaleDateString();
    } else {
      tdEl.innerText = value;
    }
    rowEl.appendChild(tdEl);
  });

  return rowEl;
}

function addSortableTable() {
  // https://github.com/javve/list.js/issues/221 sorting dates
  var options = {
    valueNames: [
      ...headerClasses,
      { name: "timestamp", attr: "data-timestamp" },
    ],
  };
  let sortableTable = new List("data-container", options);

  // create event so we can track the number of items shown in sortable table
  sortableTable.on("updated", () => {
    window.dispatchEvent(
      new CustomEvent("listUpdated", {
        detail: { visibleItemsCount: sortableTable.visibleItems.length },
      })
    );
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

export function createFieldValueTable(data, fields) {
  let table = document.createElement("table");
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
