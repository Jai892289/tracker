import { getRequest, postRequest, putRequest, deleteRequest, postRequestWithoutHeader, } from '../../utils/http';

export function postWithoutHeaderRequestAPI({ url = '', data = {} }) {
  return postRequestWithoutHeader(url, data);
}

export function postRequestAPI({ url = '', data = {} }) {
  return postRequest(url, data);
}

export function putRequestAPI({ url = '', data = {} }) {
  return putRequest(url, data);
}

export function deleteRequestAPI({ url = '', data = {} }) {
  return deleteRequest(url, data);
}

export function getRequestAPI({ url = '', params = {} }) {
  return getRequest(url, params);
}