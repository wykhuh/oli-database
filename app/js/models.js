import { getAndParseCSV } from "./dataTable.js";
import Store from "./store.js";
import "../components/VideoEmbed.js";
import { ModelDetailsPage } from "../components/ModelDetailsPage.js";
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

  const params = new URLSearchParams(window.location.search);
  let id = params.get("id");
  if (!id) return;

  let rawModels = await getAndParseCSV("../data/models_list.csv");
  let rawUnits = await getAndParseCSV("../data/units_list.csv");

  app.store.models = cleanData(rawModels);
  app.store.units = cleanData(rawUnits);

  let pageElement = new ModelDetailsPage();
  pageElement.data = id;
  mainEl.appendChild(pageElement);

  loaderEl.className = "";
}

init();
