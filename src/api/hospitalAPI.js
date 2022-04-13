import { axiosClient } from './axiosClient';

const API_ENDPOINT = '/hospital';

const hospitalAPI = {
  createHospital: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.post(url, data);
  },
  getAllHospital: () => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.get(url);
  },
  deleteHospital: (id) => {
    const url = `${API_ENDPOINT}/${id}`;
    return axiosClient.delete(url);
  },
  updateHospital: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.put(url, data);
  },
};

export default hospitalAPI;
