import { renderSortableTable, renderPageIntro } from "../js/dataTable.js";
import { pluralize } from "../js/utils.js";

export class ModelsListPage extends HTMLElement {
  async render() {
    renderPageIntro(app.store.config.home);
    renderSortableTable(app.store.models, app.store.config.home);
    this.renderCounter();
  }

  renderCounter() {
    function formatText(models) {
      let links = new Set(
        models
          .filter((m) => m["model"])
          .map((m) => {
            return m["model"].match(/>(.*?)<\/a>/)[1];
          })
      );
      let ids = new Set(models.map((m) => m["Model"]));
      let count = Math.max(links.size, ids.size);

      return `${pluralize(count, "model")}, ${pluralize(
        models.length,
        "variation"
      )} `;
    }

    let counterEl = document.getElementById("model-counter");

    if (counterEl) {
      counterEl.textContent = formatText(app.store.models);

      window.addEventListener("listUpdated", (e) => {
        counterEl.textContent = formatText(e.detail.items);
      });
    }
  }

  connectedCallback() {
    const template = document.getElementById("home-page-template");

    if (template) {
      const content = template.content.cloneNode(true);
      this.appendChild(content);

      this.render();
    }
  }
}

customElements.define("home-page", ModelsListPage);
