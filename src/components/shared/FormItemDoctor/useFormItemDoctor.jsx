import { Form, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import doctorAPI from '../../../api/doctorAPI';

const useFormItemDoctor = () => {
  const [doctorSource, setDoctorSource] = useState([]);
  const [isDoctorFormItemRequired, setIsDoctorFormItemRequired] = useState(true);
  const getAllDoctor = async () => {
    try {
      const doctorSourceResult = await doctorAPI.getAllDoctors();
      setDoctorSource(doctorSourceResult);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllDoctor();
  }, []);

  return {
    setIsDoctorFormItemRequired,
    renderFormItemDoctor: (
      <>
        <Form.Item
          name="doctorId"
          label="Bác Sĩ Phụ Trách:"
          rules={[
            {
              required: isDoctorFormItemRequired,
              message: 'Bác Sĩ Phụ Trách không được để trống!',
            },
          ]}
        >
          <Select
            showSearch
            placeholder="Vui lòng chọn Bác Sĩ Phụ Trách"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {doctorSource.map((doctor) => {
              return <Select.Option value={doctor.id}>{doctor.name}</Select.Option>;
            })}
          </Select>
        </Form.Item>
      </>
    ),
  };
};

export default useFormItemDoctor;
