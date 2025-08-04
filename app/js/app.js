import {
  processConfig,
  getAndParseCSV,
  renderTabularData,
  renderPageIntro,
} from "./dataTable.js";

window.addEventListener("DOMContentLoaded", async (event) => {
  let loaderEl = document.getElementById("loader");

  if (loaderEl) {
    loaderEl.className = "loading";

    renderHomePage(loaderEl);
    loaderEl.className = "";
  }
});

async function renderHomePage(loaderEl) {
  let config = {
    title: "'Oli Ukuleles",
    displayFields: ["Model", "Tier", "Size", "Top Wood", "Back Wood", "Finish"],
    link: { textField: "Model", idField: "oli_id", path: "model" },
  };
  let dataFile = "../data/models_list.csv";
  let data = await getAndParseCSV(dataFile, true, true);
  console.log(data[0]);

  loaderEl.className = "";
  renderPageIntro(config);
  renderTabularData(data, config);

  let links = document.querySelectorAll(".list-table .resource-link");
  if (links.length > 0) {
    links.forEach((link) => {
      link.addEventListener("click", (e) => {
        e.preventDefault();
        console.log(e.target.href);
      });
    });
  }
}
