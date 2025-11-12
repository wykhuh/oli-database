import { getAndParseCSV } from "./dataTable.js";
import { renderNav } from "./utils.js";

async function init() {
  renderNav();

  let loaderEl = document.getElementById("loader");
  if (!loaderEl) return;
  let mainEl = document.querySelector("main");
  if (!mainEl) return;

  loaderEl.className = "loading";

  let rawModels = await getAndParseCSV("../data/model_comparison.csv");

  let tableEl = document.createElement("table");
  tableEl.className = "list-table stripe-table";

  let headerRow = document.createElement("tr");
  addTH("Feature", headerRow);
  addTH("L", headerRow);
  addTH("L1", headerRow);
  addTH("L2", headerRow);
  addTH("L3", headerRow);
  addTH("X1", headerRow);
  addTH("X2", headerRow);
  addTH("X3", headerRow);
  tableEl.appendChild(headerRow);

  rawModels.forEach((row) => {
    if (row.Feature) {
      addRow(row, tableEl);
    }
  });

  mainEl.appendChild(tableEl);

  loaderEl.className = "";
}

function addTH(text, rowEl) {
  let thEl = document.createElement("th");
  thEl.innerText = text;
  rowEl.appendChild(thEl);
}

function addTD(text, rowEl) {
  let tdEl = document.createElement("td");
  tdEl.innerText = text;
  rowEl.appendChild(tdEl);
}

function addRow(row, tableEl) {
  let rowEl = document.createElement("tr");

  addTD(row.Feature, rowEl);
  addTD(row.L, rowEl);
  addTD(row.L1, rowEl);
  addTD(row.L2, rowEl);
  addTD(row.L3, rowEl);
  addTD(row.X1, rowEl);
  addTD(row.X2, rowEl);
  addTD(row.X3, rowEl);

  tableEl.appendChild(rowEl);
}

init();
