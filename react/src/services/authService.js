import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError
} from "./serviceHelpers";

const domain = `${API_HOST_PREFIX}/api`;

const confirmUser = confirmationData => {
  const config = {
    method: "PUT",
    url: `${domain}/auth/${confirmationData.id}`,
    data: confirmationData
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const getCurrentUser = () => {
  const config = {
    method: "GET",
    url: `${domain}/auth/current`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const getProviderId = () => {
  const config = {
    method: "GET",
    url: `${domain}/auth/provider`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const getUserId = userToken => {
  const config = {
    method: "GET",
    url: `${domain}/auth?token=${userToken}`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const logInUser = userCredentials => {
  const config = {
    method: "POST",
    url: `${domain}/auth/login`,
    data: userCredentials
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const logOutUser = () => {
  const config = {
    method: "GET",
    url: `${domain}/auth/logout`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const registerUser = potentialUserCredentials => {
  const config = {
    method: "POST",
    url: `${domain}/auth/register`,
    data: potentialUserCredentials
  };

  return axios(config)
    .then(onGlobalSuccess)
    .then(res => {
      return {
        res,
        potentialUserCredentials
      };
    })
    .catch(onGlobalError);
};

const updatePassword = password => {
  const config = {
    method: "PUT",
    url: `${domain}/auth/resetpassword`,
    data: { password }
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const updatePasswordAnon = (token, password) => {
  const config = {
    method: "PUT",
    url: `${domain}/auth/resetpasswordanon`,
    data: { token, password }
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

export {
  confirmUser,
  getCurrentUser,
  getProviderId,
  getUserId,
  logInUser,
  logOutUser,
  registerUser,
  updatePassword,
  updatePasswordAnon
};
