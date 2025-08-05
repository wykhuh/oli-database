import { ModelsListPage } from "../components/ModelsListPage.js";
import { ModelDetailsPage } from "../components/ModelDetailsPage.js";

export const routes = [
  {
    path: "/",
    component: ModelsListPage,
  },
  {
    path: /\/models\/([\w-]+)/,
    component: ModelDetailsPage,
  },
];
