import React from "react";
import * as medicalDataService from "../../services/medicalDataService";
import PropTypes from "prop-types";
import logger from "sabio-debug";
// import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import SwaggerUI from "swagger-ui-react";
import "swagger-ui-react/swagger-ui.css";
import swagger from "./swagger.js";
import "./medicaldata.css";
import MedicalDataCards from "./MedicalDataCards";

const prices = { limited: 10, premium: 20 };

const _logger = logger.extend("MedicalData");
class MedicalData extends React.Component {
  state = {
    loading: true,
    subscribed: {
      id: null,
      userId: null,
      apiKey: "",
      isActive: false,
      requestCount: null,
      lastSubscribedDate: null,
      stripeId: "",
      subscriptionType: ""
    },
    showApi: false
  };
  componentDidMount() {
    this.fetchSubStatus();
  }

  fetchSubStatus = () => {
    medicalDataService
      .getSubscriptionStatus()
      .then(this.mapSubStatusToState)
      .catch(this.handleAjaxError);
  };

  mapSubStatusToState = ({ item }) => {
    if (item) {
      this.setState({ subscribed: item, loading: false });
    } else {
      this.setState({ loading: false });
    }
  };
  handleAjaxError = err => {
    _logger(err);
    Swal.fire({
      icon: "error",
      title: "Oops.",
      text: "Something went wrong. Try again later."
    });
    this.props.history.push("/");
  };

  displayApi = () => {
    this.setState(prevState => ({
      ...prevState,
      showApi: true
    }));
  };

  copyApi = () => {
    var api = document.getElementById("apiKeyField");

    api.select();
    api.setSelectionRange(0, 50);

    document.execCommand("copy");
  };

  handleUnsubscribeRequest = () => {
    medicalDataService
      .cancelSubscription()
      .then(this.handleUnsubscribeSuccess)
      .catch(this.handleAjaxError);
  };

  handleUnsubscribeSuccess = () => {
    Swal.fire({
      type: "success",
      title: "Success",
      text: "You have successfully unsubscribed."
    });
    this.fetchSubStatus();
  };

  renderApiTable = () => {
    const { requestCount, apiKey, subscriptionType } = this.state.subscribed;
    const planCost = subscriptionType === "Premium" ? "20" : "10";
    const swag = swagger(apiKey);
    return (
      <>
        <div className="preSwagger">
          <div className="row justify-content-start">
            Your API Key is:{" "}
            <div className="input-group col-xs-12 col-md-6">
              <input
                onClick={this.displayApi}
                type="text"
                id="apiKeyField"
                className="form-control"
                aria-label="Recipient's username"
                aria-describedby="basic-addon2"
                value={this.state.showApi ? apiKey : "Click to show."}
              />
              <div className="input-group-append">
                <button
                  className="btn btn-outline-secondary"
                  type="button"
                  onClick={this.copyApi}
                >
                  Copy
                </button>
              </div>
            </div>
            Keep it secret.
          </div>
          <div className="row justify-content-start">{`You are currently subscribed to our ${subscriptionType} Plan at $${planCost}/month.${subscriptionType ===
            "Premium" &&
            " You may make an unlimited number of API requests."}`}</div>
          {subscriptionType === "Limited" && (
            <p>{`You have made ${requestCount} API requests this billing cycle, and are limited to 1000 requests per billing cycle. Consider upgrading to our Premium Plan for unlimited requests.`}</p>
          )}
          <button
            onClick={this.handleUnsubscribeRequest}
            className="btn btn-danger"
            id="cancel-plan"
          >
            Cancel My Plan
          </button>
        </div>
        <SwaggerUI spec={swag} />
      </>
    );
  };
  renderDataSplash = () => {
    return (
      <div>
        {this.state.subscribed.id && (
          <h5>Looks like your subscription expired.</h5>
        )}
        <MedicalDataCards prices={prices} />
      </div>
    );
  };
  renderSubscriberView = () => {
    if (this.state.subscribed.isActive) {
      return this.renderApiTable();
    } else {
      return this.renderDataSplash();
    }
  };
  render() {
    return this.state.loading ? (
      <div className="lds-ripple">
        <div className="lds-pos"></div>
        <div className="lds-pos"></div>
      </div>
    ) : (
      this.renderSubscriberView()
    );
  }
}
export default MedicalData;
MedicalData.propTypes = {
  history: PropTypes.shape({ push: PropTypes.func.isRequired }).isRequired,
  currentUser: PropTypes.shape({ id: PropTypes.number.isRequired }).isRequired,
  match: PropTypes.shape({
    path: PropTypes.string,
    params: PropTypes.shape({
      id: PropTypes.string
    })
  })
};
