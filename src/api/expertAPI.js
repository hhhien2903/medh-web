import { axiosClient } from './axiosClient';

const API_ENDPOINT = '/expert';

const expertAPI = {
  register: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.post(url, data);
  },
  checkAccountRegistered: (mobile, email) => {
    if (!mobile) {
      mobile = '';
    }
    if (!email) {
      email = '';
    }
    const url = `${API_ENDPOINT}/check/info?mobile=${mobile}&email=${email}`;
    return axiosClient.get(url);
  },
  updateInfo: (data) => {
    const url = `${API_ENDPOINT}?id=${data.id}`;
    return axiosClient.put(url, data);
  },
};

export default expertAPI;
