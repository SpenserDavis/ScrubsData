import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError
} from "./serviceHelpers";

const endpointBase = `${API_HOST_PREFIX}/api/datavis`;

export const getProviderData = () => {
  const config = {
    method: "GET",
    url: `${endpointBase}/providers`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

export const getPracticeData = () => {
  const config = {
    method: "GET",
    url: `${endpointBase}/practices`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};
