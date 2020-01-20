import axios from "axios";
import {
  API_HOST_PREFIX,
  onGlobalSuccess,
  onGlobalError
} from "./serviceHelpers";

const endpointBase = `${API_HOST_PREFIX}/api/providers`;

const addProvider = provider => {
  const config = {
    method: "POST",
    url: `${endpointBase}/new`,
    data: provider
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const getAllProviderDetails = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpointBase}/details?pageIndex=${pageIndex}&pageSize=${pageSize}`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const getAllProviders = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpointBase}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const getFullProviderReport = categories => {
  const config = {
    method: "POST",
    url: `${endpointBase}/report/full`,
    data: categories,
    responseType: "blob"
  };

  return axios(config).catch(onGlobalError);
};

const getProviderReportPdf = categories => {
  const config = {
    method: "POST",
    url: `${endpointBase}/report/pdf`,
    data: categories,
    withCredentials: true
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const getProvidersByCreatedBy = (pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpointBase}/current?pageIndex=${pageIndex}&pageSize=${pageSize}`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const getProvidersByExpertise = (expertiseId, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpointBase}/expertise/${expertiseId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const getProviderById = id => {
  const config = {
    method: "GET",
    url: `${endpointBase}/${id}`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const getProvidersByInsurancePlan = (insurancePlanId, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpointBase}/insuranceplans/${insurancePlanId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const getProvidersBySpecialization = (
  specializationId,
  pageIndex,
  pageSize
) => {
  const config = {
    method: "GET",
    url: `${endpointBase}/specializations/${specializationId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const getProvidersByState = (stateId, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpointBase}/states/${stateId}?pageIndex=${pageIndex}&pageSize=${pageSize}`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const getProviderDetails = id => {
  const config = {
    method: "GET",
    url: `${endpointBase}/${id}/details`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const getPagedProviderReport = (pageIndex, pageSize, categories) => {
  const config = {
    method: "POST",
    url: `${endpointBase}/report?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    data: categories
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const searchPagedProviderReport = (pageIndex, pageSize, query, categories) => {
  const config = {
    method: "POST",
    url: `${endpointBase}/report/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
    data: categories
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const removeProvider = id => {
  const config = {
    method: "DELETE",
    url: `${endpointBase}/${id}`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const searchProviders = (query, pageIndex, pageSize) => {
  const config = {
    method: "GET",
    url: `${endpointBase}/search?q=${query}&pageIndex=${pageIndex}&pageSize=${pageSize}`
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

const updateProvider = data => {
  const config = {
    method: "PUT",
    url: `${endpointBase}/${data.id}`,
    data
  };

  return axios(config)
    .then(onGlobalSuccess)
    .catch(onGlobalError);
};

export {
  addProvider,
  getAllProviderDetails,
  getAllProviders,
  getFullProviderReport,
  getPagedProviderReport,
  getProviderDetails,
  getProviderById,
  getProvidersByCreatedBy,
  getProvidersByExpertise,
  getProvidersByInsurancePlan,
  getProvidersBySpecialization,
  getProvidersByState,
  getProviderReportPdf,
  removeProvider,
  searchPagedProviderReport,
  searchProviders,
  updateProvider
};
