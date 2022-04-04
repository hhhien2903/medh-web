import {
  Button,
  Dropdown,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Modal,
  Select,
  Space,
  Table,
  TimePicker,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlinePlus,
  AiOutlineMinusCircle,
  AiOutlinePlusCircle,
} from 'react-icons/ai';
import { MdMoreHoriz } from 'react-icons/md';
import ruleAPI from '../../../api/ruleAPI';
import { onePrecisionDecimalsRegex, vietnameseNameRegex } from '../../../utils/regex';
import './ExpertRuleManager.scss';

const ExpertRuleManager = () => {
  const [ruleSource, setRuleSource] = useState([]);
  const [isAddEditRuleModalVisible, setAddEditRuleModalVisible] = useState(false);
  const [isConfirmLoadingAddEditRuleModal, setIsConfirmLoadingAddEditRuleModal] = useState(false);
  const [formAddEditRule] = Form.useForm();
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsedFor, setModalUsedFor] = useState('');
  // const { re } = useForm.ItemRuleCondition(true);
  const dataSourceTest = [
    {
      id: 3,
      uuid: '362e2851-f148-4642-8660-83d65b014460',
      createdAt: '2022-03-27T00:00:00.000Z',
      updatedAt: '2022-03-27T00:00:00.000Z',
      name: 'Tập luật COVID-19',
      description: 'Không',
      rule_condition: [
        {
          id: 2,
          uuid: 'd2831c9b-96e0-4c20-b6db-b93a39d3a035',
          createdAt: '2022-03-27T00:00:00.000Z',
          updatedAt: '2022-03-27T00:00:00.000Z',
          name: 'COVID -19 (Nặng)',
          temp: [39, 41],
          time: [25, 40],
          treatment: 'Yêu cầu Bác Sĩ',
          illumination: 4,
        },
        {
          id: 4,
          uuid: 'bd4d39ee-9863-4ac2-ba0f-a21a91e7e84f',
          createdAt: '2022-04-02T00:00:00.000Z',
          updatedAt: '2022-04-02T00:00:00.000Z',
          name: 'COVID -19 (Nhẹ)',
          temp: [30, 40],
          time: [20, 30],
          treatment: 'string',
          illumination: 1,
        },
      ],
    },
  ];
  const tableColumns = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    // },
    {
      title: 'STT',
      key: 'index',
      width: 40,
      align: 'center',
      render: (text, record) => ruleSource.indexOf(record) + 1,
    },
    {
      title: 'Tên Tập Luật Y Tế',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô Tả',
      dataIndex: 'description',
      key: 'description',
      // render: (name) => <Link to="/expert/patient/123">{name}</Link>,
    },
    {
      title: 'Tác Vụ',
      key: 'action',
      align: 'center',

      render: (record) => {
        return (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="1"
                  icon={<AiOutlineEdit size={15} color="#1890FF" />}
                  style={{ color: '#1890FF' }}
                  onClick={() => handleVisibleEditRule(record)}
                >
                  Sửa thông tin
                </Menu.Item>
                <Menu.Item
                  key="2"
                  icon={<AiOutlineDelete size={15} color="#FF4D4F" />}
                  style={{ color: '#FF4D4F' }}
                  onClick={() => handleDeleteRule(record)}
                >
                  Xoá
                </Menu.Item>
                {/* <Menu.Item
                  key="3"
                  icon={<AiOutlineInfoCircle size={15} />}
                   onClick={() => handleVisibleDetailDoctor(record)}
                >
                  Xem chi tiết
                </Menu.Item> */}
              </Menu>
            }
            trigger={['click']}
          >
            <Button
              icon={
                <MdMoreHoriz
                  style={{
                    verticalAlign: 'middle',
                    marginBottom: '1px',
                  }}
                  size={20}
                />
              }
            ></Button>
          </Dropdown>
        );
      },
    },
  ];
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

  const handleDeleteRule = (record) => {
    const confirmDeleteRule = Modal.confirm({
      title: 'Xác Nhận',
      content: 'Bạn có chắc chắn muốn xoá?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await ruleAPI.deleteRule(record.id);
          confirmDeleteRule.destroy();
          message.success('Xoá thành công', 5);
          getAllRule();
        } catch (error) {
          console.log(error);
          message.success('Xoá không thành công', 5);
        }
      },
      onCancel() {
        confirmDeleteRule.destroy();
      },
    });
  };

  const handleEditRule = () => {
    formAddEditRule.validateFields().then(async (formValue) => {
      setIsConfirmLoadingAddEditRuleModal(true);
      try {
        const sendData = {
          name: formValue.name,
          description: formValue.description,
          id: formValue.id,
        };
        await ruleAPI.createRule(sendData);
        message.success('Tạo Tập Luật Y Tế thành công.', 5);
        getAllRule();
        handleCancelRuleModal();
      } catch (error) {
        console.log(error);
        message.error('Tạo Tập Luật Y Tế không thành công.', 5);
        setIsConfirmLoadingAddEditRuleModal(false);
      }
    });
  };
  const handleAddRule = () => {
    formAddEditRule.validateFields().then(async (formValue) => {
      console.log(formValue);
      // setIsConfirmLoadingAddEditRuleModal(true);
      // try {
      //   const sendData = {
      //     name: formValue.name,
      //     description: formValue.description,
      //     id: formValue.id,
      //   };
      //   await ruleAPI.updateRule(sendData);
      //   message.success('Sửa thành công.', 5);
      //   getAllRule();
      //   handleCancelRuleModal();
      // } catch (error) {
      //   console.log(error);
      //   message.error('Sửa không thành công.', 5);
      //   setIsConfirmLoadingAddEditRuleModal(false);
      // }
    });
  };

  const handleVisibleAddRule = () => {
    setAddEditRuleModalVisible(true);
    setModalUsedFor('addRule');
    setModalTitle('Thêm Tập Luật Y Tế');
  };

  const handleVisibleEditRule = (record) => {
    setAddEditRuleModalVisible(true);
    setModalUsedFor('editRule');
    setModalTitle('Sửa Tập Luật Y Tế');
    console.log(record);
    formAddEditRule.setFieldsValue({
      name: record.name,
      description: record.description,
      id: record.id,
    });
  };

  const handleCancelRuleModal = () => {
    setAddEditRuleModalVisible(false);
    formAddEditRule.resetFields();
    setIsConfirmLoadingAddEditRuleModal(false);
  };

  return (
    <div className="rule-manager-container">
      <div className="tool-container">
        <Button
          type="primary"
          icon={
            <AiOutlinePlus
              style={{
                verticalAlign: 'middle',
                marginRight: '5px',
                marginBottom: '2px',
                marginLeft: '-5px',
              }}
            />
          }
          size="large"
          style={{ marginBottom: '10px' }}
          onClick={handleVisibleAddRule}
        >
          Thêm Tập Luật Y Tế
        </Button>

        <Input.Search placeholder="Tìm kiếm" style={{ width: 320 }} size="large" />
      </div>
      <Modal
        title={modalTitle}
        visible={isAddEditRuleModalVisible}
        okText="Xác Nhận"
        cancelText="Huỷ"
        confirmLoading={isConfirmLoadingAddEditRuleModal}
        className="add-rule-modal-container"
        onCancel={handleCancelRuleModal}
        // bodyStyle={{ overflowY: 'scroll' }}
        onOk={() => {
          if (modalUsedFor === 'addRule') {
            return handleAddRule();
          } else {
            return handleEditRule();
          }
        }}
      >
        <Form layout="vertical" className="add-rule-form" form={formAddEditRule}>
          <Form.Item name="id" noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên Tập Luật Y Tế:"
            rules={[
              {
                required: true,
                message: 'Tên Tập Luật không được để trống!',
              },
              // {
              //   pattern: vietnameseNameRegex,
              //   message: 'Tên Tập Luật không đúng định dạng',
              // },
            ]}
          >
            <Input placeholder="Tên Tập Luật Y Tế" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô Tả:"
            rules={[
              {
                required: true,
                message: ' không được để trống!',
              },
            ]}
          >
            <Input placeholder="Mô Tả" />
          </Form.Item>
          <Form.Item
            // name="rule-condition"
            label="Luật Y Tế:"
            // rules={[
            //   {
            //     required: true,
            //     message: ' không được để trống!',
            //   },
            // ]}
          >
            <Form.List name="rule_condition">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <Space
                      key={key}
                      direction="vertical"
                      // align="start"
                      style={{ display: 'flex' }}
                    >
                      <Form.Item
                      // name="temp"
                      >
                        <Input.Group compact>
                          <Form.Item
                            {...restField}
                            name={[name, 'tempLow']}
                            noStyle
                            rules={[
                              {
                                required: true,
                                message: 'Nhiệt Độ Thấp không được để trống.',
                              },
                              {
                                required: true,
                                type: 'number',
                                min: 10,
                                max: 50,
                                message: 'Nhiệt Độ phải trong ngưỡng 10 - 50°C.',
                              },

                              // {
                              //   validator(_, value) {
                              //     if (!formAddEditRule.getFieldValue('tempHigh')) {
                              //       return Promise.resolve();
                              //     }
                              //     if (value < formAddEditRule.getFieldValue('tempHigh')) {
                              //       return Promise.resolve();
                              //     }
                              //     return Promise.reject('Nhiệt Độ Thấp phải nhỏ hơn Nhiệt Độ Cao.');
                              //   },
                              // },
                              {
                                required: true,
                                pattern: onePrecisionDecimalsRegex,
                                message: 'Nhiệt Độ bao gồm tối đa một chữ số thập phân.',
                              },
                            ]}
                          >
                            <InputNumber
                              controls={false}
                              className="input-temp"
                              style={{ width: `calc(50% - 15px)`, textAlign: 'center' }}
                              placeholder="Nhiệt Độ Thấp"
                            />
                          </Form.Item>
                          <Input
                            className="site-input-split"
                            style={{
                              width: 30,
                              borderLeft: 0,
                              borderRight: 0,
                              pointerEvents: 'none',
                            }}
                            placeholder="-"
                            disabled
                          />
                          <Form.Item
                            {...restField}
                            name={[name, 'tempHigh']}
                            noStyle
                            rules={[
                              {
                                required: true,
                                message: 'Nhiệt Độ Cao không được để trống.',
                              },
                              {
                                required: true,
                                type: 'number',
                                min: 10,
                                max: 50,
                                message: 'Nhiệt Độ phải trong ngưỡng 10 - 50°C.',
                              },
                              {
                                required: true,
                                pattern: onePrecisionDecimalsRegex,
                                message: 'Nhiệt Độ bao gồm tối đa một chữ số thập phân.',
                              },
                            ]}
                          >
                            <InputNumber
                              className="input-temp"
                              style={{
                                width: `calc(50% - 15px)`,
                                textAlign: 'center',
                              }}
                              type="number"
                              placeholder="Nhiệt Độ Cao"
                              controls={false}
                            />
                          </Form.Item>
                        </Input.Group>
                      </Form.Item>
                      <Form.Item {...restField} name={[name, 'time']}>
                        <TimePicker.RangePicker
                          style={{ width: '100%' }}
                          allowClear
                          placeholder={['Thời Gian Bắt Đầu', 'Thời Gian Kết Thúc']}
                          showHour={false}
                          showSecond={false}
                          format="mm"
                          className="timepicker"
                        />
                      </Form.Item>

                      <Form.Item
                        {...restField}
                        name={[name, 'treatment']}
                        rules={[
                          {
                            required: true,
                            message: 'Hành Động không được để trống!',
                          },
                        ]}
                      >
                        <Input placeholder="Hành Động" />
                      </Form.Item>
                      <Form.Item
                        {...restField}
                        name={[name, 'illumination']}
                        rules={[
                          {
                            required: true,
                            message: 'Báo Hiệu không được để trống!',
                          },
                        ]}
                      >
                        <Select placeholder="Vui Lòng Chọn Mức Báo Hiệu" showArrow allowClear>
                          <Select.Option value={1} key={1}>
                            Xanh
                          </Select.Option>
                          <Select.Option value={2} key={2}>
                            Vàng
                          </Select.Option>
                          <Select.Option value={3} key={3}>
                            Cam
                          </Select.Option>
                          <Select.Option value={4} key={4}>
                            Đỏ
                          </Select.Option>
                        </Select>
                      </Form.Item>
                      <Button
                        type="dashed"
                        danger
                        onClick={() => remove(name)}
                        style={{ marginBottom: '10px' }}
                        block
                        icon={
                          <AiOutlineMinusCircle
                            style={{
                              verticalAlign: 'sub',
                              marginRight: '5px',
                              marginBottom: '2px',
                            }}
                          />
                        }
                      >
                        Xoá
                      </Button>
                    </Space>
                  ))}
                  <Form.Item>
                    <Button
                      type="dashed"
                      onClick={() => add()}
                      block
                      icon={
                        <AiOutlinePlusCircle
                          style={{ verticalAlign: 'sub', marginRight: '5px', marginBottom: '2px' }}
                        />
                      }
                    >
                      Thêm Luật Y Tế
                    </Button>
                  </Form.Item>
                </>
              )}
            </Form.List>
          </Form.Item>

          {/* {renderForm.ItemRuleCondition} */}
        </Form>
      </Modal>
      <Table columns={tableColumns} dataSource={dataSourceTest} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default ExpertRuleManager;
