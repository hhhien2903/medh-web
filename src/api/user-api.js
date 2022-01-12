import axiosClientJSON from './axios-client-json';
import axiosClientFormData from './axios-client-form-data';
const USER_ENDPOINT = process.env.REACT_APP_API_USER_ENDPOINT;

const userApi = {
  getUser: () => {
    const url = `/profile`;
    return axiosClientJSON.get(url);
  },
};

export default userApi;
