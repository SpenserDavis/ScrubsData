import React from "react";
import Swal from "sweetalert2";
import * as medicalDataService from "../../services/medicalDataService";
import PropTypes from "prop-types";
import stripeKey from "./stripeKey";
import logger from "sabio-debug";

const _logger = logger.extend("Payment");

class Payment extends React.Component {
  state = { hasScriptLoaded: false };

  componentDidMount() {
    this.loadScript("https://js.stripe.com/v3/");
  }

  async componentDidUpdate(prevProps, prevState) {
    if (
      this.state.hasScriptLoaded !== prevState.hasScriptLoaded &&
      this.state.hasScriptLoaded
    ) {
      let session = await medicalDataService.getCheckoutSession(
        this.props.match.params.plan
      );
      this.redirToStripeCheckout(session);
    }
  }

  loadScript = src => {
    var aScript = document.createElement("script");
    aScript.type = "text/javascript";
    aScript.src = src;
    document.head.appendChild(aScript);
    aScript.onload = () => {
      this.setState({ hasScriptLoaded: true });
    };
  };

  redirToStripeCheckout = session => {
    /* global Stripe */
    var stripe = Stripe(stripeKey);
    _logger("stripe", stripe);
    _logger("session", session);

    stripe
      .redirectToCheckout({
        sessionId: session.item.id
      })
      .then(function(result) {
        Swal.fire({ text: result.error.message });
      });
  };

  render() {
    return this.state.hasScriptLoaded ? (
      <div>Attempting to redirect you to checkout form...</div>
    ) : (
      <>
        <div>
          You must disable AdBlock to view this page. Please refresh after
          disabling.
        </div>
        <div className="lds-ripple">
          <div className="lds-pos"></div>
          <div className="lds-pos"></div>
        </div>
      </>
    );
  }
}

export default Payment;

Payment.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      plan: PropTypes.string
    })
  })
};
