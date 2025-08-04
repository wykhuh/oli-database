import { renderTabularData, renderPageIntro } from "../js/dataTable.js";

export class ModelsListPage extends HTMLElement {
  async render() {
    renderPageIntro(app.store.config.home);
    renderTabularData(app.store.models, app.store.config.home);
    let links = document.querySelectorAll(".list-table .resource-link");
    if (links.length > 0) {
      links.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          app.router.go(e.target.href);
        });
      });
    }
  }

  connectedCallback() {
    const template = document.getElementById("home-page-template");
    if (template) {
      const content = template.content.cloneNode(true);
      this.appendChild(content);
    }

    this.render();
  }
}

customElements.define("home-page", ModelsListPage);
