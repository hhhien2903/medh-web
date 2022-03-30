import { Button, Dropdown, Form, Input, Menu, message, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { MdMoreHoriz } from 'react-icons/md';
import ruleAPI from '../../../api/ruleAPI';
import useFormItemRuleCondition from '../../../components/shared/FormItemRuleCondition/useFormItemRuleCondition';
import { vietnameseNameRegex } from '../../../utils/regex';
import './ExpertRuleManager.scss';

const ExpertRuleManager = () => {
  const [ruleSource, setRuleSource] = useState([]);
  const [isAddEditRuleModalVisible, setAddEditRuleModalVisible] = useState(false);
  const [isConfirmLoadingAddEditRuleModal, setIsConfirmLoadingAddEditRuleModal] = useState(false);
  const [formAddEditRule] = Form.useForm();
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsedFor, setModalUsedFor] = useState('');
  const { renderFormItemRuleCondition } = useFormItemRuleCondition(true);
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
      setIsConfirmLoadingAddEditRuleModal(true);
      try {
        const sendData = {
          name: formValue.name,
          description: formValue.description,
          id: formValue.id,
        };
        await ruleAPI.updateRule(sendData);
        message.success('Sửa thành công.', 5);
        getAllRule();
        handleCancelRuleModal();
      } catch (error) {
        console.log(error);
        message.error('Sửa không thành công.', 5);
        setIsConfirmLoadingAddEditRuleModal(false);
      }
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
          {renderFormItemRuleCondition}
        </Form>
      </Modal>
      <Table columns={tableColumns} dataSource={ruleSource} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default ExpertRuleManager;
