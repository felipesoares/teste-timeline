import React, { lazy } from "react";

const HomePage = lazy(() => import("./containers/HomePage"));
const NotFoundPage = lazy(() => import("./containers/NotFoundPage"));

export const routes = [
  { path: "/", exact: true, name: "HomePage", component: HomePage },
  // {
  //   path: "/foo/:id",
  //   exact: true,
  //   name: "FooPage",
  //   component: FooPage
  // },
  {
    path: "",
    exact: true,
    name: "NotFoundPage",
    component: NotFoundPage
  }
];
