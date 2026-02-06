import { createFieldValueTable, createTable } from "../lib/dataTable.js";
import { html, setupComponent } from "../lib/component_utils.js";
import { config } from "../../config.js";

let template = html`
  <h1 class="title"></h1>
  <div id="model-data"></div>
  <div id="units-container"></div>
`;

export class ModelDetailsPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    setupComponent(template, this);

    this.id = this.data.toLowerCase();

    // @ts-ignore
    this.models = app.store.models.filter((m) => m["Oli Id"].toLowerCase() === this.id);

    this.model = this.models[0];

    // @ts-ignore
    this.units = app.store.units.filter((m) => m["Oli Id"].toLowerCase() === this.id);

    if (this.model) {
      this.render();
    } else {
      this.renderNoData();
    }
  }

  render() {
    let titleEl = this.querySelector("h1");
    if (titleEl) {
      titleEl.textContent = `${this.model.Model} ${this.model["Top Wood"]}/${this.model["Back Wood"]} ${this.model["Size"]}`;
    }

    let modelDataEl = this.querySelector("#model-data");

    if (modelDataEl) {
      let fields = config.modelDetails.modelFields;
      modelDataEl.appendChild(createFieldValueTable(this.model, fields));

      if (this.models && this.models.length > 1) {
        let heading = document.createElement("h2");
        heading.textContent = "Variations";
        modelDataEl.appendChild(heading);

        let table = createTable(this.models, config.modelDetails, "variations");
        modelDataEl.appendChild(table);
      }
    }

    let containerEl = this.querySelector("#units-container");
    if (containerEl) {
      this.units?.forEach((unit) => {
        containerEl.append(renderUnit(unit));
      });
    }
  }

  renderNoData() {
    const template = document.getElementById("model-page-template");
    if (template) {
      const content = template.content.cloneNode(true);
      this.appendChild(content);

      let titleEl = this.querySelector("h1");
      if (titleEl) {
        titleEl.textContent = `No data for ${this.id}`;
      }
    }
  }
}

function renderUnit(data) {
  let cardEl = document.createElement("div");
  cardEl.className = "card";

  // embeded video
  if (data["Video Id"] && data["Video Provider"]) {
    let videoEl = document.createElement("video-embed");
    videoEl.dataset.videoId = data["Video Id"];
    videoEl.dataset.videoProvider = data["Video Provider"];

    cardEl.append(videoEl);
  }

  // title
  if (data["Listing Title"] && data["Listing Url"]) {
    let titleEl = document.createElement("h2");

    let linkEl = document.createElement("a");
    linkEl.href = data["Listing Url"];
    linkEl.textContent = data["Listing Title"];
    titleEl.appendChild(linkEl);

    cardEl.append(titleEl);
  }

  // data table
  let fields = config.modelDetails.unitFields;
  let tableEl = createFieldValueTable(data, fields, "unit-metadata");
  cardEl.appendChild(tableEl);

  return cardEl;
}

customElements.define("model-page", ModelDetailsPage);
