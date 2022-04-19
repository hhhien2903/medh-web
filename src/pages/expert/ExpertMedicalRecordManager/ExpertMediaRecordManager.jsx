import {
  Button,
  Dropdown,
  Empty,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Select,
  Table,
  Tag,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { MdMoreHoriz } from 'react-icons/md';
import medicalRecordAPI from '../../../api/medicalRecordAPI';
import useFormItemDisease from '../../../components/shared/FormItemDisease/useFormItemDisease';
import useFormItemPatient from '../../../components/shared/FormItemPatient/useFormItemPatient';
import useFormItemHospital from '../../../components/shared/FormItemHospital/useFormItemHospital';
import useFormItemDevice from '../../../components/shared/FormItemDevice/useFormItemDevice';
import useFormItemDoctor from '../../../components/shared/FormItemDoctor/useFormItemDoctor';
import useLoadingSkeleton from '../../../components/shared/LoadingSkeleton/useLoadingSkeleton';
import { vietnameseNameRegex } from '../../../utils/regex';
import moment from 'moment';
import './ExpertMedicalRecordManager.scss';

const ExpertMediaRecordManager = () => {
  const [medicalRecordSource, setMedicalRecordSource] = useState([]);
  const [isAddEditMedicalRecordModalVisible, setAddEditMedicalRecordModalVisible] = useState(false);
  const [formAddEditMedicalRecord] = Form.useForm();
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsedFor, setModalUsedFor] = useState('');
  const { renderLoadingSkeleton, setIsLoadingSkeleton, isLoadingSkeleton } = useLoadingSkeleton();
  const { renderFormItemDoctor, setIsFormItemDoctorDisabled, getAllDoctorByHospitalId } =
    useFormItemDoctor();
  const { renderFormItemDisease, setIsFormItemDiseaseDisabled } = useFormItemDisease();
  const { renderFormItemPatient, setIsFormItemPatientDisabled, getAllPatientIsTreated } =
    useFormItemPatient();
  const { renderFormItemDevice, setIsFormItemDeviceDisabled, getAllDevicesByHospitalId } =
    useFormItemDevice();
  const { renderFormItemHospital } = useFormItemHospital();
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
      render: (text, record) => medicalRecordSource.indexOf(record) + 1,
    },
    {
      title: 'Tên Bệnh Nhân',
      key: 'patient',
      render: (text, record) => {
        return record.patient?.name;
      },
    },
    {
      title: 'Bác Sĩ Phụ Trách',
      key: 'patient',
      render: (text, record) => {
        return record.doctor?.name;
      },
    },
    {
      title: 'Chuẩn Đoán',
      key: 'diagnose',
      dataIndex: 'diagnose',
    },
    {
      title: 'Ngày Lập Bệnh Án',
      key: 'createdAt',
      render: (text, record) => {
        return moment(record.createdAt).format('DD/MM/YYYY');
      },
    },
    {
      title: 'Ngày Kết Thúc Bệnh Án',
      key: 'updatedAt',
      render: (text, record) => {
        if (record.treated) {
          return moment(record.updatedAt).format('DD/MM/YYYY');
        } else {
          return 'Bệnh Án chưa kết thúc.';
        }
      },
    },

    {
      title: 'Trạng Thái',
      key: 'treated',
      align: 'center',
      width: 150,
      render: (text, record) => {
        return record.treated ? (
          <Tag color="gray" style={{ width: '120px' }}>
            Kết Thúc Điều Trị
          </Tag>
        ) : (
          <Tag color="green" style={{ width: '120px' }}>
            Đang Điều Trị
          </Tag>
        );
      },
    },

    {
      title: 'Tác Vụ',
      key: 'action',
      align: 'center',
      width: 60,
      render: (record) => {
        return (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="1"
                  icon={<AiOutlineEdit size={15} color="#1890FF" />}
                  style={{ color: '#1890FF' }}
                  onClick={() => handleVisibleEditMedicalRecord(record)}
                >
                  Sửa thông tin
                </Menu.Item>
                <Menu.Item
                  key="2"
                  icon={<AiOutlineDelete size={15} color="#FF4D4F" />}
                  style={{ color: '#FF4D4F' }}
                  onClick={() => handleDeleteMedicalRecord(record)}
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
  const getAllMedicalRecord = async () => {
    try {
      setIsLoadingSkeleton(true);
      const medicalRecordSourceResult = await medicalRecordAPI.getAllMedicalRecord();
      setMedicalRecordSource(medicalRecordSourceResult);
      setIsLoadingSkeleton(false);
      console.log(medicalRecordSourceResult);
    } catch (error) {
      setIsLoadingSkeleton(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAllMedicalRecord();
  }, []);

  const handleDeleteMedicalRecord = (record) => {
    const confirmDeleteMedicalRecord = Modal.confirm({
      title: 'Xác Nhận',
      content: 'Bạn có chắc chắn muốn xoá?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await medicalRecordAPI.deleteMedicalRecord(record.id);
          confirmDeleteMedicalRecord.destroy();
          message.success('Xoá thành công', 5);
          getAllMedicalRecord();
        } catch (error) {
          console.log(error);
          message.success('Xoá không thành công', 5);
        }
      },
      onCancel() {
        confirmDeleteMedicalRecord.destroy();
      },
    });
  };

  const handleEditMedicalRecord = () => {
    formAddEditMedicalRecord.validateFields().then((formValue) => {
      const confirmUpdateMedicalRecordModal = Modal.confirm({
        title: 'Xác Nhận',
        content: 'Bạn có chắc chắn với các thông tin đã nhập?',
        okText: 'Xác Nhận',
        cancelText: 'Không',
        onOk: async () => {
          try {
            await medicalRecordAPI.updateMedicalRecord({ ...formValue, status: true });
            message.success('Sửa Bệnh Án Thành Công.', 5);
            getAllMedicalRecord();
            handleCancelMedicalRecordModal();
          } catch (error) {
            console.log(error);
            message.error('Sửa Bệnh Án Không Thành Công.', 5);
          }
        },
        onCancel() {
          confirmUpdateMedicalRecordModal.destroy();
        },
      });
    });
  };
  const handleAddMedicalRecord = () => {
    formAddEditMedicalRecord.validateFields().then(async (formValue) => {
      console.log(formValue);
      try {
        await medicalRecordAPI.createMedicalRecord(formValue);
        message.success('Tạo Bệnh Án thành công.', 5);
        getAllMedicalRecord();
        handleCancelMedicalRecordModal();
      } catch (error) {
        console.log(error);
        message.error('Tạo Bệnh Án không thành công.', 5);
      }
    });
  };

  const handleVisibleAddMedicalRecord = async () => {
    await getAllPatientIsTreated();
    formAddEditMedicalRecord.setFieldsValue({ treated: false });
    setAddEditMedicalRecordModalVisible(true);
    setModalUsedFor('addMedicalRecord');
    setModalTitle('Thêm Bệnh Án');
    setIsFormItemDeviceDisabled(true);
    setIsFormItemDoctorDisabled(true);
    setIsFormItemDiseaseDisabled(true);
  };

  const handleVisibleEditMedicalRecord = async (record) => {
    setAddEditMedicalRecordModalVisible(true);
    setModalUsedFor('editMedicalRecord');
    setModalTitle('Sửa Thông Tin Bệnh Án');
    formAddEditMedicalRecord.setFieldsValue({
      id: record.id,
      name: record.name,
      cityId: record.cityId,
      wardId: record.wardId,
      districtId: record.districtId,
      address: record.address,
      status: record.status,
    });
  };

  const handleCancelMedicalRecordModal = () => {
    setAddEditMedicalRecordModalVisible(false);
    formAddEditMedicalRecord.resetFields();
  };

  const onChangeForm = async () => {
    if (formAddEditMedicalRecord.isFieldTouched('hospitalId')) {
      await getAllDoctorByHospitalId(formAddEditMedicalRecord.getFieldValue('hospitalId'));
      await getAllDevicesByHospitalId(formAddEditMedicalRecord.getFieldValue('hospitalId'));
      setIsFormItemDeviceDisabled(false);
      setIsFormItemDoctorDisabled(false);
      setIsFormItemDiseaseDisabled(false);
    }
  };

  return (
    <div className="medical-record-manager-container">
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
          onClick={handleVisibleAddMedicalRecord}
        >
          Thêm Bệnh Án
        </Button>

        <Input.Search placeholder="Tìm kiếm" style={{ width: 320 }} size="large" />
      </div>
      <Modal
        title={modalTitle}
        visible={isAddEditMedicalRecordModalVisible}
        okText="Xác Nhận"
        cancelText="Huỷ"
        className="add-edit-medical-record-modal-container"
        onCancel={handleCancelMedicalRecordModal}
        // bodyStyle={{ overflowY: 'scroll' }}
        onOk={() => {
          if (modalUsedFor === 'addMedicalRecord') {
            return handleAddMedicalRecord();
          } else {
            return handleEditMedicalRecord();
          }
        }}
      >
        <Form
          layout="vertical"
          className="add-edit-medical-record-form"
          form={formAddEditMedicalRecord}
          onFieldsChange={onChangeForm}
        >
          <Form.Item name="id" noStyle>
            <Input type="hidden"></Input>
          </Form.Item>
          {/* <Form.Item
              name="name"
              label="Tên Bệnh Viện:"
              rules={[
                {
                  required: true,
                  message: 'Tên Bệnh Viện không được để trống!',
                },
                // {
                //   pattern: vietnameseNameRegex,
                //   message: 'Tên Bệnh Viện không đúng định dạng',
                // },
              ]}
            >
              <Input placeholder="Tên Bệnh Viện" />
            </Form.Item> */}
          {renderFormItemPatient}
          {renderFormItemHospital}
          {renderFormItemDoctor}
          {renderFormItemDisease}
          {renderFormItemDevice}
          <Form.Item
            name="diagnose"
            label="Chuẩn Đoán:"
            rules={[
              {
                required: true,
                message: 'Chuẩn Đoán không được để trống!',
              },
            ]}
          >
            <Input placeholder="Chuẩn Đoán" />
          </Form.Item>
          <Form.Item
            name="treated"
            label="Tình Trạng Bênh Án:"
            rules={[
              {
                required: true,
                message: 'Tình Trạng Bênh Án không được để trống!',
              },
            ]}
          >
            <Select showSearch placeholder="Tình Trạng Bênh Án">
              <Select.Option value={false}>Đang Điều Trị</Select.Option>;
              <Select.Option value={true}>Kết Thúc Điều Trị</Select.Option>;
            </Select>
          </Form.Item>
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
          dataSource={medicalRecordSource}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default ExpertMediaRecordManager;
