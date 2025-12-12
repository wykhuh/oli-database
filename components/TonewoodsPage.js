import { html, setupComponent } from "../js/component_utils.js";
import { createTable, renderSortableTable } from "../js/dataTable.js";
import { pluralize } from "../js/utils.js";
import { config } from "../js/config.js";

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
    renderSortableTable(
      tonewoods,
      config.tonewoods,
      "tonewoods-table",
      searchTerm
    );

    this.renderCounter();
  }

  renderCounter() {
    let counterEl = document.getElementById("counter");

    if (counterEl) {
      counterEl.textContent = pluralize(app.store.tonewoods.length, "tonewood");

      window.addEventListener("listUpdated", (e) => {
        counterEl.textContent = pluralize(e.detail.items.length, "tonewood");
      });
    }
  }
}

customElements.define("tonewoods-page", TonewoodsPage);
