import React from "react";
import { Field } from "formik";
import PropTypes from "prop-types";

const InputField = ({ name, label, type, touched, errors, length, styles }) => {
  const fieldStyles = type === "number" ? `no-spin ${styles}` : `${styles}`;

  return (
    <div>
      <label htmlFor={name}>{label}</label>
      <Field
        maxLength={length}
        name={name}
        type={type}
        className={fieldStyles}
      />
      {touched[name] && errors[name] && (
        <div className="error">{errors[name]}</div>
      )}
    </div>
  );
};

InputField.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  touched: PropTypes.shape({}).isRequired,
  errors: PropTypes.shape({}).isRequired,
  length: PropTypes.number,
  styles: PropTypes.string
};

export default InputField;
