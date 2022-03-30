import { Form, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import ruleAPI from '../../../api/ruleAPI';

const useFormItemRule = (multipleSelect) => {
  const [ruleSource, setRuleSource] = useState([]);

  const getAllRule = async () => {
    try {
      const ruleSourceResult = await ruleAPI.getAllRules();
      setRuleSource(ruleSourceResult);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllRule();
  }, []);

  return {
    renderFormItemRule: (
      <>
        <Form.Item
          name="ruleId"
          label="Tập Luật Y Tế:"
          rules={[
            {
              required: true,
              message: 'Tập Luật Y Tế không được để trống!',
            },
          ]}
        >
          <Select
            allowClear
            mode={multipleSelect ? 'multiple' : ''}
            placeholder="Vui lòng chọn Tập Luật Y Tế"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {ruleSource.map((rule) => {
              return <Select.Option value={rule.id}>{rule.name}</Select.Option>;
            })}
          </Select>
        </Form.Item>
      </>
    ),
  };
};

export default useFormItemRule;
