import decodeJWT from 'jwt-decode';
import AsyncStorage from '@react-native-community/async-storage';

const setToken = async value => {
  try {
    await AsyncStorage.setItem('id_token', value);
  } catch (error) {
    console.log(error.message);
  }
};

export default class AuthService {
  constructor() {
    setToken.bind(this);
  }

  requestResetToken = email => {
    return fetch('/users/password/reset?email=' + email, {
      method: 'GET',
    });
  };

  requestPasswordUpdate = (token, newPassword) => {
    return fetch('/users/password/update', {
      method: 'PUT',
      headers: {'content-type': 'application/json'},
      body: JSON.stringify({
        token,
        newPassword,
      }),
    })
      .then(this._checkStatus)
      .then(() => {
        return Promise.resolve();
      });
  };

  requestPasswordChange = (oldPassword, newPassword) => {
    return fetch('/users/password/change', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
        Authorization: this.getToken(),
      },
      body: JSON.stringify({
        oldPassword,
        newPassword,
      }),
    })
      .then(this._checkStatus)
      .then(() => this.logout());
  };

  fetchMethod = async (url, options) => {
    const headers = {
      'Content-Type': 'application/json',
    };
    return fetch(url, {
      headers,
      ...options,
    })
      .then(this._checkStatus)
      .then(response => response.headers.get('Authorization'));
  };

  login = (username, password) => {
    return this.fetchMethod('https://192.168.0.106:9000/api/jwt/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username,
        password,
      }),
    }).then(data => {
      return data
        ? setToken(data)
        : Promise.reject('Invalid credentials or service is unavailable.');
    });
  };

  async loggedIn() {
    const token = await this.getToken();
    return token && !(await this.isTokenExpired(token));
  }

  isTokenExpired(token) {
    try {
      const decoded = decodeJWT(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  async getToken() {
    try {
      return await AsyncStorage.getItem('id_token');
    } catch (error) {
      console.log(error.message);
    }
  }

  logout() {
    AsyncStorage.removeItem('id_token');
  }

  getProfile = () => {
    return decodeJWT(this.getToken());
  };

  _checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    } else {
      let error = new Error(response.statusText);
      error.response = response;
      throw error;
    }
  }
}
