import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError
} from "./serviceHelpers";

const domain = `${API_HOST_PREFIX}/api`;

// Types include:
// "affiliations"
// "expertise"
// "facilities"
// "files"
// "genders"
// "insurances"
// "locations"
// "questions"
// "surveystatus"
// "surveytypes"
// "titles"
// "tokens"
// "urls"

const getLookupTableData = type => {
  const config = {
    method: "GET",
    url: `${domain}/typetables?table=${type}`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .then(res => {
      return { res, type };
    })
    .catch(onGlobalError);
};

export default getLookupTableData;
