import { getAndParseCSV } from "./dataTable.js";
import Store from "./store.js";
import { cleanData } from "./utils.js";
import "../components/Header.js";
import { TonewoodsPage } from "../components/TonewoodsPage.js";

window.app = {};
app.store = Store;

async function init() {
  let loaderEl = document.getElementById("loader");
  if (!loaderEl) return;
  let mainEl = document.querySelector("main");
  if (!mainEl) return;

  loaderEl.className = "loading";
  mainEl.innerHTML = "";

  let rawModels = await getAndParseCSV("/data/tonewoods.csv");
  app.store.tonewoods = cleanData(rawModels);

  let pageElement = new TonewoodsPage();
  mainEl.appendChild(pageElement);

  loaderEl.className = "";
}

init();
