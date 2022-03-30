import { Form, Input, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import hospitalAPI from '../../../api/hospitalAPI';

const useFormItemHospital = () => {
  const [hospitalSource, setHospitalSource] = useState([]);

  const getAllHospital = async () => {
    try {
      const hospitalSourceResult = await hospitalAPI.getAllHospital();
      setHospitalSource(hospitalSourceResult);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllHospital();
  }, []);

  return {
    renderFormItemHospital: (
      <>
        <Form.Item
          name="hospitalId"
          label="Bệnh Viện Công Tác:"
          rules={[
            {
              required: true,
              message: 'Bệnh Viện Công Tác không được để trống!',
            },
          ]}
        >
          <Select placeholder="Vui lòng chọn Bệnh Viện Công Tác">
            {hospitalSource.map((hospital) => {
              return <Select.Option value={hospital.id}>{hospital.name}</Select.Option>;
            })}
          </Select>
        </Form.Item>
      </>
    ),
  };
};

export default useFormItemHospital;
