import { getAndParseCSV } from "./dataTable.js";
import Store from "./store.js";
import { PlaylistPage } from "../components/PlaylistPage.js";
import { cleanData, formatVideoList } from "./utils.js";
import "../components/VideoEmbed.js";
import "../components/Header.js";

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

  let rawUnits = await getAndParseCSV("/data/videos_list.csv");
  let units = cleanData(rawUnits);
  app.store.videos = formatVideoList(units, id);
  let pageElement = new PlaylistPage();
  mainEl.appendChild(pageElement);

  loaderEl.className = "";
}

init();
