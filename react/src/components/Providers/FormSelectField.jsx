import React from "react";
import PropTypes from "prop-types";
import { Field } from "formik";

const SelectField = ({ name, label, children, touched, errors }) => {
  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Field component="select" name={name} className="form-control">
        {children}
      </Field>
      {touched[name] && errors[name] && (
        <div className="error">{errors[name]}</div>
      )}
    </div>
  );
};

SelectField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  touched: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  children: PropTypes.arrayOf(PropTypes.node)
};

export default SelectField;
