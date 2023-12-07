//Import NPM Packages.
import axios from 'axios';

//Import Shared Constant.
import { BACKEND_API } from '../shared/environment';

//Import Session storage methods.
import { getAuthToken } from './sessionStorage';

//Import Reducer store.
import store from '../redux/Store/store';

//Global error handler.
function handleHttpError(error) {
  if (error.message === 'Request failed with status code 401') {
    error.message = "Unauthorized Access: Force Singout";
    store.dispatch({ type: 'USER_SIGNOUT_POPUP_REQUESTED', strUserSignoutPopup: "directSignout" });
  }
  return error;
}

//Request Middleware.
function makeHttpRequest(apiCall) {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await apiCall();
      resolve(data.data);
    } catch (e) {
      reject(handleHttpError(e));
    }
  });
}

//Set required headers [Token and Device info].
function setHttpHeaderToken() {
  axios.defaults.headers.common['Content-Type'] = 'application/json';
  axios.defaults.headers.common['Authorization'] = `Token ${getAuthToken()}`;
  axios.defaults.headers.common['Device-Type'] = window.tracker.system.getSystemType();
  axios.defaults.headers.common['Device-ID'] = window.tracker.system.getMacAddress();
}

//Remove headers at sing-in time, if already set.
function removeHttpHeaderToken() {
  delete axios.defaults.headers.common['Authorization'];
  delete axios.defaults.headers.common['Device-Type'];
  delete axios.defaults.headers.common['Device-ID'];
}

//Without Header Token.
export function postRequestWithoutHeader(path, data, options) {
  removeHttpHeaderToken();
  return makeHttpRequest(() => axios.post(`${BACKEND_API}${path}`, data, options));
}

export function getRequest(path, params) {
  setHttpHeaderToken();
  return makeHttpRequest(() => axios.get(`${BACKEND_API}${path}`, { params }));
}

export function postRequest(path, data, options) {
  setHttpHeaderToken();
  return makeHttpRequest(() => axios.post(`${BACKEND_API}${path}`, data, options));
}

export function putRequest(path, data, options) {
  setHttpHeaderToken();
  return makeHttpRequest(() => axios.put(`${BACKEND_API}${path}`, data, options));
}

export function deleteRequest(path, data, options) {
  setHttpHeaderToken();
  return makeHttpRequest(() => axios.delete(`${BACKEND_API}${path}`, { data }));
}