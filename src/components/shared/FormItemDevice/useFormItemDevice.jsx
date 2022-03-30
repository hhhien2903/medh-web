import { Form, Input, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import deviceAPI from '../../../api/deviceAPI';

const useFormItemDevice = () => {
  const [deviceSource, setDeviceSource] = useState([]);

  const getAllDevice = async () => {
    try {
      const deviceSourceResult = await deviceAPI.getAllDevices();
      setDeviceSource(deviceSourceResult);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllDevice();
  }, []);

  return {
    renderFormItemDevice: (
      <>
        <Form.Item
          name="deviceId"
          label="Vòng Đeo:"
          rules={[
            {
              required: true,
              message: 'Vòng Đeo không được để trống!',
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Vui lòng chọn Vòng Đeo"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
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
