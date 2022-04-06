import { Button, Dropdown, Empty, Form, Input, Menu, Modal, Select, Table, Tag } from 'antd';
import React, { useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineInfoCircle, AiOutlinePlus } from 'react-icons/ai';
import { MdMoreHoriz } from 'react-icons/md';
import doctorAPI from '../../../api/doctorAPI';
import useFormItemDisease from '../../../components/shared/FormItemDisease/useFormItemDisease';
import useFormItemPatient from '../../../components/shared/FormItemPatient/useFormItemPatient';
import { vietnameseNameRegex } from '../../../utils/regex';
import './ExpertDeviceManager.scss';

const ExpertDeviceManager = () => {
  const [doctorDataSource, setDoctorDataSource] = useState([]);
  const [isAddEditDeviceModalVisible, setAddEditDeviceModalVisible] = useState(false);
  const [isConfirmLoadingAddDoctorModal, setIsConfirmLoadingAddDoctorModal] = useState(false);
  const [formAddEditDoctor] = Form.useForm();
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsedFor, setModalUsedFor] = useState('');

  const { renderFormItemPatient } = useFormItemPatient();
  const { renderFormItemDisease } = useFormItemDisease();

  const dataSourceTest = [
    {
      id: 1,
      uuid: '98a20510-e61f-42a3-9324-3bbc6b51165f',
      createdAt: '2022-03-15T00:00:00.000Z',
      updatedAt: '2022-03-15T00:00:00.000Z',
      description: 'Vòng đeo tay',
      name: 'Vòng đeo tay số 1',
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
      description: 'Vòng đeo tay',
      name: 'Vòng đeo tay số 2',
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
      className: 'index-row',
      render: (text, record) => dataSourceTest.indexOf(record) + 1,
    },
    {
      title: 'Tên Thiết Bị',
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
      title: 'MAC',
      dataIndex: 'mac_address',
      key: 'mac_address',
    },

    {
      title: 'Bệnh Nhân',
      dataIndex: 'patient',
      key: 'patient',
    },
    {
      title: 'Bệnh Theo Dõi',
      dataIndex: 'diseases',
      key: 'diseases',
    },

    {
      title: 'Nhiệt Độ',
      dataIndex: 'temp',
      key: 'temp',
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      render: (status) => {
        if (status) {
          return <Tag color="green">Đang Hoạt Động</Tag>;
        }
        return <Tag color="volcano">Không Hoạt Động</Tag>;
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
                  onClick={() => handleVisibleEditDevice(record)}
                >
                  Sửa thông tin
                </Menu.Item>
                <Menu.Item
                  key="2"
                  icon={<AiOutlineDelete size={15} color="#FF4D4F" />}
                  style={{ color: '#FF4D4F' }}
                  onClick={() => handleDeleteDevice(record)}
                >
                  Xoá
                </Menu.Item>
                <Menu.Item
                  key="3"
                  icon={<AiOutlineInfoCircle size={15} />}
                  //  onClick={() => handleVisibleDetailDoctor(record)}
                >
                  Xem chi tiết
                </Menu.Item>
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
  const getAllDoctors = async () => {
    try {
      const listDoctors = await doctorAPI.getAllDoctors();
      setDoctorDataSource(listDoctors);
    } catch (error) {
      console.log(error);
    }
  };
  // useEffect(() => {
  //   getAllDoctors();
  // }, []);

  const handleDeleteDevice = (record) => {
    const confirmDeleteDevice = Modal.confirm({
      title: 'Xác Nhận',
      content: 'Bạn có chắc chắn muốn xoá?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk() {
        console.log('delete', record.id);
      },
      onCancel() {
        confirmDeleteDevice.destroy();
      },
    });
  };

  const handleEditDoctor = () => {
    formAddEditDoctor.validateFields().then((formValue) => {
      console.log(formValue);
    });
  };
  const handleAddDoctor = () => {};

  const handleVisibleAddDevice = () => {
    setAddEditDeviceModalVisible(true);
    setModalUsedFor('addDevice');
    setModalTitle('Thêm Thiết Bị');
  };

  const handleVisibleEditDevice = (record) => {
    setAddEditDeviceModalVisible(true);
    setModalUsedFor('editDevice');
    setModalTitle('Sửa Thiết Bị');
    console.log(record);
    formAddEditDoctor.setFieldsValue({
      name: record.name,
      gender: record.gender,
      description: record.description,
      mac_address: record.mac_address,
      isActive: record.isActive,
      patient: record.patient,
      diseases: record.diseases,
    });
  };

  const handleCancelAddDoctor = () => {
    setAddEditDeviceModalVisible(false);
    formAddEditDoctor.resetFields();
  };

  return (
    <div className="device-manager-container">
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
          onClick={handleVisibleAddDevice}
        >
          Thêm Thiết Bị
        </Button>

        <Input.Search placeholder="Tìm kiếm" style={{ width: 320 }} size="large" />
      </div>
      <Modal
        title={modalTitle}
        visible={isAddEditDeviceModalVisible}
        okText="Xác Nhận"
        cancelText="Huỷ"
        confirmLoading={isConfirmLoadingAddDoctorModal}
        className="add-device-modal-container"
        onCancel={handleCancelAddDoctor}
        // bodyStyle={{ overflowY: 'scroll' }}
        onOk={() => {
          if (modalUsedFor === 'addDevice') {
            return handleAddDoctor();
          } else {
            return handleEditDoctor();
          }
        }}
      >
        <Form layout="vertical" className="add-device-form" form={formAddEditDoctor}>
          <Form.Item
            name="name"
            label="Tên Thiết Bị:"
            rules={[
              {
                required: true,
                message: 'Tên thiết bị không được để trống!',
              },
              {
                pattern: vietnameseNameRegex,
                message: 'Tên thiết bị không đúng định dạng',
              },
            ]}
          >
            <Input placeholder="Tên Thiết Bị" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô Tả:"
            // rules={[
            //   {
            //     required: true,
            //     message: ' không được để trống!',
            //   },
            // ]}
          >
            <Input placeholder="Mô Tả" />
          </Form.Item>
          <Form.Item
            name="mac_address"
            label="MAC:"
            rules={[
              {
                required: true,
                message: 'Địa chỉ MAC không được để trống!',
              },
            ]}
          >
            <Input placeholder="Địa chỉ MAC" />
          </Form.Item>
          {/* <Form.Item
            name="patient"
            label="Bệnh Nhân:"
            rules={[
              {
                required: true,
                message: 'Bệnh Nhân không được để trống!',
              },
            ]}
          >
            <Select placeholder="Vui lòng chọn Bệnh Nhân">
              <Select.Option value={16}>16 - Nguyễn Văn A</Select.Option>
              <Select.Option value={17}>17 - Nguyễn Văn B</Select.Option>
            </Select>
          </Form.Item> */}
          {renderFormItemPatient}
          {renderFormItemDisease}
          {/* <Form.Item
            name="diseases"
            label="Bệnh Theo Dõi:"
            rules={[
              {
                required: true,
                message: 'Bệnh Theo Dõi không được để trống!',
              },
            ]}
          >
            <Select placeholder="Vui lòng chọn Bệnh Theo Dõi" mode="multiple">
              <Select.Option value="covid">COVID-19</Select.Option>
              <Select.Option value="sot_xuat_huyet">Sốt xuất huyết</Select.Option>
            </Select>
          </Form.Item> */}

          <Form.Item
            name="status"
            label="Trạng Thái Hoạt Động:"
            rules={[
              {
                required: true,
                message: 'Trạng Thái Hoạt Động không được để trống!',
              },
            ]}
          >
            <Select placeholder="Vui lòng chọn Trạng Thái Hoạt Động">
              <Select.Option value={true}>Hoạt Động</Select.Option>
              <Select.Option value={false}>Vô Hiệu Hoá</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>
      <Table
        locale={{
          emptyText: <Empty description="Không có dữ liệu." />,
        }}
        columns={tableColumns}
        dataSource={dataSourceTest}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default ExpertDeviceManager;
