import { getAndParseCSV } from "./dataTable.js";
import { Router } from "./router.js";
import Store from "./store.js";

window.app = {};
app.store = Store;
app.router = Router;

window.addEventListener("DOMContentLoaded", async () => {
  let loaderEl = document.getElementById("loader");
  if (!loaderEl) return;

  loaderEl.className = "loading";
  app.store.models = await getAndParseCSV("../data/models_list.csv");
  app.store.config = {
    title: "'Oli Ukuleles",
    displayFields: ["Model", "Tier", "Size", "Top Wood", "Back Wood", "Finish"],
    link: { textField: "Model", idField: "oli_id", path: "models" },
  };

  Router.init();
  loaderEl.className = "";
});
