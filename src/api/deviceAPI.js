import { axiosClient } from './axiosClient';

const API_ENDPOINT = '/device';

const deviceAPI = {
  createDevice: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.post(url, data);
  },
  getAllDevices: () => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.get(url);
  },
  deleteDevice: (id) => {
    const url = `${API_ENDPOINT}/${id}`;
    return axiosClient.delete(url);
  },
  updateDevice: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.put(url, data);
  },
};

export default deviceAPI;
