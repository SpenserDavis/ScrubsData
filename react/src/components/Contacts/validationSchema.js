import * as Yup from "yup";

const emailSchema = Yup.object().shape({
  email: Yup.string()
    .email("Email must be a valid email address.")
    .required()
});

export default emailSchema;
