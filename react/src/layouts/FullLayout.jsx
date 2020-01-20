import React from "react";
import { connect } from "react-redux";
import { Route, Redirect, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import ReactRouterPropTypes from "react-router-prop-types";
import Header from "./layout-components/header/Header";
import Sidebar from "./layout-components/sidebar/Sidebar";
import Footer from "./layout-components/footer/Footer";
import { sideBarRoutes, componentRoutes } from "../routes/router";
import "../c3.css";

const mapStateToProps = state => ({
  ...state
});
class FullLayout extends React.Component {
 
  
//redacted



  /* ------------------------------------------------------------------------------------
user auth handlers
--------------------------------------------------------------------------------------*/
  onUserConfirmed = res => {
    this.props.setCurrentUser(res.item);
  };

  onUserNotConfirmed = () => {
    this.props.history.push("/");
  };

  handleLogOutRequest = () => {
    this.props.logOut();
    this.props.history.push("/");
  };

  render() {
    
    
//redacted


        <Header
          currentUser={this.props.currentUser}
          logOut={this.handleLogOutRequest}
          {...this.props}
        />
        {/*--------------------------------------------------------------------------------*/
        /* Sidebar                                                                        */
        /*--------------------------------------------------------------------------------*/}
        <Sidebar {...this.props} routes={sideBarRoutes} />
        {/*--------------------------------------------------------------------------------*/
        /* Page Main-Content                                                              */
        /*--------------------------------------------------------------------------------*/}
        <div className="page-wrapper d-block">
          <div className="page-content container-fluid">
            <Switch>
              {componentRoutes
                .filter(({ roles }) => {
                  let userRoles = this.props.currentUser.roles;
                  return roles.some(item => userRoles.includes(item));
                })
                .map((prop, key) => {
                  if (prop.navlabel) {
                    return null;
                  } else if (prop.collapse) {
                    return prop.child.map((prop2, key2) => {
                      if (prop2.collapse) {
                        return prop2.subchild.map((prop3, key3) => {
                          return (
                            <Route
                              path={prop3.path}
                              component={prop3.component}
                              key={key3}
                            />
                          );
                        });
                      }
                      return (
                        <Route
                          path={prop2.path}
                          component={prop2.component}
                          key={key2}
                        />
                      );
                    });
                  } else if (prop.redirect) {
                    return (
                      <Redirect from={prop.path} to={prop.pathTo} key={key} />
                    );
                  } else {
                    return (
                      <Route
                        exact
                        path={prop.paths}
                        render={props => (
                          <prop.component
                            currentUser={this.props.currentUser}
                            prevPath={this.state.prevPath}
                            {...props}
                          />
                        )}
                        key={key}
                      />
                    );
                  }
                })}
            </Switch>
          </div>
          <Footer />
        </div>       
      </div>
    );
  }
}
FullLayout.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  settings: PropTypes.shape({
    activeSidebarType: PropTypes.string,
    activeDir: PropTypes.string,
    activeTheme: PropTypes.string,
    activeSidebarPos: PropTypes.string,
    activeHeaderPos: PropTypes.string,
    activeLayout: PropTypes.string,
    activeThemeLayout: PropTypes.string
  }).isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  logOut: PropTypes.func,
  currentUser: PropTypes.shape({
    id: PropTypes.number,
    roles: PropTypes.arrayOf(PropTypes.string)
  }),
  setCurrentUser: PropTypes.func
};
export default connect(mapStateToProps)(FullLayout);
