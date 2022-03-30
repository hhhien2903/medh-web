import { Button, Dropdown, Form, Input, Menu, Modal, Table } from 'antd';
import React, { useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus } from 'react-icons/ai';
import { MdMoreHoriz } from 'react-icons/md';
import addressAPI from '../../../api/addressAPI';
import doctorAPI from '../../../api/doctorAPI';
import useFormItemAddress from '../../../components/shared/FormItemAddress/useFormItemAddress';
import { vietnameseNameRegex } from '../../../utils/regex';
import './ExpertHospitalManager.scss';

const ExpertHospitalManager = () => {
  const [doctorDataSource, setDoctorDataSource] = useState([]);
  const [isAddEditHospitalModalVisible, setAddEditHospitalModalVisible] = useState(false);
  const [isConfirmLoadingAddDoctorModal, setIsConfirmLoadingAddDoctorModal] = useState(false);
  const [formAddEditHospital] = Form.useForm();
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsedFor, setModalUsedFor] = useState('');
  const {
    renderFormItemAddress,
    setCitySource,
    setDistrictSource,
    setIsDisableDistrict,
    setIsDisableWard,
    setWardSource,
  } = useFormItemAddress(formAddEditHospital);
  const dataSourceTest = [
    {
      id: 1,
      uuid: '1f5b8b1b-fce7-477a-a1f3-d4aeca502611',
      createdAt: '2022-03-13T00:00:00.000Z',
      updatedAt: '2022-03-13T00:00:00.000Z',
      address: '215 Hồng Bàng',
      cityId: 79,
      districtId: 774,
      image: null,
      name: 'Bệnh Viện Đại Học Y Dược TP HCM',
      status: true,
      wardId: 137,
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
      render: (text, record) => dataSourceTest.indexOf(record) + 1,
    },
    {
      title: 'Tên Bệnh Viện',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Địa Chỉ',
      dataIndex: 'address',
      key: 'address',
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
                  onClick={() => handleVisibleEditHospital(record)}
                >
                  Sửa thông tin
                </Menu.Item>
                <Menu.Item
                  key="2"
                  icon={<AiOutlineDelete size={15} color="#FF4D4F" />}
                  style={{ color: '#FF4D4F' }}
                  onClick={() => handleDeleteHospital(record)}
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

  const handleDeleteHospital = (record) => {
    const confirmDeleteHospital = Modal.confirm({
      title: 'Xác Nhận',
      content: 'Bạn có chắc chắn muốn xoá?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk() {
        console.log('delete', record.id);
      },
      onCancel() {
        confirmDeleteHospital.destroy();
      },
    });
  };

  const handleEditDisease = () => {
    formAddEditHospital.validateFields().then((formValue) => {
      console.log(formValue);
    });
  };
  const handleAddDisease = () => {};

  const handleVisibleAddHospital = async () => {
    setAddEditHospitalModalVisible(true);
    setModalUsedFor('addHospital');
    setModalTitle('Thêm Bệnh Viện');
    try {
      const citySourceResult = await addressAPI.getCity();
      setCitySource(citySourceResult);
    } catch (error) {
      console.log(error);
    }
  };

  const handleVisibleEditHospital = (record) => {
    setAddEditHospitalModalVisible(true);
    setModalUsedFor('editHospital');
    setModalTitle('Sửa Bệnh Viện');
    console.log(record);
    formAddEditHospital.setFieldsValue({
      name: record.name,
      description: record.description,
      // gender: record.gender,
      // dateOfBirth: moment(record.dateOfBirth),
      // mobile: record.mobile,
      // isActive: record.isActive,
      // hospital: record.hospital.name,
      // email: record.email,
    });
  };

  const handleCancelHospitalModal = () => {
    setAddEditHospitalModalVisible(false);
    formAddEditHospital.resetFields();
    setIsDisableDistrict(true);
    setIsDisableWard(true);
  };

  return (
    <div className="hospital-manager-container">
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
          onClick={handleVisibleAddHospital}
        >
          Thêm Bệnh Viện
        </Button>

        <Input.Search placeholder="Tìm kiếm" style={{ width: 320 }} size="large" />
      </div>
      <Modal
        title={modalTitle}
        visible={isAddEditHospitalModalVisible}
        okText="Xác Nhận"
        cancelText="Huỷ"
        confirmLoading={isConfirmLoadingAddDoctorModal}
        className="add-edit-hospital-modal-container"
        onCancel={handleCancelHospitalModal}
        // bodyStyle={{ overflowY: 'scroll' }}
        onOk={() => {
          if (modalUsedFor === 'addHospital') {
            return handleVisibleAddHospital();
          } else {
            return handleVisibleEditHospital();
          }
        }}
      >
        <Form layout="vertical" className="add-edit-hospital-form" form={formAddEditHospital}>
          <Form.Item
            name="name"
            label="Tên Bệnh Viện:"
            rules={[
              {
                required: true,
                message: 'Tên Bệnh Viện không được để trống!',
              },
              {
                pattern: vietnameseNameRegex,
                message: 'Tên Bệnh Viện không đúng định dạng',
              },
            ]}
          >
            <Input placeholder="Tên Bệnh Viện" />
          </Form.Item>
          {renderFormItemAddress}
        </Form>
      </Modal>
      <Table columns={tableColumns} dataSource={dataSourceTest} pagination={{ pageSize: 10 }} />
    </div>
  );
};

export default ExpertHospitalManager;
