import React from "react";
import PropTypes from "prop-types";
import { withRouter, Link } from "react-router-dom";
import "./medicaldata.css";

const MedicalDataCards = ({ location }) => {
  const redirToRegisterProps = {
    to: { pathname: "/register", state: { isConsumer: true } }
  };

  const renderLinkProps = plan => {
    return location.pathname === "/"
      ? redirToRegisterProps
      : { to: `/subscribe/${plan}` };
  };

  return (
    <>
      <div className="col-xs-11 col-md-5">
        <div
          className="card m-2 p-0"
          style={{
            boxShadow: "3px 5px 20px 9px rgba(0, 0, 0, 0.08)"
          }}
        >
          <h4 className="text-center card-header">Limited</h4>
          <div className="p-3 card-body" style={{ textAlign: "center" }}>
            <div>
              <h2 className="text-center">
                <span>$</span>10
              </h2>
              <p>per month</p>
            </div>
            <div className="font-weight-light">
              <div>
                <i className="icon-drawar" /> Access to 1,000 API requests /
                Month
              </div>

              <div>
                <Link {...renderLinkProps("limited")}>
                  <button className="btn btn-success mt-3">Sign up</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="col-xs-11 col-md-5">
        <div
          className="card m-2 p-0"
          style={{
            boxShadow: "3px 5px 20px 9px rgba(0, 0, 0, 0.08)"
          }}
        >
          <h4 className="text-center card-header">Premium</h4>
          <div className="p-3 card-body" style={{ textAlign: "center" }}>
            <div>
              <h2 className="text-center">
                <span>$</span>20
              </h2>
              <p>per month</p>
            </div>
            <div className="font-weight-light">
              <div>
                <i className="icon-drawar" /> Access to unlimited API requests
              </div>

              <div>
                <Link {...renderLinkProps("premium")}>
                  <button className="btn btn-dark mt-3">Sign up</button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default withRouter(MedicalDataCards);

MedicalDataCards.propTypes = {
  location: PropTypes.shape({ pathname: PropTypes.string.isRequired })
    .isRequired
};
