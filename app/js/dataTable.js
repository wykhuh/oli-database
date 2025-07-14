let headerClasses = [];
let allRecords = [];
let listRecords = [];
let appEl;
let searchEl;
let allRecordsEl;
let showAllEl;
let oneRecordEl;
let showMore;

//==========================
// fetch and process CSV
//==========================

export function getAndParseCSV(url, header = true, download = false) {
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
  // use Map instead of object to guarantee order of the keys
  let listRecords = [];

  if (config.displayFields.length > 0) {
    data.forEach((row) => {
      let newRow = new Map();
      config.displayFields.forEach((field) => {
        newRow.set(field, row.get(field));
      });
      listRecords.push(newRow);
    });
  } else {
    listRecords = data;
  }

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

  showMore = config.displayFields.length > 0;
  allRecords = processAllData(data);
  listRecords = processListData(allRecords, config);

  displayAllRecords(listRecords);

  addSortableTable();
}

function createListTable(data) {
  allRecordsEl = document.createElement("table");
  appEl.appendChild(allRecordsEl);

  let theadEl = document.createElement("thead");
  allRecordsEl.appendChild(theadEl);

  theadEl.appendChild(createHeaderRow(data));

  let tbodyEl = document.createElement("tbody");
  tbodyEl.className = "list";
  allRecordsEl.appendChild(tbodyEl);

  data.forEach((row, i) => {
    tbodyEl.appendChild(createRow(row, i));
  });
}

function createHeaderRow(data) {
  let rowEl = document.createElement("tr");
  let row = data[0];

  row.forEach((value, key) => {
    let headerEl = document.createElement("th");
    headerEl.innerText = key;

    // add html markup for sortable table
    let headerClass = key.replace(" ", "-").toLowerCase();
    headerEl.dataset.sort = headerClass;
    headerEl.className = "sort";
    headerClasses.push(headerClass);

    rowEl.appendChild(headerEl);
  });

  if (showMore) {
    let headerEl = document.createElement("th");
    rowEl.appendChild(headerEl);
  }

  return rowEl;
}

function createRow(row, rowIndex) {
  let rowEl = document.createElement("tr");

  row.forEach((value, key) => {
    let tdEl = document.createElement("td");

    tdEl.innerText = value;
    tdEl.className = key.replace(" ", "-").toLowerCase();
    rowEl.appendChild(tdEl);
  });

  if (showMore) {
    let tdEl = document.createElement("td");
    tdEl.innerText = "show";
    tdEl.className = "show-record";
    tdEl.onclick = () => displayOneRecord(rowIndex);
    rowEl.appendChild(tdEl);
  }

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

function displayAllRecords(data) {
  if (allRecordsEl) allRecordsEl.classList.remove("hidden");
  if (searchEl) searchEl.classList.remove("hidden");
  if (showAllEl) showAllEl.remove();
  if (oneRecordEl) oneRecordEl.remove();

  if (allRecordsEl == undefined) {
    createListTable(data);
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
