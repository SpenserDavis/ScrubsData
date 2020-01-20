import React from "react";
import Swal from "sweetalert2";
import { updatePassword, updatePasswordAnon } from "../../services/authService";
import { Form, FormGroup, Label, Button } from "reactstrap";
import { Formik, Field } from "formik";
import PropTypes from "prop-types";
import * as authValidation from "./authValidation.js";
import logger from "sabio-debug";

const _logger = logger.extend("ResetPassword");

export class ResetPassword extends React.Component {
  state = {
    userData: { password: "", passwordConfirm: "" }
  };

  handleSubmit = (values, { setSubmitting }) => {
    _logger("values", values);
    setSubmitting(true);
    const { token } = this.props.match.params;
    if (token) {
      updatePasswordAnon(token, values.password)
        .then(this.onUpdateSuccess)
        .catch(this.onGenericError);
    } else {
      updatePassword(values.password)
        .then(this.onUpdateSuccess)
        .catch(this.onGenericError);
    }
  };

  onUpdateSuccess = () => {
    Swal.fire(
      "Success!",
      "You've successfully updated your password.",
      "success"
    );
    this.props.history.push(`/login`);
  };

  onGenericError = err => {
    Swal.fire({
      type: "error",
      title: "Oops",
      text: "This doesn't appear to be working. Please try again later."
    });
    this.props.history.push(`/`);
    _logger("err", err);
  };

  render() {
    return (
      <React.Fragment>
        <Formik
          enableReinitialize
          validationSchema={authValidation.passwordUpdateSchema}
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
                      <h5 className="font-medium mb-3">Reset Password</h5>
                    </div>
                    <div className="row">
                      <div className="col-12">
                        <Form onSubmit={handleSubmit} className="mt-3">
                          <FormGroup>
                            <Field
                              name="password"
                              type="password"
                              values={values.password}
                              autoComplete="off"
                              className={
                                errors.password && touched.password
                                  ? "form-control error"
                                  : "form-control"
                              }
                            />
                            <Label>Password</Label>

                            {errors.password && touched.password && (
                              <span className="input-feedback">
                                {errors.password}
                              </span>
                            )}
                          </FormGroup>
                          <FormGroup>
                            <Field
                              name="passwordConfirm"
                              type="password"
                              values={values.passwordConfirm}
                              autoComplete="off"
                              className={
                                errors.passwordConfirm &&
                                touched.passwordConfirm
                                  ? "form-control error"
                                  : "form-control"
                              }
                            />
                            <Label>Confirm Password</Label>

                            {errors.passwordConfirm &&
                              touched.passwordConfirm && (
                                <span className="input-feedback">
                                  {errors.passwordConfirm}
                                </span>
                              )}
                          </FormGroup>

                          <div className="mb-4 row">
                            <div className="col-12">
                              <Button
                                type="submit"
                                disabled={isSubmitting}
                                className="text-uppercase btn btn-primary btn-lg btn-block"
                              >
                                Reset Password
                              </Button>
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
      </React.Fragment>
    );
  }
}

ResetPassword.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func.isRequired
  }).isRequired,
  match: PropTypes.shape({
    params: PropTypes.shape({
      token: PropTypes.string
    }).isRequired
  }).isRequired
};

export default ResetPassword;
