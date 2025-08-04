import { routes } from "./routes.js";

// if we only need one instance of an object, use javascript objects
// instead of class
export const Router = {
  init: () => {
    // popstate - go back in history
    window.addEventListener("popstate", () => {
      Router.go(window.location.pathname, false);
    });

    // go to route on app load
    Router.go(window.location.pathname);
  },
  go: (route, addToHistory = true) => {
    if (addToHistory) {
      history.pushState(null, "", route);
    }

    let pageElement = null;
    const routePath = route.includes("?") ? route.split("?")[0] : route;

    // loop through list of hardcoded routes to find matching component for
    // current route.
    // route can be string or regex
    for (const r of routes) {
      if (typeof r.path === "string" && r.path === routePath) {
        pageElement = new r.component();
        break;
      } else if (r.path instanceof RegExp) {
        const match = r.path.exec(route);
        if (match) {
          pageElement = new r.component();
          const params = match.slice(1);
          pageElement.params = params;
          break;
        }
      }
    }

    // handle invlaid routes
    if (pageElement == null) {
      pageElement = document.createElement("h1");
      pageElement.textContent = "Page not found";
    }

    function updatePage() {
      document.querySelector("main").innerHTML = "";
      document.querySelector("main")?.appendChild(pageElement);
    }
    updatePage();
  },
};
