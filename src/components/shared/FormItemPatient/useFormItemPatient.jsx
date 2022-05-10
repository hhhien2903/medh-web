import { Empty, Form, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import patientAPI from '../../../api/patientAPI';

const useFormItemPatient = () => {
  const [patientSource, setPatientSource] = useState([]);
  const [isFormItemPatientDisabled, setIsFormItemPatientDisabled] = useState(false);
  const getAllPatient = async () => {
    try {
      const patientSourceResult = await patientAPI.getAllPatients();
      setPatientSource(patientSourceResult);
    } catch (error) {
      console.log(error);
    }
  };

  const getAllPatientIsTreated = async () => {
    try {
      const patientSourceResult = await patientAPI.getAllPatientsIsTreated();
      setPatientSource(patientSourceResult);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllPatient();
  }, []);

  return {
    getAllPatientIsTreated,
    setIsFormItemPatientDisabled,
    setPatientSource,
    patientSource,
    renderFormItemPatient: (
      <>
        <Form.Item
          name="patientId"
          label="Bệnh Nhân:"
          rules={[
            {
              required: true,
              message: 'Bệnh Nhân không được để trống!',
            },
          ]}
        >
          <Select
            disabled={isFormItemPatientDisabled}
            notFoundContent={
              <Empty
                description="Không có dữ liệu."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ height: 50 }}
              />
            }
            placeholder="Vui lòng chọn Bệnh Nhân"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {patientSource.map((patient) => {
              return (
                <Select.Option value={patient.id}>
                  {patient.surname + ' ' + patient.name}
                </Select.Option>
              );
            })}
          </Select>
        </Form.Item>
      </>
    ),
  };
};

export default useFormItemPatient;
