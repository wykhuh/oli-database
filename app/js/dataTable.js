let headerClasses = [];
let allRecords = [];
let listRecords = [];
let appEl;
let searchEl;
let allRecordsEl;
let showAllEl;
let oneRecordEl;

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

export function renderTabularData(data, config) {
  searchEl = document.getElementById("search-form");
  if (searchEl == undefined) return;

  appEl = document.getElementById("data-container");
  if (appEl == undefined) return;

  allRecords = processAllData(data);
  listRecords = processListData(allRecords, config);
  displayAllRecords(listRecords, config);

  addSortableTable();
}

function createListTable(data, config) {
  allRecordsEl = document.createElement("table");
  appEl.appendChild(allRecordsEl);
  allRecordsEl.className = "list-table";

  //  create header row
  let theadEl = document.createElement("thead");
  theadEl.appendChild(createHeaderRow(data[0], config));
  allRecordsEl.appendChild(theadEl);

  // created table body
  let tbodyEl = document.createElement("tbody");
  tbodyEl.className = "list";

  // create rows
  data.forEach((row) => {
    tbodyEl.appendChild(createRow(row, config));
  });

  allRecordsEl.appendChild(tbodyEl);
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
    let headerClass = key.replace(" ", "-").toLowerCase();
    headerEl.dataset.sort = headerClass;
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

    tdEl.className = key.replace(" ", "-").toLowerCase();

    if (key === config.link?.textField) {
      tdEl.classList.add("show-record");
      tdEl.innerHTML = `<a data-resource-id="${row.get(
        config.link.idField
      )}" class="resource-link" href="/${config.link.path}/${row.get(
        config.link.idField
      )}">${value}</a>`;
    } else {
      tdEl.innerText = value;
    }
    rowEl.appendChild(tdEl);
  });

  return rowEl;
}

function createShowAllButton() {
  showAllEl = document.createElement("button");
  showAllEl.className = "show-all";
  showAllEl.innerText = "Show all records";

  showAllEl.className = "show-all";
  showAllEl.onclick = () => displayAllRecords();

  appEl.appendChild(showAllEl);
}

function displayAllRecords(data, config) {
  if (allRecordsEl) allRecordsEl.classList.remove("hidden");
  if (searchEl) searchEl.classList.remove("hidden");
  if (showAllEl) showAllEl.remove();
  if (oneRecordEl) oneRecordEl.remove();

  if (allRecordsEl == undefined) {
    createListTable(data, config);
  }
}

function addSortableTable() {
  var options = {
    valueNames: headerClasses,
  };
  new List("data-container", options);
}

//==========================
// one record table
//==========================

function createDetailsTable(row) {
  oneRecordEl = document.createElement("table");
  appEl.appendChild(oneRecordEl);

  row.forEach((value, key) => {
    let trEl = document.createElement("tr");

    let thEl = document.createElement("th");
    thEl.innerText = key;

    trEl.appendChild(thEl);

    let tdEl = document.createElement("td");
    tdEl.innerText = value;

    trEl.appendChild(tdEl);

    oneRecordEl.appendChild(trEl);
  });
}

function displayOneRecord(rowIndex) {
  if (allRecordsEl) allRecordsEl.classList.add("hidden");
  if (searchEl) searchEl.classList.add("hidden");
  if (showAllEl) showAllEl.remove();
  if (oneRecordEl) oneRecordEl.remove();

  createShowAllButton();
  createDetailsTable(allRecords[rowIndex]);
}

//==========================
// misc
//==========================

function renderError(error) {
  appEl = document.getElementById("data-container");
  if (appEl == undefined) return;
  appEl.innerText = error;
  appEl.classList.add("error");
}

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
