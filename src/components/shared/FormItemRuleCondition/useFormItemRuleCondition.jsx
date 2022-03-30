import { Form, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import ruleConditionAPI from '../../../api/ruleConditionAPI';

const useFormItemRuleCondition = (multipleSelect) => {
  const [ruleConditionSource, setRuleConditionSource] = useState([]);

  const getAllRuleCondition = async () => {
    try {
      const ruleConditionSourceResult = await ruleConditionAPI.getAllRuleConditions();
      setRuleConditionSource(ruleConditionSourceResult);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllRuleCondition();
  }, []);

  return {
    renderFormItemRuleCondition: (
      <>
        <Form.Item
          name="ruleConditionId"
          label="Luật Y Tế:"
          ruleConditions={[
            {
              required: true,
              message: 'Luật Y Tế không được để trống!',
            },
          ]}
        >
          <Select
            allowClear
            mode={multipleSelect ? 'multiple' : ''}
            placeholder="Vui lòng chọn Luật Y Tế"
            showSearch
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
          >
            {ruleConditionSource.map((ruleCondition) => {
              return <Select.Option value={ruleCondition.id}>{ruleCondition.name}</Select.Option>;
            })}
          </Select>
        </Form.Item>
      </>
    ),
  };
};

export default useFormItemRuleCondition;
