import * as Yup from "yup";

const loginSchema = Yup.object().shape({
  email: Yup.string()
    .email(" Email must be a valid email address.")
    .min(5, " Must be at least 5 characters.")
    .max(100, " Must be 100 characters or less.")
    .required(" *Required"),
  password: Yup.string().required("*Required")
});

const registerSchema = Yup.object().shape({
  firstName: Yup.string()
    .min(2, " Must be at least 2 characters.")
    .max(100, " Must be 100 characters or less.")
    .required(" *Required"),
  lastName: Yup.string()
    .min(2, " Must be at least 2 characters.")
    .max(100, " Must be 100 characters or less.")
    .required(" *Required"),
  middleName: Yup.string()
    .min(0)
    .max(2, " Must be 2 characters or less."),
  email: Yup.string()
    .email(" Email must be a valid email address.")
    .min(8, " Must be at least 8 characters.")
    .max(100, " Must be 100 characters or less.")
    .required(" *Required"),
  password: Yup.string()
    .min(8, " Password must be 8 characters or longer.")
    .max(100, " Password must be less than 100 characters.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])/,
      " Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character or symbol."
    )
    .required(" *Required"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password"), null], " Passwords must match")
    .required(" *Required"),
  hasAgreed: Yup.bool().oneOf([true], " *Required")
});

const recoverPasswordSchema = Yup.object().shape({
  email: Yup.string()
    .email(" Email must be a valid email address.")
    .min(5, " Must be at least 5 characters.")
    .max(100, " Must be 100 characters or less.")
    .required(" *Required")
});

const passwordUpdateSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, " Password must be 8 characters or longer.")
    .max(100, " Password must be less than 100 characters in length.")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^\da-zA-Z])/,
      " Password must contain at least one lowercase letter, one uppercase letter, one number, and one special character or symbol."
    )
    .required(" *Required"),
  passwordConfirm: Yup.string()
    .oneOf([Yup.ref("password"), null], " Passwords must match")
    .required(" *Required")
});

export {
  loginSchema,
  registerSchema,
  recoverPasswordSchema,
  passwordUpdateSchema
};
