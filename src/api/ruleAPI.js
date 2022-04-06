import { axiosClient } from './axiosClient';

const API_ENDPOINT = '/rule';

const ruleAPI = {
  createRule: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.post(url, data);
  },
  getAllRules: () => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.get(url);
  },
  updateRule: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.put(url, data);
  },
  deleteRule: (id) => {
    const url = `${API_ENDPOINT}/${id}`;
    return axiosClient.delete(url);
  },
  findById: (id) => {
    const url = `${API_ENDPOINT}/${id}`;
    return axiosClient.get(url);
  },
  clearRuleConditionsById: (id) => {
    const url = `${API_ENDPOINT}/${id}/clear-conditions`;
    return axiosClient.patch(url);
  },
};

export default ruleAPI;
