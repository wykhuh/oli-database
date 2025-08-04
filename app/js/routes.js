import { ModelsListPage } from "../components/ModelsListPage.js";
import { ModelPage } from "../components/ModelPage.js";

export const routes = [
  {
    path: "/",
    component: ModelsListPage,
  },
  {
    path: /\/models\/(\w+)/,
    component: ModelPage,
  },
];
