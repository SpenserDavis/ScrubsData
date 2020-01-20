import * as Yup from "yup";
import React from "react";

const updateProvider = Yup.object().shape({
  titleTypeId: Yup.string().required(
    <small className="muted form-text text-muted">*Required</small>
  ),
  genderTypeId: Yup.string().required(
    <small className="muted form-text text-muted">*Required</small>
  ),
  phone: Yup.string()
    .min(10, "Must be 10 characters or more.")
    .max(50, "Must be 50 characters or less.")
    .required(<small className="muted form-text text-muted">*Required</small>),
  fax: Yup.string()
    .min(10, "Must be 10 characters or more.")
    .max(50, "Must be 50 characters or less.")
    .required(<small className="muted form-text text-muted">*Required</small>),
  firstName: Yup.string()
    .min(1, "Must be at least 1 character.")
    .max(100, "Must be 100 characters or less."),
  lastName: Yup.string()
    .min(1, "Must be at least 1 character.")
    .max(100, "Must be 100 characters or less."),
  mi: Yup.string()
    .min(1, "Must be at least one character.")
    .max(2, "Must be 2 characters at most."),
  avatarUrl: Yup.string()
    .min(3, "Must be 3 characters or more.")
    .max(255, "Must be 255 characters or less."),
  npi: Yup.string()
    .matches(/^\d+$/, "Must be a number.")
    .required(<small className="muted form-text text-muted">*Required</small>),
  genderAccepted: Yup.string()
});

const addProvider = Yup.object().shape({
  titleTypeId: Yup.string().required(
    <small className="muted form-text text-muted">*Required</small>
  ),
  genderTypeId: Yup.string().required(
    <small className="muted form-text text-muted">*Required</small>
  ),
  phone: Yup.string()
    .min(10, "Must be 10 characters or more.")
    .max(50, "Must be 50 characters or less.")
    .required(<small className="muted form-text text-muted">*Required</small>),
  fax: Yup.string()
    .min(10, "Must be 10 characters or more.")
    .max(50, "Must be 50 characters or less.")
    .required(<small className="muted form-text text-muted">*Required</small>),
  firstName: Yup.string()
    .min(1, "Must be at least 1 character.")
    .max(100, "Must be 100 characters or less."),
  lastName: Yup.string()
    .min(1, "Must be at least 1 character.")
    .max(100, "Must be 100 characters or less."),
  mi: Yup.string()
    .min(1, "Must be at least one character.")
    .max(2, "Must be 2 characters at most."),
  avatarUrl: Yup.string()
    .min(3, "Must be 3 characters or more.")
    .max(255, "Must be 255 characters or less."),
  npi: Yup.string()
    .matches(/^\d+$/, "Must be a number.")
    .required(<small className="muted form-text text-muted">*Required</small>),
  genderAccepted: Yup.string(),
  email: Yup.string()
    .email("Email must be a valid email address.")
    .required(<small className="muted form-text text-muted">*Required</small>),
  password: Yup.string()
    .min(5, "Password must be 5 characters or longer.")
    .max(100, "Password must be less than 100 characters.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])/,
      "Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character or symbol."
    )
    .required(<small className="muted form-text text-muted">*Required</small>),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password"), null], "Passwords must match")
    .required(<small className="muted form-text text-muted">*Required</small>)
});

const stepWizardStepOne = Yup.object().shape({
  titleTypeId: Yup.number().required(
    <small className="muted form-text text-muted">*Required</small>
  ),
  genderTypeId: Yup.number().required(
    <small className="muted form-text text-muted">*Required</small>
  ),
  phone: Yup.string()
    .min(10, "Must be 10 characters or more.")
    .max(50, "Must be 50 characters or less.")
    .required(<small className="muted form-text text-muted">*Required</small>),
  fax: Yup.string()
    .min(10, "Must be 10 characters or more.")
    .max(50, "Must be 50 characters or less.")
    .required(<small className="muted form-text text-muted">*Required</small>),
  firstName: Yup.string()
    .min(1, "Must be at least 1 character.")
    .max(100, "Must be 100 characters or less."),
  lastName: Yup.string()
    .min(1, "Must be at least 1 character.")
    .max(100, "Must be 100 characters or less."),
  mi: Yup.string()
    .min(1, "Must be at least one character.")
    .max(4, "Must be 4 characters at most."),
  avatarUrl: Yup.string()
    .min(3, "Must be 3 characters or more.")
    .max(255, "Must be 255 characters or less."),
  genderAccepted: Yup.string()
});
export { addProvider, updateProvider, stepWizardStepOne };
