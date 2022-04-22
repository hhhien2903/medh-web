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
  getAllDevicesByHospitalId: (hospitalId) => {
    const url = `${API_ENDPOINT}?hospitalId=${hospitalId}`;
    return axiosClient.get(url);
  },
  getAllUnusedDevicesByHospitalId: (hospitalId) => {
    const url = `${API_ENDPOINT}?hospitalId=${hospitalId}&used=false`;
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
  moveDeviceToHospital: (deviceId, hospitalId) => {
    const url = `${API_ENDPOINT}/move/hospital?id=${deviceId}&hospitalId=${hospitalId}`;
    return axiosClient.patch(url);
  },
};

export default deviceAPI;
