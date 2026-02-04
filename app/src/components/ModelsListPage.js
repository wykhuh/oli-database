import { html, setupComponent } from "../lib/component_utils.js";
import { renderSortableTable, renderPageIntro } from "../lib/dataTable.js";
import { pluralize, updateURL } from "../lib/utils.js";
import { config } from "../lib/config.js";

let template = html`
  <h1 class="title"></h1>
  <div class="summary"></div>

  <div id="data-container">
    <input id="search-form" class="search" placeholder="Search" />
    <p id="model-counter"></p>
  </div>
`;

export class ModelsListPage extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    setupComponent(template, this);

    this.render();
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
