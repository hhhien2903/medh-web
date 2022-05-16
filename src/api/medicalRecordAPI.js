import { axiosClient } from './axiosClient';

const API_ENDPOINT = '/medical-record';

const medicalRecordAPI = {
  createMedicalRecord: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.post(url, data);
  },
  getAllMedicalRecord: () => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.get(url);
  },
  findByMedicalRecordId: (id) => {
    const url = `${API_ENDPOINT}/${id}`;
    return axiosClient.get(url);
  },
  findByDoctorId: (id) => {
    const url = `${API_ENDPOINT}/find/doctor?doctorId=${id}`;
    return axiosClient.get(url);
  },
  findByPatientId: (id) => {
    const url = `${API_ENDPOINT}/find/patient?patientId=${id}`;
    return axiosClient.get(url);
  },
  findByOptions: (options) => {
    const url = `${API_ENDPOINT}/find/options?${options ? options : ''}`;
    return axiosClient.get(url);
  },
  endFollowMedicalRecord: (data) => {
    const url = `${API_ENDPOINT}/end-follow`;
    return axiosClient.patch(url, data);
  },
  deleteMedicalRecord: (id) => {
    const url = `${API_ENDPOINT}/${id}`;
    return axiosClient.delete(url);
  },
  updateMedicalRecord: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.put(url, data);
  },
  getReportByMedicalRecordId: (id) => {
    const url = `${API_ENDPOINT}/collect/report?id=${id}`;
    return axiosClient.get(url);
  },
  searchMedicalRecord: (search, options) => {
    const url = `${API_ENDPOINT}?text=${search}${options ? options : ''}`;
    return axiosClient.get(url);
  },
};

export default medicalRecordAPI;
