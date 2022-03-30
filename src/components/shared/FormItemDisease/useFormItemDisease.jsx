import { Form, Input, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import diseaseAPI from '../../../api/diseaseAPI';

const useFormItemDisease = () => {
  const [diseaseSource, setDiseaseSource] = useState([]);

  const getAllDisease = async () => {
    try {
      const diseaseSourceResult = await diseaseAPI.getAllDiseases();
      setDiseaseSource(diseaseSourceResult);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllDisease();
  }, []);

  return {
    renderFormItemDisease: (
      <>
        <Form.Item
          name="diseaseId"
          label="Bệnh Theo Dõi:"
          rules={[
            {
              required: true,
              message: 'Bệnh Theo Dõi không được để trống!',
            },
          ]}
        >
          <Select
            allowClear
            showSearch
            placeholder="Vui lòng chọn Bệnh Theo Dõi"
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {diseaseSource.map((disease) => {
              return <Select.Option value={disease.id}>{disease.name}</Select.Option>;
            })}
          </Select>
        </Form.Item>
      </>
    ),
  };
};

export default useFormItemDisease;
