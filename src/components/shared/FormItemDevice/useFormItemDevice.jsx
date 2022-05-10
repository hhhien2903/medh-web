import { Empty, Form, message, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import deviceAPI from '../../../api/deviceAPI';

const useFormItemDevice = () => {
  const [deviceSource, setDeviceSource] = useState([]);
  const [isDeviceFormItemRequired, setIsDeviceFormItemRequired] = useState(true);
  const [isFormItemDeviceDisabled, setIsFormItemDeviceDisabled] = useState(false);
  const getAllDevice = async () => {
    try {
      const deviceSourceResult = await deviceAPI.getAllDevices();
      setDeviceSource(deviceSourceResult);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllDevicesByHospitalId = async (hospitalId) => {
    try {
      const deviceSourceResult = await deviceAPI.getAllDevicesByHospitalId(hospitalId);
      setDeviceSource(deviceSourceResult);
    } catch (error) {
      console.log(error);
    }
  };
  const getAllUnusedDevicesByHospitalId = async (hospitalId) => {
    try {
      console.log(hospitalId);
      const deviceSourceResult = await deviceAPI.getAllUnusedDevicesByHospitalId(hospitalId);
      setDeviceSource(deviceSourceResult);
    } catch (error) {
      setDeviceSource([]);
      // setIsFormItemDeviceDisabled(true);
      // message.warning(error.data.message, 8);
    }
  };

  const onDropdownVisibleDeviceFormItem = (isDropdownVisible) => {
    if (isDropdownVisible) {
      if (deviceSource.length === 0) {
        // setIsFormItemDeviceDisabled(true);
        message.warning('Tất cả Thiết Bị của Bệnh Viện này đều đang được sử dụng.', 5);
      }
    }
  };
  useEffect(() => {
    getAllDevice();
  }, []);

  return {
    getAllUnusedDevicesByHospitalId,
    getAllDevicesByHospitalId,
    setIsDeviceFormItemRequired,
    setIsFormItemDeviceDisabled,
    setDeviceSource,
    deviceSource,
    renderFormItemDevice: (
      <>
        <Form.Item
          name="deviceId"
          label="Vòng Đeo:"
          rules={[
            {
              required: isDeviceFormItemRequired,
              message: 'Vòng Đeo không được để trống!',
            },
          ]}
        >
          <Select
            disabled={isFormItemDeviceDisabled}
            notFoundContent={
              <Empty
                description="Không có dữ liệu."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ height: 50 }}
              />
            }
            showSearch
            placeholder="Vui lòng chọn Vòng Đeo"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            onDropdownVisibleChange={onDropdownVisibleDeviceFormItem}
          >
            {deviceSource.map((device) => {
              return <Select.Option value={device.id}>{device.name}</Select.Option>;
            })}
          </Select>
        </Form.Item>
      </>
    ),
  };
};

export default useFormItemDevice;
