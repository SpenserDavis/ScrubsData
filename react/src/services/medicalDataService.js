import axios from "axios";

import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError
} from "./serviceHelpers";

const endpointBase = `${API_HOST_PREFIX}/api/medicaldata`;

const getSubscriptionStatus = () => {
  const config = {
    method: "GET",
    url: `${endpointBase}/status`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const getCheckoutSession = plan => {
  const config = {
    method: "GET",
    url: `${endpointBase}/subscribe/${plan}`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const cancelSubscription = () => {
  const config = {
    method: "GET",
    url: `${endpointBase}/cancel`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

export { getSubscriptionStatus, getCheckoutSession, cancelSubscription };
