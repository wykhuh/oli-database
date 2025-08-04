import { createFieldValueTable } from "../js/dataTable.js";

export class ModelPage extends HTMLElement {
  render() {
    const template = document.getElementById("model-page-template");
    if (template) {
      const content = template.content.cloneNode(true);
      this.appendChild(content);

      let titleEl = this.querySelector("h1");
      if (titleEl) {
        titleEl.textContent = `${this.model.Model} ${this.model["Top Wood"]}/${this.model["Back Wood"]} ${this.model["Size"]}`;
      }

      let modelDataEl = this.querySelector("#model-data");
      if (modelDataEl) {
        let fields = app.store.config.modelDetails.modelFields;
        modelDataEl.appendChild(createFieldValueTable(this.model, fields));
      }

      let containerEl = this.querySelector("#units-container");
      if (containerEl) {
        this.units?.forEach((unit) => {
          containerEl.append(renderUnit(unit));
        });
      }
    }
  }

  connectedCallback() {
    let id = this.params && this.params[0];
    // let id = "fb086c5a7cae318e3031d62c7f0cc0ca"; // vimeo
    // let id = "f8e2f0955694a60036f37491c15bcca4"; // multple units

    this.model = app.store.models.find((m) => m["Oli Id"] === id);
    this.units = app.store.units.filter((m) => m["Oli Id"] === id);

    this.render();
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
  let fields = app.store.config.modelDetails.unitFields;
  let tableEl = createFieldValueTable(data, fields);
  cardEl.appendChild(tableEl);

  return cardEl;
}

customElements.define("model-page", ModelPage);
