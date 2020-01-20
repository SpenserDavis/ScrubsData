import React from "react";
import Lockscreen from "../components/Lockscreen/Lockscreen";

const FullLayout = React.lazy(() => import("../layouts/FullLayout"));
const BlankLayout = React.lazy(() => import("../layouts/BlankLayout"));

var indexRoutes = [
  {
    path: "/",
    name: "home",
    component: BlankLayout,
    authorized: false
  },
  {
    path: "/lockscreen",
    name: "Lockscreen",
    component: Lockscreen,
    authorized: true,
    roles: [
      "SysAdmin",
      "Provider",
      "Office Manager",
      "Office Assistant",
      "Consumer"
    ]
  },

  {
    path: "/",
    name: "dashboard",
    component: FullLayout,
    authorized: true,
    roles: [
      "SysAdmin",
      "Provider",
      "Office Manager",
      "Office Assistant",
      "Consumer"
    ]
  }
];

export default indexRoutes;
