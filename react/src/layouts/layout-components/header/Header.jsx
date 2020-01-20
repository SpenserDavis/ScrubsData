import React from "react";
import PropTypes from "prop-types";
import ReactRouterPropTypes from "react-router-prop-types";
import { connect } from "react-redux";
import "../../../components/Lockscreen/Lockscreen.css";
import Avatar from "../../../components/Contacts/Avatar";
import { Link } from "react-router-dom";
import logger from "sabio-debug";
import * as userProfileServices from "../../../services/scheduleService";
import {
  Nav,
  NavItem,
  NavLink,
  Navbar,
  NavbarBrand,
  Collapse,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem
} from "reactstrap";
// import * as data from "./data";
import * as authService from "../../../services/authService";
import "./header.css";
/*--------------------------------------------------------------------------------*/
/* Import images which are need for the HEADER                                    */
/*--------------------------------------------------------------------------------*/
// import logodarkicon from "../../../assets/images/logo-icon.png";
// import logolighticon from "../../../assets/images/logo-light-icon.png";
// import logodarktext from "../../../assets/images/logo-text.png";
// import logolighttext from "../../../assets/images/logo-light-text.png";
// import profilephoto from "../../../assets/images/users/1.jpg";
import scrubsLogo from "../../../assets/images/scrubsLogo.png";
import scrubsLogoName from "../../../assets/images/scrubsLogoName.png";

const _logger = logger.extend("Header");

const mapStateToProps = state => ({
  ...state
});

class Header extends React.Component {
 
  
  //redacted

  handleLogOut = () => {
    authService
      .logOutUser()
      .then(this.onUserLogOutSuccess)
      .catch(this.onUserLogOutFailure);
  };

  onUserLogOutSuccess = () => {
    this.props.history.push("/login", {
      type: "LOGOUT",
      currentUser: { isLoggedIn: false }
    });
  };

  onUserLogOutFailure = err => {
    _logger("err", err);
  };

  render() {

    const {avatarUrl, firstName, lastName, mi, email} = this.state
    return (
   
//redacted

              <UncontrolledDropdown nav inNavbar>
                <DropdownToggle nav caret className="pro-pic">
                  <Avatar
                    src={avatarUrl}
                    alt="user"
                    styles={{ className: "rounded-circle", width: "20px" }}
                  />
                </DropdownToggle>
                <DropdownMenu right className="user-dd">
                  <span className="with-arrow">
                    <span className="bg-primary" />
                  </span>
                  <div className="d-flex no-block align-items-center p-3 bg-primary text-white mb-2">
                    <div className="">
                      <Avatar
                        src={avatarUrl}
                        alt="user"
                        styles={{ className: "rounded-circle", width: "20px" }}
                      />
                    </div>
                    <div className="ml-2">
                      <h4 className="mb-0">
                        {firstName} {mi}{" "}
                        {lastName}
                      </h4>
                      <p className=" mb-0">{email}</p>
                    </div>
                  </div>
                  <Link to="/myprofile" style={{ color: "black" }}>
                    {" "}
                    <DropdownItem className="header-dropdownItem">
                      <i className="fa fa-user mr-1 ml-1" /> My Profile
                    </DropdownItem>
                  </Link>
                </DropdownMenu>
              </UncontrolledDropdown>
              {/*--------------------------------------------------------------------------------*/}
              {/* End Profile Dropdown                                                           */}
              {/*--------------------------------------------------------------------------------*/}
            </Nav>
          </Collapse>
        </Navbar>
      </header>
    );
  }
}
Header.propTypes = {
  history: ReactRouterPropTypes.history.isRequired,
  settings: PropTypes.shape({
    activeSidebarType: PropTypes.string,
    activeNavbarBg: PropTypes.string,
    activeLogoBg: PropTypes.string
  }).isRequired,
  location: ReactRouterPropTypes.location.isRequired,
  currentUser: PropTypes.shape({ id: PropTypes.number }),
  logOut: PropTypes.func,
  info: PropTypes.shape({
    firstName: PropTypes.string
  })
  //match: ReactRouterPropTypes.match.isRequired,
};
export default connect(mapStateToProps)(Header);
