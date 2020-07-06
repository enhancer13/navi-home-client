import AuthService from './authService';

const _ajaxRequest = async (url, method, body) => {
  const authService = new AuthService();

  if (authService.loggedIn() && !authService.isTokenExpired()) {
    const headers = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };

    headers.Authorization = await authService.getToken();

    const options = {
      method,
      headers,
    };

    if (body) {
      options.body = body;
    }

    return fetch(url, options)
      .then(authService._checkStatus)
      .then(response => {
        return method !== 'DELETE' ? response.json() : Promise.resolve();
      });
  } else {
    return Promise.reject(new Error('Session has expired.'));
  }
};

const ajaxRequest = {
  get: url => {
    return _ajaxRequest(url, 'GET');
  },
  put: (url, body) => {
    return _ajaxRequest(url, 'PUT', body);
  },
  post: (url, body) => {
    return _ajaxRequest(url, 'POST', body);
  },
  delete: (url, body) => {
    return _ajaxRequest(url, 'DELETE', body);
  },
};

export default ajaxRequest;
