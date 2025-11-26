import { createTable, getAndParseCSV } from "./dataTable.js";
import "../components/Header.js";

async function init() {
  let loaderEl = document.getElementById("loader");
  if (!loaderEl) return;
  let mainEl = document.querySelector("main");
  if (!mainEl) return;
  let containerEl = document.querySelector(".table-container");
  if (!containerEl) return;

  loaderEl.className = "loading";

  let rawModels = await getAndParseCSV("../data/model_comparison.csv");

  let config = {
    displayFields: ["Feature", "L", "L1", "L2", "L3", "X1", "X2", "X3"],
  };
  let table = createTable(rawModels, config);
  containerEl.appendChild(table);

  loaderEl.className = "";
}

init();
