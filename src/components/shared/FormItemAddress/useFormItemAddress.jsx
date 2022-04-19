import { Empty, Form, Input, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import addressAPI from '../../../api/addressAPI';

const useFormItemAddress = (form) => {
  const [citySource, setCitySource] = useState([]);
  const [wardSource, setWardSource] = useState([]);
  const [districtSource, setDistrictSource] = useState([]);
  const [isDisableDistrict, setIsDisableDistrict] = useState(true);
  const [isDisableWard, setIsDisableWard] = useState(true);
  // const [form, setForm] = useState(null);

  const onCitySelect = async (selectedCity) => {
    try {
      form.resetFields(['districtId', 'wardId']);
      const districtSourceResult = await addressAPI.getDistrict(selectedCity);
      setIsDisableWard(true);
      setIsDisableDistrict(false);
      setDistrictSource(districtSourceResult);
    } catch (error) {
      console.log(error);
    }
  };
  const onDistrictSelect = async (selectedDistrict) => {
    try {
      form.resetFields(['wardId']);
      const wardSourceResult = await addressAPI.getWard(selectedDistrict);
      setIsDisableWard(false);
      setWardSource(wardSourceResult);
    } catch (error) {
      console.log(error);
    }
  };

  const getCity = async () => {
    try {
      const citySourceResult = await addressAPI.getCity();
      setCitySource(citySourceResult);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getCity();
  }, []);

  return {
    setIsDisableDistrict,
    setIsDisableWard,
    setCitySource,
    setDistrictSource,
    setWardSource,
    citySource,
    wardSource,
    districtSource,
    onCitySelect,
    onDistrictSelect,
    renderFormItemAddress: (
      <>
        <Form.Item
          name="cityId"
          label="Tỉnh/Thành Phố:"
          rules={[
            {
              required: true,
              message: 'Tỉnh/Thành Phố không được để trống!',
            },
          ]}
        >
          <Select
            notFoundContent={
              <Empty
                description="Không có dữ liệu."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ height: 50 }}
              />
            }
            onChange={(selectedCity) => onCitySelect(selectedCity)}
            placeholder="Vui lòng chọn Tỉnh/Thành Phố"
          >
            {citySource.map((city) => {
              return (
                <Select.Option key={city.id} value={city.id}>
                  {city.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name="districtId"
          label="Quận/Huyện:"
          rules={[
            {
              required: true,
              message: 'Quận/Huyện không được để trống!',
            },
          ]}
        >
          <Select
            notFoundContent={
              <Empty
                description="Không có dữ liệu."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ height: 50 }}
              />
            }
            onChange={(selectedDistrict) => onDistrictSelect(selectedDistrict)}
            placeholder="Vui lòng chọn Quận/Huyện"
            disabled={isDisableDistrict}
          >
            {districtSource.map((district) => {
              return (
                <Select.Option key={district.id} value={district.id}>
                  {district.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name="wardId"
          label="Phường/Xã:"
          rules={[
            {
              required: true,
              message: 'Phường/Xã không được để trống!',
            },
          ]}
        >
          <Select
            notFoundContent={
              <Empty
                description="Không có dữ liệu."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ height: 50 }}
              />
            }
            placeholder="Vui lòng chọn Phường/Xã"
            disabled={isDisableWard}
          >
            {wardSource.map((ward) => {
              return (
                <Select.Option key={ward.id} value={ward.id}>
                  {ward.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
        <Form.Item
          name="address"
          label="Địa Chỉ:"
          rules={[
            {
              required: true,
              message: 'Địa chỉ không được để trống!',
            },
          ]}
        >
          <Input placeholder="Địa Chỉ" />
        </Form.Item>
      </>
    ),
  };
};

export default useFormItemAddress;
