import { renderSortableTable, renderPageIntro } from "../js/dataTable.js";

export class ModelsListPage extends HTMLElement {
  async render() {
    renderPageIntro(app.store.config.home);
    renderSortableTable(app.store.models, app.store.config.home);
  }

  renderCounter() {
    function formatText(length) {
      return `${length} ukulele model${length !== 1 && "s"}`;
    }

    let counterEl = document.getElementById("model-counter");

    if (counterEl) {
      counterEl.textContent = formatText(app.store.models.length);

      window.addEventListener("listUpdated", (e) => {
        counterEl.textContent = formatText(e.detail.visibleItemsCount);
      });
    }
  }

  connectedCallback() {
    const template = document.getElementById("home-page-template");

    if (template) {
      const content = template.content.cloneNode(true);
      this.appendChild(content);

      this.render();
      this.renderCounter();
    }
  }
}

customElements.define("home-page", ModelsListPage);
