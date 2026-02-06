import { html, setupComponent } from "../lib/component_utils.js";
import { renderSortableTable, renderPageIntro } from "../lib/dataTable.js";
import { pluralize, updateURL } from "../lib/utils.js";
import { config } from "../../config.js";
import "./Tooltip.js";

let template = html`
  <h1 class="title"></h1>
  <div class="summary"></div>

  <div id="data-container">
    <input id="search-form" class="search" placeholder="Search" />
    <div class="details">
      <p id="model-counter"></p>
      <span>
        <button data-js="create-playlist">Create Playlist</button>
        <app-tooltip
          data-id="tp-observed_d1"
          data-content="?"
          data-tooltip="To create a playlist, select models by clicking the checkbox. You can use  search and click on headers to sort to narrow down the models listed. Then Click 'Create Playlist' button. You will be redirected to playlist page with the selected models. The models are listed in the url, so you can bookmark the playlist." "
        ></app-tooltip>
      </span>
    </div>
  </div>
`;

export class ModelsListPage extends HTMLElement {
  constructor() {
    super();
  }

  buttonEl;

  connectedCallback() {
    setupComponent(template, this);

    this.render();

    document.querySelectorAll("input.model").forEach((item) => {
      item.addEventListener("click", this);
    });

    this.buttonEl = document.querySelector("[data-js='create-playlist']");
    if (this.buttonEl) {
      this.buttonEl.addEventListener("click", this);
    }
  }

  disconnectedCallback() {
    document.querySelectorAll("input.model").forEach((item) => {
      item.removeEventListener("click", this);
    });
  }

  handleEvent(event) {
    let target = event.target;

    if (event.type === "click") {
      if (target.className === "model") {
        if (target.dataset.id) {
          app.store.playlistModels.add(target.dataset.id);
        }
      } else if (target.dataset.js === "create-playlist") {
        if (app.store.playlistModels.size === 0) return;
        let ids = [...app.store.playlistModels].join(",");
        window.location.replace(`/playlist/?id=${ids}`);
      }
    }
  }

  async render() {
    renderPageIntro(config.home);
    let searchTerm = new URLSearchParams(document.location.search).get("q");
    renderSortableTable(app.store.models, config.home, "models-table", searchTerm);
    this.renderCounter();
  }

  renderCounter() {
    function formatText(models) {
      let links = new Set(
        models
          .filter((m) => m["model"])
          .map((m) => {
            return m["model"].match(/>(.*?)<\/a>/)[1];
          }),
      );
      let ids = new Set(models.map((m) => m["Model"]));
      let count = Math.max(links.size, ids.size);

      return `${pluralize(count, "model")}, ${pluralize(models.length, "variation")} `;
    }

    let counterEl = document.getElementById("model-counter");

    if (counterEl) {
      counterEl.textContent = formatText(app.store.models);

      window.addEventListener("listUpdated", (e) => {
        counterEl.textContent = formatText(e.detail.items);
        updateURL(e);
      });
    }
  }
}

customElements.define("home-page", ModelsListPage);
