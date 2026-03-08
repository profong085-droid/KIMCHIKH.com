import { createBrowserRouter } from "react-router";
import { Root } from "./Root";
import { Home } from "./pages/Home";
import { About } from "./pages/About";
import { Gallery } from "./pages/Gallery";
import { News } from "./pages/News";
import { Shop } from "./pages/Shop";
import { NotFound } from "./pages/NotFound";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Root,
    children: [
      { index: true, Component: Home },
      { path: "about", Component: About },
      { path: "gallery", Component: Gallery },
      { path: "news", Component: News },
      { path: "shop", Component: Shop },
      { path: "*", Component: NotFound },
    ],
  },
]);
