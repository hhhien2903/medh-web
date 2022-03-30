import { axiosClient } from './axiosClient';

const CITY_API_ENDPOINT = '/city';
const DISTRICT_API_ENDPOINT = '/district';
const WARD_API_ENDPOINT = '/ward';
const addressAPI = {
  getCity: () => {
    const url = `${CITY_API_ENDPOINT}`;
    return axiosClient.get(url);
  },
  getDistrict: (id) => {
    const url = `${DISTRICT_API_ENDPOINT}?cityId=${id}`;
    return axiosClient.get(url);
  },
  getWard: (id) => {
    const url = `${WARD_API_ENDPOINT}?districtId=${id}`;
    return axiosClient.get(url);
  },
};

export default addressAPI;
