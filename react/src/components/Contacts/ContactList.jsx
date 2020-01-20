import React from "react";
import PropTypes from "prop-types";
import "./contact.css";
import logger from "sabio-debug";
import AddCircleIcon from "@material-ui/icons/AddCircle";
import { Formik, Field, Form } from "formik";
import emailSchema from "./validationSchema";

const _logger = logger.extend("ContactList");

class ContactList extends React.Component {
  constructor(props) {
    super(props);
    this.state = { email: "" };
  }

  handleInputChange = e => {
    const { value } = e.target;
    this.props.onSearchInputChange(value);
  };

  handleSubmit = (values, { setSubmitting, resetForm }) => {
    setSubmitting(true);
    _logger("submitting form");
    this.props.hubConnection.invoke("AddContact", values.email);
    resetForm();
    setSubmitting(false);
  };

  render() {
    const dragStyles = this.props.dragCounter ? "drag" : "";
    return (
      <React.Fragment>
        <div className="p-3 border-bottom">
          <h4 className="contactList-title">Contacts</h4>
          <div className="position-relative has-icon-left">
            <Formik
              initialValues={this.state}
              validationSchema={emailSchema}
              onSubmit={this.handleSubmit}
              render={({
                errors,
                isSubmitting,
                touched,
                handleSubmit,
                values
              }) => (
                <Form>
                  <label htmlFor="email">Add Contact by Email</label>
                  <Field
                    className={`form-control contactInput ${dragStyles}`}
                    id="addContact"
                    name="email"
                    placeholder="bestdoc4ever@gmail.com"
                    type="text"
                  />

                  <AddCircleIcon
                    className="addIcon"
                    color="primary"
                    disabled={isSubmitting}
                    onClick={handleSubmit}
                  />

                  {touched.email && errors.email && values.email !== "" && (
                    <div className="error small-error">
                      <small>{errors.email}</small>
                    </div>
                  )}
                </Form>
              )}
            />
          </div>
          {this.props.contacts && (
            <>
              <div className="position-relative has-icon-left">
                <label className="label-search" htmlFor="searchTerm">
                  Search Existing Contacts by Name
                </label>
                <input
                  onChange={this.handleInputChange}
                  value={this.props.searchTerm}
                  id="searchTerm"
                  name="searchTerm"
                  placeholder="John Smith"
                  type="text"
                  className={`form-group form-control contactInput ${dragStyles}`}
                />
              </div>
            </>
          )}
        </div>
        <ul className="list-unstyled d-block mailbox chat-users nav">
          {this.props.contacts}
        </ul>
      </React.Fragment>
    );
  }
}

export default ContactList;

ContactList.propTypes = {
  contacts: PropTypes.arrayOf(PropTypes.shape({}).isRequired).isRequired,
  filterContacts: PropTypes.func.isRequired,
  searchTerm: PropTypes.string.isRequired,
  onSearchInputChange: PropTypes.func.isRequired,
  hubConnection: PropTypes.shape({ invoke: PropTypes.func.isRequired }),
  dragCounter: PropTypes.number
};
