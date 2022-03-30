import { axiosClient } from './axiosClient';

const API_ENDPOINT = '/patient';

const patientAPI = {
  createPatient: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.post(url, data);
  },
  getAllPatients: () => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.get(url);
  },
  updatePatient: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.put(url, data);
  },
  deletePatient: (id) => {
    const url = `${API_ENDPOINT}/${id}`;
    return axiosClient.delete(url);
  },
};

export default patientAPI;
