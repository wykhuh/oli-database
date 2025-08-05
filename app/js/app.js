import { getAndParseCSV } from "./dataTable.js";
import { Router } from "./router.js";
import Store from "./store.js";
import "../components/VideoEmbed.js";

window.app = {};
app.store = Store;
app.router = Router;

window.addEventListener("DOMContentLoaded", async () => {
  let loaderEl = document.getElementById("loader");
  if (!loaderEl) return;

  loaderEl.className = "loading";
  let models = await getAndParseCSV("../data/models_list.csv");
  let units = await getAndParseCSV("../data/units_list.csv");
  app.store.models = models.filter((item) =>
    Object.values(item).some((v) => v !== "")
  );
  app.store.units = units.filter((item) =>
    Object.values(item).some((v) => v !== "")
  );

  app.store.config = {
    home: {
      title: "'Oli Ukuleles",
      displayFields: [
        "Model",
        "Tier",
        "Size",
        "Top Wood",
        "Back Wood",
        "Finish",
      ],
      link: { textField: "Model", idField: "Oli Id", path: "models" },
    },
    modelDetails: {
      modelFields: [
        "Model",
        "Tier",
        "Size",
        "Top Wood",
        "Back Wood",
        "Finish",
        "Limited Edition",
      ],
      unitFields: [
        "Price",
        "Serial Number",
        "Model Notes",
        "Notes",
        "Video Id",
      ],
    },
  };

  Router.init();
  loaderEl.className = "";
});
