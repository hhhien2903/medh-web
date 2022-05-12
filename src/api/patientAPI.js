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
  getAllPatientsIsTreated: () => {
    const url = `${API_ENDPOINT}?treated=true`;
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
  assignPatientForDoctor: (data) => {
    const url = `${API_ENDPOINT}/doctor`;
    return axiosClient.patch(url, data);
  },
  searchAllPatients: (treated, search) => {
    const url = `${API_ENDPOINT}?treated=${treated ? true : false}&text=${search}`;
    return axiosClient.get(url);
  },
};

export default patientAPI;
