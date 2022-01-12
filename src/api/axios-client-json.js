// import axios from 'axios';
// import qs from 'qs';
// import TokenService from './token-service';

// const axiosClientJSON = axios.create({
//   baseURL: process.env.REACT_APP_API_BASE_URL,
//   headers: {
//     'content-type': 'application/json',
//   },
//   paramsSerializer: (params) => qs.stringify(params),
// });

// axiosClientJSON.interceptors.request.use(
//   async (config) => {
//     const token = TokenService.getLocalAccessToken();
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// axiosClientJSON.interceptors.response.use(
//   (response) => {
//     return response.data;
//   },
//   async (error) => {
//     const originalConfig = error.config;
//     if (originalConfig.url !== '/login' && error.response) {
//       // Access Token was expired
//       if (error.response.status === 401 && !originalConfig._retry) {
//         originalConfig._retry = true;

//         try {
//           const resultData = await axiosClientJSON.post('/refresh-token', {
//             refreshToken: TokenService.getLocalRefreshToken(),
//           });

//           const { accessToken } = resultData;
//           TokenService.updateLocalAccessToken(accessToken);

//           return axiosClientJSON(originalConfig);
//         } catch (_error) {
//           //refresh token bị khoá từ server
//           if (_error.response.status === 400) {
//             window.location = '/logout';
//             return Promise.reject(_error);
//           }
//           return Promise.reject(_error);
//         }
//       }
//     }

//     return Promise.reject(error);
//   }
// );

// export default axiosClientJSON;

import axios from 'axios';
import qs from 'qs';
import { firebase } from '../config/firebase';
const axiosClientJSON = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
  headers: {
    'content-type': 'application/json',
  },
  paramsSerializer: (params) => qs.stringify(params),
});

axiosClientJSON.interceptors.request.use(async (config) => {
  // Handle token here ..
  const currentUser = firebase.auth().currentUser;
  if (currentUser) {
    let token = await currentUser.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClientJSON.interceptors.response.use(
  (response) => {
    if (response && response.data) {
      return response.data;
    }
    return response;
  },
  (error) => {
    // Handle errors
    throw error.toJSON();
  }
);

export default axiosClientJSON;
