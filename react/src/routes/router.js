import React from "react";
const DataVisualization = React.lazy(() =>
  import("../components/DataVisualization/DataVisualization")
);
const SurveyOptionForm = React.lazy(() =>
  import("../components/surveyQuestionAnswerOption/SurveyOptionForm")
);
const SurveyQuestionAnswerOption = React.lazy(() =>
  import("../components/surveyQuestionAnswerOption/SurveyQuestionAnswerOption")
);
const Contacts = React.lazy(() => import("../components/Contacts/Contacts"));
const ContactUs = React.lazy(() => import("../components/contactUs/ContactUs"));
const Licenses = React.lazy(() => import("../components/licenses/Licenses"));
const LicenseForm = React.lazy(() =>
  import("../components/licenses/LicenseForm")
);
const Dashboard = React.lazy(() => import("../components/dashboard/Dashboard"));

//...
//redacted (just 160 more lines of component imports)
//...

const headerRoutes = [
  {
    paths: ["/lockscreen"],
    roles: ["Provider", "Office Manager", "Office Assistant", "SysAdmin"],
    component: Lockscreen
  }
];

const sideBarRoutes = [
  {
    navlabel: true,
    path: "/",
    name: "Personal",
    icon: "mdi mdi-dots-horizontal",
    roles: ["Provider", "Office Manager", "Office Assistant", "SysAdmin"]
  },
  {
    path: "/datavisualization",
    name: "Data Visualization",
    icon: "mdi mdi-chart-line",
    component: DataVisualization,

    roles: ["Office Manager", "Office Assistant", "SysAdmin"]
  },
  {
    collapse: true,
    path: "/providers",
    name: "Providers",
    icon: "fas fa-user-plus",
    roles: ["Office Manager", "SysAdmin"],
    component: Providers,
    child: [
      {
        path: "/providers/report",
        name: "Providers Report",
        icon: "mdi mdi-file-excel",
        roles: ["Office Manager", "SysAdmin"],
        component: ProvidersReport
      },
      {
        path: "/providers/noncompliant",
        name: "ProviderNonCompliant",
        icon: "mdi mdi-pistol",
        roles: ["Office Manager", "SysAdmin"],
        component: ProviderNonCompliant
      }
    ]
  }

  //...
  //redacted (more route objects)
  //...
];

const componentRoutes = [
  {
    paths: "/providers/report",
    name: "Providers Report",
    roles: ["Office Manager", "Office Assistant", "SysAdmin"],
    component: ProvidersReport
  },

  {
    paths: ["/providers/noncompliant"],
    name: "ProviderNonCompliant",
    roles: ["Provider", "Office Manager", "Office Assistant", "SysAdmin"],
    component: ProviderNonCompliant
  },
  {
    paths: [
      "/providers/new",
      "/providers/:id/edit",
      "/providers/current",
      "/providers/details",
      "/providers/expertise/:id",
      "/providers/insuranceplans/:id",
      "/providers/specializations/:id",
      "/providers/states/:id",
      "/providers/:id",
      "/providers"
    ],
    name: "Providers",
    roles: ["Provider", "Office Manager", "Office Assistant", "SysAdmin"],
    component: Providers
  },
  {
    paths: ["/contacts", "/contacts/:id/chats"],
    name: "Contacts",
    roles: ["Provider", "Office Manager", "Office Assistant", "SysAdmin"],
    component: Contacts
  },
  {
    paths: ["/forum"],
    name: "forum",
    roles: ["Provider", "SysAdmin"],
    component: Forums
  },
  {
    paths: ["/forum/:id"],
    name: "Thread",
    roles: ["Provider", "SysAdmin"],
    component: Thread
  },
  {
    paths: ["/dashboard", "/"],
    name: "Admin Dashboard",
    roles: ["Office Manager", "Office Assistant"],
    component: Dashboard
  },
  {
    paths: ["/sysAdminDashboard", "/"],
    name: "System Admin Dashboard",
    roles: ["SysAdmin"],
    component: SysAdminDashboard
  },

  //...
  //redacted (more route objects)
  //...

  {
    paths: ["*"],
    name: "Not Found",
    roles: [
      "Provider",
      "Office Manager",
      "Office Assistant",
      "Consumer",
      "SysAdmin"
    ],
    component: NotFound
  }
];

export { headerRoutes, sideBarRoutes, componentRoutes };
