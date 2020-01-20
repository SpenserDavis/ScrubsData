import React from "react";
import { Field, Form, Formik } from "formik";
import * as authValidation from "./authValidation.js";
import { Link } from "react-router-dom";
import * as authService from "../../services/authService";
import logger from "sabio-debug";
import PropTypes from "prop-types";
import Swal from "sweetalert2";
import "./register.css";
import scrubsLogo from "../../assets/images/scrubsLogo.png";

const _logger = logger.extend("Login");

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "", password: "", remember: false };
  }

  handleSubmit = ({ email, password }, { setSubmitting }) => {
    setSubmitting(true);
    const userLogin = { name: email, password };

    authService
      .logInUser(userLogin)
      .then(this.handleLogInSuccess)
      .catch(err => {
        setSubmitting(false);
        this.handleLogInFailure(err);
      });
  };

  handleLogInSuccess = () => {
    Swal.fire({
      type: "success",
      title: "Login Success",
      text: "Now redirecting to your dashboard...",
      timer: 1000
    });

    authService
      .getCurrentUser()
      .then(this.onUserConfirmed)
      .catch(this.onUserNotConfirmed);
  };

  onUserConfirmed = ({ item }) => {

    //redacted

      this.props.history.push("/", {
        currentUser: { ...item, isLoggedIn: true },
        type: "LOGIN"
      });
     
      
//redacted

        } else if (item.roles.includes("Consumer")) {
          this.props.history.push("/medicaldata");
        }
      }
    }
  };

  onUserNotConfirmed = err => {
    _logger("no session", err);
  };

  getProviderSuccess = ({ item }) => {
    this.props.history.push(`/providers/${item}/details`);
  };


  getFirstLoginSuccess = (res, item) => {

    //redacted

    } else {
      _logger("This is not my first time logging in", item);
      this.props.history.push("/", {
        currentUser: { ...item, isLoggedIn: true },
        type: "LOGIN"
      });

      //redacted
    }
  };

  getFirstLoginError = err => {
    _logger(err);
  };

  updateFirstLoginSuccess = (res, item) => {

    this.props.history.push("/", {
      currentUser: { ...item, isLoggedIn: true },
      type: "LOGIN"
    });
    this.props.history.push("/userprofiles");
  };

  updateFirstLoginError = err => {
    _logger(err);
  };

  handleLogInFailure = err => {
    _logger(err);
    Swal.fire({
      type: "error",
      title: "Invalid login credentials",
      text: "Please try again.",
      timer: 2000
    });
  };

  render() {
    return (
      <div className="main-wrapper">
        <div className="v-header-overlay"></div>
        <div className="auth-wrapper d-flex no-block justify-content-center align-items-center">
          <div className="auth-box text-light">
            <div id="loginform">
              <div className="logo">
                <span className="db">
                  <img width="35%" src={scrubsLogo} alt="logo" />
                </span>
                <h5 className="font-medium m-b-20">Sign In</h5>
              </div>
              <div className="row">
                <div className="col-12">
                  <Formik
                    initialValues={this.state}
                    onSubmit={this.handleSubmit}
                    validationSchema={authValidation.loginSchema}
                    render={({ isSubmitting, touched, errors }) => {
                      return (
                        <Form className="form-horizontal m-t-20" id="loginform">
                          <label htmlFor="email">Email</label>
                          <div className="input-group input-group-lg mb-2">
                            <div className="input-group-prepend">
                              <span
                                className="input-group-text"
                                id="basic-addon1"
                              >
                                <i className="ti-user"></i>
                              </span>
                            </div>
                            <Field
                              maxLength={100}
                              name="email"
                              type="text"
                              className="form-control form-control-lg"
                            />
                          </div>
                          {touched.email && errors.email && (
                            <div className="error mb-2">
                              <span className="error">{errors.email}</span>
                            </div>
                          )}

                          <label htmlFor="password">Password</label>
                          <div className="input-group input-group-lg mb-2">
                            <div className="input-group-prepend">
                              <span
                                className="input-group-text"
                                id="basic-addon2"
                              >
                                <i className="ti-pencil"></i>
                              </span>
                            </div>
                            <Field
                              maxLength={100}
                              name="password"
                              type="password"
                              className="form-control form-control-lg"
                            />{" "}
                          </div>
                          {touched.password && errors.password && (
                            <div className="error mb-2">
                              <span className="error">{errors.password}</span>
                            </div>
                          )}


                         //redacted

                          <div className="form-group text-center">
                            <div className="col-xs-12 p-b-20">
                              <button
                                disabled={isSubmitting}
                                className="btn btn-block btn-lg btn-info"
                                type="submit"
                              >
                                Log In
                              </button>
                            </div>
                          </div>
                          <div className="form-group m-b-0 m-t-10">
                            <div className="col-sm-12 text-center">
                              <Link
                                to="/recover"
                                style={{
                                  color: "rgb(251, 176, 64)"
                                }}
                              >
                                <span className="m-l-5">Forgot Password</span>
                              </Link>
                            </div>
                          </div>
                          <div className="form-group m-b-0 m-t-10">
                            <div className="col-sm-12 text-center">
                              {`Don't have an account? `}
                              <Link
                                to="/register"
                                style={{
                                  color: "rgb(251, 176, 64)"
                                }}
                              >
                                <span className="m-l-5">
                                  <b>Sign Up</b>
                                </span>
                              </Link>
                            </div>
                          </div>
                        </Form>
                      );
                    }}
                  />
                </div>
              </div>
            </div>
            <div id="recoverform">
              <div className="logo">
                <span className="db">
                  <img src="" alt="logo" />
                </span>
                <h5 className="font-medium m-b-20">Recover Password</h5>
                <span>
                  Enter your Email and instructions will be sent to you!
                </span>
              </div>
              <div className="row m-t-20">
                <form className="col-12">
                  <div className="form-group row">
                    <div className="col-12">
                      <input
                        className="form-control form-control-lg"
                        type="email"
                        required=""
                        placeholder="Username"
                      />
                    </div>
                  </div>
                  <div className="row m-t-20">
                    <div className="col-12">
                      <button
                        className="btn btn-block btn-lg btn-danger"
                        type="submit"
                        name="action"
                      >
                        Reset
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default Login;

Login.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  location: PropTypes.shape({
    pathname: PropTypes.string
  }),
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.number
    }),
    path: PropTypes.string
  })
};
