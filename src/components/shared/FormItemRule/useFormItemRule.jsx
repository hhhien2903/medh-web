import { Empty, Form, Select } from 'antd';
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

  const getAllRulesNotAssign = async () => {
    try {
      const ruleSourceResult = await ruleAPI.getAllRulesNotAssign();
      setRuleSource(ruleSourceResult);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllRule();
  }, []);

  return {
    getAllRulesNotAssign,
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
            notFoundContent={
              <Empty
                description="Không có dữ liệu."
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                style={{ height: 50 }}
              />
            }
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
