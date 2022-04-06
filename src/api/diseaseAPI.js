import { axiosClient } from './axiosClient';

const API_ENDPOINT = '/diseases';

const diseaseAPI = {
  createDisease: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.post(url, data);
  },
  getAllDiseases: () => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.get(url);
  },
  updateDisease: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.put(url, data);
  },
  deleteDisease: (id) => {
    const url = `${API_ENDPOINT}/${id}`;
    return axiosClient.delete(url);
  },
  assignRule: (data) => {
    const url = `${API_ENDPOINT}/rule?id=${data.id}&ruleId=${data.ruleId}`;
    return axiosClient.patch(url);
  },
};

export default diseaseAPI;
