import { axiosClient } from './axiosClient';

const EXPERT_ENDPOINT = '/expert';

const expertAPI = {
  register: (data) => {
    const url = `${EXPERT_ENDPOINT}`;
    return axiosClient.post(url, data);
  },
  checkAccountRegistered: (mobile, email) => {
    if (!mobile) {
      mobile = '';
    }
    if (!email) {
      email = '';
    }
    const url = `${EXPERT_ENDPOINT}/check/info?mobile=${mobile}&email=${email}`;
    return axiosClient.get(url);
  },
  updateInfo: (data) => {
    const url = `${EXPERT_ENDPOINT}?id=${data.id}`;
    return axiosClient.put(url, data);
  },
};

export default expertAPI;
