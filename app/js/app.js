import { getAndParseCSV } from "./dataTable.js";
import { Router } from "./router.js";
import Store from "./store.js";
import "../components/VideoEmbed.js";

window.app = {};
app.store = Store;
app.router = Router;

function cleanData(data) {
  return (
    data
      // filter out blank rows where all fields are empty
      .filter((item) => Object.values(item).some((v) => v !== ""))
      // convert to date
      .map((item) => {
        let date = new Date(item["Video Published At"]);
        return { ...item, "Video Published At": date };
      })
  );
}

window.addEventListener("DOMContentLoaded", async () => {
  let loaderEl = document.getElementById("loader");
  if (!loaderEl) return;

  loaderEl.className = "loading";
  let models = await getAndParseCSV("../data/models_list.csv");
  let units = await getAndParseCSV("../data/units_list.csv");
  app.store.models = cleanData(models);
  app.store.units = cleanData(units);

  app.store.config = {
    home: {
      title: "'Oli Models",
      displayFields: [
        "Model",
        "Tier",
        "Type",
        "Size",
        "Top Wood",
        "Back Wood",
        "Finish",
        "Video Published At",
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
      displayFields: ["Top Wood", "Back Wood"],
      unitFields: [
        "Top Wood",
        "Back Wood",
        "Price",
        "Serial Number",
        "Model Notes",
        "Notes",
        "Video Published At",
        "Limited Edition",
      ],
    },
  };

  Router.init();
  loaderEl.className = "";
});
