import { axiosClient } from './axiosClient';

const API_ENDPOINT = '/rule-condition';

const ruleConditionAPI = {
  createRuleCondition: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.post(url, data);
  },
  getAllRuleConditions: () => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.get(url);
  },
  updateRuleCondition: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.put(url, data);
  },
  deleteRuleCondition: (id) => {
    const url = `${API_ENDPOINT}/${id}`;
    return axiosClient.delete(url);
  },
};

export default ruleConditionAPI;
