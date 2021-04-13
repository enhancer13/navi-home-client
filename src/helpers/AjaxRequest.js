import AuthService from './AuthService';
import Globals from '../globals/Globals';

const urlRegex = new RegExp(/^(http|https)/gi);

const _ajaxRequest = async (url, method, body, extraOptions) => {
  const options = {
    method,
  };
  if (body) {
    options.body = body;
  }
  return AuthService.fetchMethod(url.match(urlRegex) ? url : AuthService.buildFetchUrl(url), options, extraOptions);
};

const ajaxRequest = {
  get: (url, extraOptions) => _ajaxRequest(url, Globals.httpMethod.GET, null, extraOptions),

  put: (url, body, extraOptions) => _ajaxRequest(url, Globals.httpMethod.PUT, body, extraOptions),

  post: (url, body, extraOptions) => _ajaxRequest(url, Globals.httpMethod.POST, body, extraOptions),

  delete: (url, body, extraOptions) => _ajaxRequest(url, Globals.httpMethod.DELETE, body, extraOptions),
};

export default ajaxRequest;
