import React from "react";
const Login = React.lazy(() => import("../components/Authentication/Login"));
const Lockscreen = React.lazy(() =>
  import("../components/Lockscreen/Lockscreen")
);
const Maintenance = React.lazy(() =>
  import("../views/authentication/Maintanance")
);
const RecoverPassword = React.lazy(() =>
  import("../components/Authentication/RecoverPassword")
);
const ResetPassword = React.lazy(() =>
  import("../components/Authentication/ResetPassword")
);
const Register = React.lazy(() =>
  import("../components/Authentication/Register")
);
const ConfirmationPage = React.lazy(() =>
  import("../components/Authentication/ConfirmationPage")
);
const ConfirmationOwner = React.lazy(() =>
  import("../components/Authentication/ConfirmationOwner")
);
const ContactUs = React.lazy(() => import("../components/contactUs/ContactUs"));
const Splash = React.lazy(() => import("../components/Splash"));
const NotFound = React.lazy(() =>
  import("../components/Authentication/NotFound")
);

const authRoutes = [
  {
    path: "/lockscreen",
    name: "Lockscreen",
    component: Lockscreen
  },
  {
    path: "/login",
    name: "Login",
    component: Login
  },
  {
    path: "/maintenance",
    name: "Maintanance",
    component: Maintenance
  },
  {
    path: "/recover",
    name: "Recover Password",
    component: RecoverPassword
  },
  {
    path: "/resetpassword/:token",
    name: "Reset Password",
    component: ResetPassword
  },
  {
    path: "/register",
    name: "Register",
    component: Register
  },
  {
    path: "/confirm/owner/:token",
    name: "Confirm",
    component: ConfirmationOwner
  },
  {
    path: "/confirm/:token",
    name: "Confirmation",
    component: ConfirmationPage
  },
  {
    path: "/contactus",
    name: "Contact Us",
    component: ContactUs
  },

  {
    path: "/",
    name: "Splash",
    component: Splash
  },
  {
    path: "*",
    name: "Not Found",
    component: NotFound
  }
];
export default authRoutes;
