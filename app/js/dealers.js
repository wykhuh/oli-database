import { getAndParseCSV } from "./dataTable.js";

import "../components/Header.js";

function createUnit(storeData) {
  return `
  <dt>${storeData.store}</dt>
  <dd>
    <p>${storeData.location}</p>
    <p><a href="${storeData.website}">Website</a></p>
  <dd>
  `;
}
async function init() {
  let naDealersEl = document.querySelector(".northamerica_dealers");
  if (!naDealersEl) return;
  let euDealersEl = document.querySelector(".europe_dealers");
  if (!euDealersEl) return;

  let rawStores = await getAndParseCSV("../data/dealers.csv");

  let naDealers = "";
  rawStores
    .filter((store) => store.continent === "North America")
    .forEach((store) => {
      naDealers += createUnit(store);
    });
  naDealersEl.innerHTML = naDealers;

  let euDealers = "";
  rawStores
    .filter((store) => store.continent === "Europe")
    .forEach((store) => {
      euDealers += createUnit(store);
    });
  euDealersEl.innerHTML = euDealers;
}

init();
