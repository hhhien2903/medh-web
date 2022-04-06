import {
  Button,
  Dropdown,
  Empty,
  Form,
  Input,
  InputNumber,
  Menu,
  message,
  Modal,
  Select,
  Table,
  Tag,
  TimePicker,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { MdMoreHoriz } from 'react-icons/md';
import ruleConditionAPI from '../../../api/ruleConditionAPI';
import moment from 'moment';
import {
  onePrecisionDecimalsRegex,
  twoPrecisionDecimalsRegex,
  vietnameseNameRegex,
} from '../../../utils/regex';
import './ExpertRuleConditionManager.scss';

const ExpertRuleConditionManager = () => {
  const [ruleConditionSource, setRuleConditionSource] = useState([]);
  const [isAddEditRuleModalVisible, setAddEditRuleModalVisible] = useState(false);
  const [isConfirmLoadingAddEditRuleModal, setIsConfirmLoadingAddEditRuleModal] = useState(false);
  const [formAddEditRule] = Form.useForm();
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsedFor, setModalUsedFor] = useState('');

  const dataSourceTest = [
    {
      id: 1,
      uuid: '98a20510-e61f-42a3-9324-3bbc6b51165f',
      createdAt: '2022-03-15T00:00:00.000Z',
      updatedAt: '2022-03-15T00:00:00.000Z',
      description: 'Bệnh COVID-19',
      name: 'COVID-19',
      mac_address: '50-5B-C2-AB-63-F1',
      email: 'test123@gmail.com',
      status: true,
      temp: '38',
      patient: 'Nguyễn Văn A',
      diseases: 'COVID-19',
    },
    {
      id: 2,
      uuid: '98a20510-e61f-42a3-9324-3bbc6b51165f',
      createdAt: '2022-03-15T00:00:00.000Z',
      updatedAt: '2022-03-15T00:00:00.000Z',
      description: 'Sốt xuất huyết',
      name: 'Sốt xuất huyết',
      mac_address: 'D8-C4-97-7A-2C-8F',
      email: 'test123@gmail.com',
      status: true,
      temp: '38.5',
      patient: 'Nguyễn Văn B',
      diseases: 'Sốt xuất huyết',
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
      render: (text, record) => ruleConditionSource.indexOf(record) + 1,
    },
    {
      title: 'Tên Luật Y Tế',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngưỡng Nhiệt Độ (°C)',
      dataIndex: 'temp',
      key: 'temp',
      render: (temp) => {
        return temp[0] + ' - ' + temp[1];
      },
    },
    {
      title: 'Ngưỡng Thời Gian (Phút)',
      dataIndex: 'time',
      key: 'time',
      render: (time) => {
        return time[0] + ' - ' + time[1];
      },
    },
    {
      title: 'Hành Động',
      dataIndex: 'treatment',
      key: 'treatment',
    },
    {
      title: 'Báo Hiệu',
      dataIndex: 'illumination',
      key: 'illumination',
      render: (illumination) => {
        if (illumination === 1) {
          return 'Xanh';
        }
        if (illumination === 2) {
          return 'Vàng';
        }
        if (illumination === 3) {
          return 'Cam';
        }
        if (illumination === 4) {
          return 'Đỏ';
        }
      },
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

  const handleDeleteRule = (record) => {
    const confirmDeleteRule = Modal.confirm({
      title: 'Xác Nhận',
      content: 'Bạn có chắc chắn muốn xoá?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await ruleConditionAPI.deleteRuleCondition(record.id);
          message.success('Xoá Thành Công.', 5);
          getAllRuleCondition();
        } catch (error) {
          message.error('Xoá Không Thành Công.', 5);
        }
      },
      onCancel() {
        confirmDeleteRule.destroy();
      },
    });
  };

  const handleEditRule = () => {
    formAddEditRule.validateFields().then((formValue) => {
      console.log(formValue);
    });
  };
  const handleAddRule = () => {
    formAddEditRule.validateFields().then(async (formValue) => {
      setIsConfirmLoadingAddEditRuleModal(true);
      console.log(formValue.time);
      try {
        const sendData = {
          name: formValue.name,
          temp: [formValue.tempLow, formValue.tempHigh],
          time: [formValue.time[0].minute(), formValue.time[1].minute()],
          treatment: formValue.treatment,
          illumination: formValue.illumination,
        };
        await ruleConditionAPI.createRuleCondition(sendData);
        message.success('Tạo Luật Y Tế thành công.', 5);
        getAllRuleCondition();
        handleCancelRuleModal();
      } catch (error) {
        console.log(error);
        message.error('Tạo Luật Y Tế không thành công.', 5);
      }
    });
  };

  const handleVisibleAddRule = () => {
    setAddEditRuleModalVisible(true);
    setModalUsedFor('addRule');
    setModalTitle('Thêm Luật Y Tế');
  };

  const handleVisibleEditRule = (record) => {
    setAddEditRuleModalVisible(true);
    setModalUsedFor('editRule');
    setModalTitle('Sửa Luật Y Tế');
    console.log(record);

    formAddEditRule.setFieldsValue({
      name: record.name,
      illumination: record.illumination,
      tempLow: record.temp[0],
      tempHigh: record.temp[1],
      time: [moment().minute(record.time[0]), moment().minute(record.time[1])],
      treatment: record.treatment,
      // gender: record.gender,
      // dateOfBirth: moment(record.dateOfBirth),
      // mobile: record.mobile,
      // isActive: record.isActive,
      // hospital: record.hospital.name,
      // email: record.email,
    });
  };

  const handleCancelRuleModal = () => {
    setAddEditRuleModalVisible(false);
    formAddEditRule.resetFields();
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
          Thêm Luật Y Tế
        </Button>

        <Input.Search placeholder="Tìm kiếm" style={{ width: 320 }} size="large" />
      </div>
      <Modal
        title={modalTitle}
        visible={isAddEditRuleModalVisible}
        okText="Xác Nhận"
        cancelText="Huỷ"
        // confirmLoading={isConfirmLoadingAddEditRuleModal}
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
          <Form.Item
            name="name"
            label="Tên Luật Y Tế:"
            rules={[
              {
                required: true,
                message: 'Tên Luật Y Tế không được để trống!',
              },
            ]}
          >
            <Input placeholder="Tên Luật Y Tế" />
          </Form.Item>

          <Form.Item
            // name="temp"
            label="Ngưỡng Nhiệt Độ (°C)::"
          >
            <Input.Group compact>
              <Form.Item
                name="tempLow"
                label="Nhiệt Độ Thấp:"
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
                name="tempHigh"
                label="Nhiệt Độ Cao:"
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
                  className="site-input-right input-text-align-center"
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
          <Form.Item name="time" label="Ngưỡng Thời Gian (Phút)::">
            <TimePicker.RangePicker
              style={{ width: '100%' }}
              allowClear
              placeholder={['Thời Gian Bắt Đầu', 'Thời Gian Kết Thúc']}
              showHour={false}
              showSecond={false}
              format="mm"
              className="timepicker"
            />
            {/* <Input.Group compact>
              <Form.Item
                name="timeStart"
                label="Thời Gian Bắt Đầu:"
                noStyle
                rules={[
                  {
                    required: true,
                    message: 'Thời Gian Bắt Đầu không được để trống.',
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
                    pattern: twoPrecisionDecimalsRegex,
                    message: 'Thời Gian Bắt Đầu bao gồm tối đa hai chữ số thập phân.',
                  },
                ]}
              >
                <InputNumber
                  controls={false}
                  style={{ width: `calc(50% - 15px)`, textAlign: 'center' }}
                  placeholder="Thời Gian Bắt Đầu"
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
                name="timeEnd"
                label="Thời Gian Kết Thúc:"
                noStyle
                rules={[
                  {
                    required: true,
                    message: 'Thời Gian Kết Thúc không được để trống.',
                  },
                  {
                    required: true,
                    pattern: twoPrecisionDecimalsRegex,
                    message: 'Thời Gian Kết Thúc gồm tối đa hai chữ số thập phân.',
                  },
                ]}
              >
                <InputNumber
                  className="site-input-right"
                  style={{
                    width: `calc(50% - 15px)`,
                    textAlign: 'center',
                  }}
                  type="number"
                  placeholder="Thời Gian Kết Thúc"
                  controls={false}
                />
              </Form.Item>
            </Input.Group> */}
          </Form.Item>
          <Form.Item
            name="treatment"
            label="Hành Động:"
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
            name="illumination"
            label="Báo Hiệu:"
            rules={[
              {
                required: true,
                message: 'Báo Hiệu không được để trống!',
              },
            ]}
          >
            <Select
              placeholder="Vui Lòng Chọn Mức Báo Hiệu"
              // mode="multiple"
              // onChange={(value) => {
              //   if (value?.length > 1) {
              //     value.pop();
              //   }
              // }}
              showArrow
              // tagRender={(props) => {
              //   const { label, value } = props;
              //   return <Tag color={value}>{label}</Tag>;
              // }}
              // options={[
              //   { value: 'green', label: 'Xanh' },
              //   { value: 'yellow', label: 'Vàng' },
              //   { value: 'orange', label: 'Cam' },
              //   { value: 'red', label: 'Đỏ' },
              // ]}
              allowClear
            >
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
        </Form>
      </Modal>
      <Table
        locale={{
          emptyText: <Empty description="Không có dữ liệu." />,
        }}
        columns={tableColumns}
        dataSource={ruleConditionSource}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ExpertRuleConditionManager;
