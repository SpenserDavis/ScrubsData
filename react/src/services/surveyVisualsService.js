import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError
} from "./serviceHelpers";

const endpointBase = `${API_HOST_PREFIX}/api`;

const getSurveyTitlesAndSections = () => {
  const config = {
    method: "GET",
    url: `${endpointBase}/surveyanalytics/titles`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const getLastSurvey = () => {
  const config = {
    url: `${endpointBase}/surveys/surveyinstance`,
    method: "GET"
  };
  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const getSurveyDetails = id => {
  const config = {
    method: "GET",
    url: `${endpointBase}/surveyanalytics/${id}`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

export { getSurveyTitlesAndSections, getLastSurvey, getSurveyDetails };
