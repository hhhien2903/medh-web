import { Empty, Form, Input, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import hospitalAPI from '../../../api/hospitalAPI';

const useFormItemHospital = () => {
  const [hospitalSource, setHospitalSource] = useState([]);
  const [isFormItemHospitalDisabled, setIsFormItemHospitalDisabled] = useState(false);
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
    setIsFormItemHospitalDisabled,
    renderFormItemHospital: (
      <>
        <Form.Item
          name="hospitalId"
          label="Bệnh Viện:"
          rules={[
            {
              required: true,
              message: 'Bệnh Viện không được để trống!',
            },
          ]}
        >
          <Select
            showSearch
            disabled={isFormItemHospitalDisabled}
            notFoundContent={
              <Empty
                description="Không có dữ liệu."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ height: 50 }}
              />
            }
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            placeholder="Vui lòng chọn Bệnh Viện "
          >
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
