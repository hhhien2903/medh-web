import { axiosClient, axiosClientFormData } from './axiosClient';

const API_ENDPOINT = '/doctor';

const doctorAPI = {
  createDoctor: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.post(url, data);
  },
  getAllDoctors: () => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.get(url);
  },
  getAllDoctorsByHospitalId: (hospitalId) => {
    const url = `${API_ENDPOINT}?hospitalId=${hospitalId}`;
    return axiosClient.get(url);
  },
  getPendingDoctors: () => {
    const url = `${API_ENDPOINT}/application/pending`;
    return axiosClient.get(url);
  },
  approvePendingDoctor: (id) => {
    const url = `${API_ENDPOINT}/active?id=${id}`;
    return axiosClient.patch(url);
  },
  activeDoctor: (id) => {
    const url = `${API_ENDPOINT}/active?id=${id}`;
    return axiosClient.patch(url);
  },
  disableDoctor: (id) => {
    const url = `${API_ENDPOINT}/disable?id=${id}`;
    return axiosClient.patch(url);
  },
  updateDoctor: (data) => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.put(url, data);
  },
  uploadAvatar: (id, data) => {
    const url = `${API_ENDPOINT}/avatar/${id}`;
    return axiosClientFormData.patch(url, data);
  },
  getDoctorById: (id) => {
    const url = `${API_ENDPOINT}/${id}`;
    return axiosClient.get(url);
  },
  searchDoctorByHospitalIdText: (hospitalId, search) => {
    const url = `${API_ENDPOINT}?hospitalId=${hospitalId}&text=${search}`;
    return axiosClient.get(url);
  },
  searchDoctor: (search, option) => {
    const url = `${API_ENDPOINT}?text=${search}${option ? option : ''}`;
    console.log(url);
    // return axiosClient.get(url);
  },
};

export default doctorAPI;
