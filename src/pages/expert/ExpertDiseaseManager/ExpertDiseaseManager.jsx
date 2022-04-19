import { Button, Dropdown, Empty, Form, Input, Menu, message, Modal, Table } from 'antd';
import React, { useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { MdMoreHoriz } from 'react-icons/md';
import diseaseAPI from '../../../api/diseaseAPI';
import useFormItemRule from '../../../components/shared/FormItemRule/useFormItemRule';
import useLoadingSkeleton from '../../../components/shared/LoadingSkeleton/useLoadingSkeleton';
import './ExpertDiseaseManager.scss';
const ExpertDiseaseManager = () => {
  const [diseaseSource, setDiseaseSource] = useState([]);
  const [isAddEditDiseaseModalVisible, setAddEditDiseaseModalVisible] = useState(false);
  const [isConfirmLoadingAddEditDiseaseModal, setIsConfirmLoadingAddEditDiseaseModal] =
    useState(false);
  const [formAddEditDisease] = Form.useForm();
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsedFor, setModalUsedFor] = useState('');
  const { renderFormItemRule, getAllRulesNotAssign } = useFormItemRule();
  const { renderLoadingSkeleton, setIsLoadingSkeleton, isLoadingSkeleton } = useLoadingSkeleton();
  // const [stepForm, setStepForm] = useState(1);
  const [diseasesIdForAssignRule, setDiseasesIdForAssignRule] = useState(null);

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
      console.log(diseaseSourceResult);
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
        await diseaseAPI.updateDisease(sendData);
        await diseaseAPI.assignRule(assignRuleData);
        message.success('Sửa Mầm Bệnh thành công.', 5);
        getAllDiseases();
        handleCancelDiseaseModal();
      } catch (error) {
        console.log(error);
        message.error(
          'Sửa Mầm Bệnh không thành công. Hãy đảm bảo Tập Luật Y Tế chưa từng được chọn cho Mầm Bệnh nào.',
          5
        );
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
        setDiseasesIdForAssignRule(createDiseaseResult.id);
        message.success('Tạo Mầm Bệnh thành công. Hãy chọn Tập Luật Y Tế cho Mầm Bệnh.', 5);
        // setStepForm(2);
        setModalUsedFor('assignRule');
        setModalTitle('Chọn Tập Luật Y Tế');
        // getAllDiseases();
        // handleCancelDiseaseModal();
        setIsConfirmLoadingAddEditDiseaseModal(false);
      } catch (error) {
        console.log(error);
        message.error('Tạo Mầm Bệnh không thành công. ', 5);
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

  const handleAssignRule = () => {
    formAddEditDisease.validateFields().then(async (formValue) => {
      setIsConfirmLoadingAddEditDiseaseModal(true);
      try {
        const assignRuleData = {
          id: diseasesIdForAssignRule,
          ruleId: formValue.ruleId,
        };
        await diseaseAPI.assignRule(assignRuleData);
        message.success('Chọn Tập Luật Y Tế thành công.', 5);
        getAllDiseases();
        handleCancelDiseaseModal();
        setIsConfirmLoadingAddEditDiseaseModal(false);
      } catch (error) {
        console.log(error);
        message.error(
          'Chọn Tập Luật Y Tế không thành công. Hãy đảm bảo Tập Luật Y Tế chưa từng được chọn cho Mầm Bệnh nào.',
          10
        );
        setIsConfirmLoadingAddEditDiseaseModal(false);
      }
    });
  };

  const handleVisibleAddDisease = async () => {
    await getAllRulesNotAssign();
    setAddEditDiseaseModalVisible(true);
    setModalUsedFor('addDisease');
    setModalTitle('Thêm Mầm Bệnh');
  };

  const handleVisibleEditDisease = async (record) => {
    await getAllRulesNotAssign();
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
    // setStepForm(1);
    getAllDiseases();
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
          switch (modalUsedFor) {
            case 'addDisease':
              handleAddDisease();
              break;
            case 'editDisease':
              handleEditDisease();
              break;
            case 'assignRule':
              handleAssignRule();
              break;
            default:
              break;
          }
        }}
      >
        <Form layout="vertical" className="add-disease-form" form={formAddEditDisease}>
          <>
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
          </>

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
