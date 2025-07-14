import {
  processConfig,
  getAndParseCSV,
  renderTabularData,
  renderPageIntro,
} from "./dataTable.js";

window.addEventListener("DOMContentLoaded", async () => {
  let loaderEl = document.getElementById("loader");

  if (loaderEl) {
    loaderEl.className = "loading";

    let configData = await getAndParseCSV("./config.csv", false, true);
    let config = processConfig(configData);

    let allRecords = await getAndParseCSV("../data/oli_lists.csv", true, true);
    allRecords = allRecords.filter((row) => row.Model);
    // console.log(allRecords[0]);

    loaderEl.className = "";
    renderPageIntro(config);
    renderTabularData(allRecords, config);
  }
});
