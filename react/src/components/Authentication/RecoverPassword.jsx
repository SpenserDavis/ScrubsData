import React from "react";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Form, FormGroup, Label, Button } from "reactstrap";
import { Formik, Field } from "formik";
import * as authValidation from "./authValidation.js";
import { getUserByEmail } from "../../services/authService";
import PropTypes from "prop-types";
import logger from "sabio-debug";
import { Link } from "react-router-dom";
import CheckEmailGeneric from "./CheckEmailGeneric.jsx";

const _logger = logger.extend("RecoverPassword");

class RecoverPassword extends React.Component {
  state = {
    userData: { email: "", newPassword: "", id: 0 },
    recoverData: {},
    hasSubmitted: false
  };

  handleSubmit = values => {
    _logger("Handle submit called for " + values.email);

    this.emailSubmitConfirmation(values.email);
  };

  emailSubmitConfirmation = email => {
    getUserByEmail(email)
      .then(this.onValidEmailSuccess)
      .catch(this.onGenericError);
  };

  onValidEmailSuccess = res => {
    _logger("Email submitted found in database");
    _logger(res);
    this.setState({ recoverData: res.item, hasSubmitted: true });
    const MySwal = withReactContent(Swal);
    MySwal.fire(
      "Confirm Email",
      `Check your email <b>${res.item.email}</b> for a password reset link`,
      "success"
    );
  };

  emailSentSuccess = res => {
    _logger("Email has been successfully sent");
    _logger(res);
  };

  onGenericError = err => {
    _logger("There was an error" + err);
    const MySwal = withReactContent(Swal);
    MySwal.fire(
      "Error",
      "Sorry, there was an error with your request. Please try again later.",
      "error"
    );
  };

  cancelButton = e => {
    e.preventDefault();
    this.props.history.push(`/login`);
  };

  render() {
    return (
      <React.Fragment>
        {this.state.hasSubmitted ? (
          <CheckEmailGeneric />
        ) : (
          <Formik
            enableReinitialize={true}
            validationSchema={authValidation.recoverPasswordSchema}
            initialValues={this.state.userData}
            onSubmit={this.handleSubmit}
          >
            {props => {
              const {
                values,
                touched,
                errors,
                handleSubmit,
                isSubmitting
              } = props;
              return (
                <div className="auth-wrapper d-flex no-block justify-content-center align-items-center">
                  <div className="auth-box">
                    <div id="loginform">
                      <div className="logo">
                        <h5 className="font-medium mb-3">Recover Password</h5>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <Form onSubmit={handleSubmit} className="mt-3">
                            <FormGroup>
                              <Field
                                name="email"
                                type="text"
                                values={values.email}
                                autoComplete="off"
                                className={
                                  errors.email && touched.email
                                    ? "form-control error"
                                    : "form-control"
                                }
                              />
                              <Label>Email Address *</Label>

                              {errors.email && touched.email && (
                                <span className="input-feedback">
                                  {errors.email}
                                </span>
                              )}
                            </FormGroup>
                            <div className="mb-4 row">
                              <div className="col-12">
                                <Button
                                  type="submit"
                                  onClick={this.validEmailCheck}
                                  disabled={isSubmitting}
                                  className="text-uppercase btn btn-primary btn-lg btn-block"
                                >
                                  Reset
                                </Button>
                              </div>
                            </div>
                            <div className="mb-4 row">
                              <div className="col-sm-12 text-center">
                                {`Remember Password?  `}
                                <Link to="/login">
                                  <span className="text-info m-l-5">Login</span>
                                </Link>
                              </div>
                            </div>
                          </Form>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            }}
          </Formik>
        )}
      </React.Fragment>
    );
  }
}

RecoverPassword.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func
  }),
  email: PropTypes.string
};

export default RecoverPassword;
