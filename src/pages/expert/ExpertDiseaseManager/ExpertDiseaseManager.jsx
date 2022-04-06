import {
  Alert,
  Button,
  Dropdown,
  Empty,
  Form,
  Input,
  Menu,
  Modal,
  notification,
  Table,
  message,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { MdMoreHoriz } from 'react-icons/md';
import diseaseAPI from '../../../api/diseaseAPI';
import useFormItemRule from '../../../components/shared/FormItemRule/useFormItemRule';
import { vietnameseNameRegex } from '../../../utils/regex';
import './ExpertDiseaseManager.scss';
import useLoadingSkeleton from '../../../components/shared/LoadingSkeleton/useLoadingSkeleton';
const ExpertDiseaseManager = () => {
  const [diseaseSource, setDiseaseSource] = useState([]);
  const [isAddEditDiseaseModalVisible, setAddEditDiseaseModalVisible] = useState(false);
  const [isConfirmLoadingAddEditDiseaseModal, setIsConfirmLoadingAddEditDiseaseModal] =
    useState(false);
  const [formAddEditDisease] = Form.useForm();
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsedFor, setModalUsedFor] = useState('');
  const { renderFormItemRule } = useFormItemRule();
  const { renderLoadingSkeleton, setIsLoadingSkeleton, isLoadingSkeleton } = useLoadingSkeleton();
  // const dataSourceTest = [
  //   {
  //     id: 1,
  //     uuid: '98a20510-e61f-42a3-9324-3bbc6b51165f',
  //     createdAt: '2022-03-15T00:00:00.000Z',
  //     updatedAt: '2022-03-15T00:00:00.000Z',
  //     description: 'Bệnh COVID-19',
  //     name: 'COVID-19',
  //     mac_address: '50-5B-C2-AB-63-F1',
  //     email: 'test123@gmail.com',
  //     status: true,
  //     temp: '38',
  //     patient: 'Nguyễn Văn A',
  //     diseases: 'COVID-19',
  //   },
  //   {
  //     id: 2,
  //     uuid: '98a20510-e61f-42a3-9324-3bbc6b51165f',
  //     createdAt: '2022-03-15T00:00:00.000Z',
  //     updatedAt: '2022-03-15T00:00:00.000Z',
  //     description: 'Sốt xuất huyết',
  //     name: 'Sốt xuất huyết',
  //     mac_address: 'D8-C4-97-7A-2C-8F',
  //     email: 'test123@gmail.com',
  //     status: true,
  //     temp: '38.5',
  //     patient: 'Nguyễn Văn B',
  //     diseases: 'Sốt xuất huyết',
  //   },
  // ];
  const tableColumns = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      hidden: true,
    },
    {
      title: 'STT',
      key: 'index',
      width: 40,
      align: 'center',
      render: (text, record) => diseaseSource.indexOf(record) + 1,
    },
    {
      title: 'Tên Mầm Bệnh',
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
      title: 'Tên Tập Luật',
      key: 'rule',
      render: (record) => record.rule?.name,
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
                  onClick={() => handleVisibleEditDisease(record)}
                >
                  Sửa thông tin
                </Menu.Item>
                <Menu.Item
                  key="2"
                  icon={<AiOutlineDelete size={15} color="#FF4D4F" />}
                  style={{ color: '#FF4D4F' }}
                  onClick={() => handleDeleteDisease(record)}
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
  ].filter((item) => !item.hidden);

  const getAllDiseases = async () => {
    try {
      setIsLoadingSkeleton(true);
      const diseaseSourceResult = await diseaseAPI.getAllDiseases();
      setDiseaseSource(diseaseSourceResult);
      setIsLoadingSkeleton(false);
    } catch (error) {
      setIsLoadingSkeleton(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getAllDiseases();
  }, []);

  const handleEditDisease = () => {
    formAddEditDisease.validateFields().then(async (formValue) => {
      setIsConfirmLoadingAddEditDiseaseModal(true);
      try {
        const sendData = {
          id: formValue.id,
          name: formValue.name,
          description: formValue.description,
        };
        const assignRuleData = {
          id: formValue.id,
          ruleId: formValue.ruleId,
        };
        console.log(assignRuleData);
        await diseaseAPI.updateDisease(sendData);
        await diseaseAPI.assignRule(assignRuleData);
        message.success('Sửa Mầm Bệnh thành công.', 5);
        getAllDiseases();
        handleCancelDiseaseModal();
      } catch (error) {
        console.log(error);
        message.error('Sửa Mầm Bệnh không thành công.', 5);
        setIsConfirmLoadingAddEditDiseaseModal(false);
      }
    });
  };

  const handleAddDisease = () => {
    formAddEditDisease.validateFields().then(async (formValue) => {
      setIsConfirmLoadingAddEditDiseaseModal(true);
      try {
        const sendData = {
          name: formValue.name,
          description: formValue.description,
        };
        const createDiseaseResult = await diseaseAPI.createDisease(sendData);
        const assignRuleData = {
          id: createDiseaseResult.id,
          ruleId: formValue.ruleId,
        };
        await diseaseAPI.assignRule(assignRuleData);
        message.success('Tạo Mầm Bệnh thành công.', 5);
        getAllDiseases();
        handleCancelDiseaseModal();
      } catch (error) {
        console.log(error);
        message.error('Tạo Mầm Bệnh không thành công.', 5);
        setIsConfirmLoadingAddEditDiseaseModal(false);
      }
    });
  };

  const handleDeleteDisease = (record) => {
    const confirmDeleteDisease = Modal.confirm({
      title: 'Xác Nhận',
      content: 'Bạn có chắc chắn muốn xoá?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',

      onOk: async () => {
        try {
          await diseaseAPI.deleteDisease(record.id);
          message.success('Xoá Mầm Bệnh thành công.', 5);
          getAllDiseases();
        } catch (error) {
          message.error('Xoá Mầm Bệnh không thành công.', 5);
          console.log(error);
        }
      },
      onCancel() {
        confirmDeleteDisease.destroy();
      },
    });
  };

  const handleVisibleAddDisease = () => {
    setAddEditDiseaseModalVisible(true);
    setModalUsedFor('addDisease');
    setModalTitle('Thêm Mầm Bệnh');
  };

  const handleVisibleEditDisease = (record) => {
    setAddEditDiseaseModalVisible(true);
    setModalUsedFor('editDisease');
    setModalTitle('Sửa Mầm Bệnh');
    formAddEditDisease.setFieldsValue({
      id: record.id,
      name: record.name,
      description: record.description,
      ruleId: record.rule?.id,
    });
  };

  const handleCancelDiseaseModal = () => {
    setAddEditDiseaseModalVisible(false);
    formAddEditDisease.resetFields();
    setIsConfirmLoadingAddEditDiseaseModal(false);
  };

  return (
    <div className="disease-manager-container">
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
          onClick={handleVisibleAddDisease}
        >
          Thêm Mầm Bệnh
        </Button>

        <Input.Search placeholder="Tìm kiếm" style={{ width: 320 }} size="large" />
      </div>
      <Modal
        title={modalTitle}
        visible={isAddEditDiseaseModalVisible}
        okText="Xác Nhận"
        cancelText="Huỷ"
        confirmLoading={isConfirmLoadingAddEditDiseaseModal}
        className="add-disease-modal-container"
        onCancel={handleCancelDiseaseModal}
        // bodyStyle={{ overflowY: 'scroll' }}
        onOk={() => {
          if (modalUsedFor === 'addDisease') {
            handleAddDisease();
            return;
          } else {
            handleEditDisease();
            return;
          }
        }}
      >
        <Form layout="vertical" className="add-disease-form" form={formAddEditDisease}>
          <Form.Item name="id" noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên Mầm Bệnh:"
            rules={[
              {
                required: true,
                message: 'Tên Mầm Bệnh không được để trống!',
              },
            ]}
          >
            <Input placeholder="Tên Mầm Bệnh" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô Tả:"
            rules={[
              {
                required: true,
                message: 'Mô Tả không được để trống!',
              },
            ]}
          >
            <Input placeholder="Mô Tả" />
          </Form.Item>
          {renderFormItemRule}
        </Form>
      </Modal>
      {isLoadingSkeleton ? (
        renderLoadingSkeleton
      ) : (
        <Table
          locale={{
            emptyText: <Empty description="Không có dữ liệu." />,
          }}
          columns={tableColumns}
          dataSource={diseaseSource}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default ExpertDiseaseManager;
