import React from "react";
import PropTypes from "prop-types";
import ReactRouterPropTypes from "react-router-prop-types";
import { NavLink } from "react-router-dom";
import { connect } from "react-redux";
import { Nav, Collapse } from "reactstrap";
import PerfectScrollbar from "react-perfect-scrollbar";

class Sidebar extends React.Component {
   
//redacted

  render() {
    return (
    
      //redacted

            <Nav id="sidebarnav">
              {this.props.routes
                .filter(({ roles }) => {
                  let userRoles = this.props.currentUser.roles;
                  return roles.some(item => userRoles.includes(item));
                })
                .map((prop, key) => {
                  if (prop.redirect) {
                    return null;
                  } else if (prop.navlabel) {
                    return (
                      <li className="nav-small-cap" key={key}>
                        <i className={prop.icon}></i>
                        <span className="hide-menu">{prop.name}</span>
                      </li>
                    );

                //redacted
                
            </Nav>
          </PerfectScrollbar>
        </div>
      </aside>
    );
  }
}

Sidebar.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  settings: PropTypes.shape({ activeSidebarBg: PropTypes.string }).isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  currentUser: PropTypes.shape({ roles: PropTypes.arrayOf(PropTypes.string) }),
  routes: PropTypes.arrayOf(
    PropTypes.shape({
      path: PropTypes.string, //not required b/c some nav items do not have a path
      pathTo: PropTypes.string,
      name: PropTypes.string,
      redirect: PropTypes.bool
    })
  )
};

export default connect(mapStateToProps)(Sidebar);
