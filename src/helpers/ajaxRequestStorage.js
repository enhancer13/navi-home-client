import AuthService from './authService';

const _ajaxRequestStorage = (url, method, body, params) => {
  const authService = new AuthService();

  if (authService.loggedIn() && !authService.isTokenExpired()) {
    const headers = {};

    if (params === 'storage') {
      if (method === 'GET') {
        headers.Accept = 'image/png';
      } else {
        headers.Accept = 'application/json';
      }
    }

    headers.Authorization = authService.getToken();

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
        if (params === 'storage') {
          if (method === 'GET') {
            return response.text();
          } else {
            return Promise.resolve();
          }
        }
      });
  } else {
    console.log('Not logged in or token is expired');
  }
};

const ajaxRequestStorage = {
  get: (url, params) => {
    return _ajaxRequestStorage(url, 'GET', null, params);
  },
  put: (url, body) => {
    return _ajaxRequestStorage(url, 'PUT', body);
  },
  post: (url, body, params) => {
    return _ajaxRequestStorage(url, 'POST', body, params);
  },
  delete: (url, body) => {
    return _ajaxRequestStorage(url, 'DELETE');
  },
};

export default ajaxRequestStorage;
