import { Empty, Form, Select } from 'antd';
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
  useEffect(() => {
    getAllDevice();
  }, []);

  return {
    getAllDevicesByHospitalId,
    setIsDeviceFormItemRequired,
    setIsFormItemDeviceDisabled,
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
