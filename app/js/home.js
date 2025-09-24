import { getAndParseCSV } from "./dataTable.js";
import Store from "./store.js";
import "../components/VideoEmbed.js";
import { ModelsListPage } from "../components/ModelsListPage.js";
import { cleanData } from "./utils.js";

window.app = {};
app.store = Store;

async function init() {
  let loaderEl = document.getElementById("loader");
  if (!loaderEl) return;
  let mainEl = document.querySelector("main");
  if (!mainEl) return;

  loaderEl.className = "loading";
  mainEl.innerHTML = "";

  let rawModels = await getAndParseCSV("../data/models_list.csv");
  app.store.models = cleanData(rawModels);

  let pageElement = new ModelsListPage();
  mainEl.appendChild(pageElement);

  loaderEl.className = "";
}

init();
