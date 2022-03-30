import { axiosClient } from './axiosClient';

const API_ENDPOINT = '/hospital';

const hospitalAPI = {
  //   register: (data) => {
  //     const url = `${API_ENDPOINT}`;
  //     return axiosClient.post(url, data);
  //   },
  getAllHospital: () => {
    const url = `${API_ENDPOINT}`;
    return axiosClient.get(url);
  },
  //   getPendingDoctors: () => {
  //     const url = `${API_ENDPOINT}/application/pending`;
  //     return axiosClient.get(url);
  //   },
  //   approvePendingDoctor: (id) => {
  //     const url = `${API_ENDPOINT}/active?id=${id}`;
  //     return axiosClient.patch(url);
  //   },
  //   activeDoctor: (id) => {
  //     const url = `${API_ENDPOINT}/active?id=${id}`;
  //     return axiosClient.patch(url);
  //   },
  //   disableDoctor: (id) => {
  //     const url = `${API_ENDPOINT}/disable?id=${id}`;
  //     return axiosClient.patch(url);
  //   },
  //   updateInfo: (data) => {
  //     const url = `${API_ENDPOINT}?id=${data.id}`;
  //     return axiosClient.put(url, data);
  //   },
};

export default hospitalAPI;
