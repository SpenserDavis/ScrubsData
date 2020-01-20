import React from "react";
import { Route, Switch } from "react-router-dom";
import authRoutes from "../routes/authroutes.js";
import PropTypes from "prop-types";

class BlankLayout extends React.Component {
  render() {
    return (
      <div className="authentications">
        <Switch>
          {authRoutes.map((route, index) => {
            return (
              <Route
                exact
                path={route.path}
                component={route.component}
                key={`auth-${index}`}
              />
            );
          })}
        </Switch>
      </div>
    );
  }
}
export default BlankLayout;

BlankLayout.propTypes = { path: PropTypes.string, component: PropTypes.node };
