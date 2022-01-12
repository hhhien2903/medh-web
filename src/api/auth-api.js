import axiosClientJSON from './axios-client-json';
import TokenService from './token-service';

const register = (username, email, password) => {
  return axiosClientJSON.post('/auth/signup', {
    username,
    email,
    password,
  });
};

const login = (username, password) => {
  return axiosClientJSON
    .post('/login', {
      username,
      password,
    })
    .then((response) => {
      if (response.accessToken) {
        TokenService.setUser(response);
      }
      return response;
    });
};

const authApi = {
  register,
  login,
};

export default authApi;
