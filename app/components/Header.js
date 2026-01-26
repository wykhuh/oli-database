import { html, setupComponent } from "../js/component_utils.js";

let template = html`
  <header>
    <nav id="main-nav">
      <ul>
        <li>'Oli Database</li>
        <li><a class="navlink" href="/">Models</a></li>
        <li>
          <a class="navlink" href="/tonewoods/">Tonewoods</a>
        </li>
        <li>
          <a class="navlink" href="/models-comparison/">Model Comparison</a>
        </li>
        <li>
          <a class="navlink" href="/dealers/">Dealers</a>
        </li>
      </ul>
    </nav>
  </header>
`;

class AppHeader extends HTMLElement {
  constructor() {
    super();
  }

  connectedCallback() {
    setupComponent(template, this);
  }
}

customElements.define("app-header", AppHeader);
