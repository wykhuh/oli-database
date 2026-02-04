import { html, setupComponent } from "../lib/component_utils.js";
import { createTable, renderSortableTable } from "../lib/dataTable.js";
import { pluralize, updateURL } from "../lib/utils.js";
import { config } from "../lib/config.js";

let template = html`
  <h1 class="title">Tonewoods</h1>

  <div id="data-container">
    <input id="search-form" class="search" placeholder="Search" />
    <p id="counter"></p>
  </div>
`;

export class TonewoodsPage extends HTMLElement {
  constructor() {
    super();
  }

  formatModels(text) {
    return text
      .split(";")
      .map((t) => {
        const [text, id] = t.split("|");
        return `<a href="/models/?id=${id}">${text}</a>`;
      })
      .join("\n");
  }

  connectedCallback() {
    setupComponent(template, this);

    const tonewoods = app.store.tonewoods.map((tonewood) => {
      return {
        ...tonewood,
        Soprano: this.formatModels(tonewood.Soprano),
        Concert: this.formatModels(tonewood.Concert),
        Tenor: this.formatModels(tonewood.Tenor),
        Baritone: this.formatModels(tonewood.Baritone),
      };
    });
    let searchTerm = new URLSearchParams(document.location.search).get("q");
    renderSortableTable(tonewoods, config.tonewoods, "tonewoods-table", searchTerm);

    this.renderCounter();
  }

  renderCounter() {
    let counterEl = document.getElementById("counter");

    if (counterEl) {
      counterEl.textContent = pluralize(app.store.tonewoods.length, "tonewood");

      window.addEventListener("listUpdated", (e) => {
        counterEl.textContent = pluralize(e.detail.items.length, "tonewood");
        updateURL(e);
      });
    }
  }
}

customElements.define("tonewoods-page", TonewoodsPage);
