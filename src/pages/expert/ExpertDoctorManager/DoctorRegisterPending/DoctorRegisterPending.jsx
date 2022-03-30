import { Button, Input, Modal, Space, Table, Tag, Tooltip, message } from 'antd';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineCheck } from 'react-icons/ai';
import doctorAPI from '../../../../api/doctorAPI';
import './DoctorRegisterPending.scss';
const DoctorRegisterPending = () => {
  const [doctorPendingSource, setDoctorPendingSource] = useState([]);

  const dataSourceTest = [
    {
      id: 16,
      uuid: '98a20510-e61f-42a3-9324-3bbc6b51165f',
      createdAt: '2022-03-15T00:00:00.000Z',
      updatedAt: '2022-03-15T00:00:00.000Z',
      avatar: 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png',
      cmnd: '123456789',
      dateOfBirth: '2000-01-16T07:58:29.000Z',
      email: 'test123@gmail.com',
      gender: true,
      isActive: true,
      mobile: '0975846784',
      name: 'Nguyễn Văn A',
      hospital: {
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
    },
    {
      id: 17,
      uuid: '98a20510-e61f-42a3-9324-3bbc6b51165f',
      createdAt: '2022-03-15T00:00:00.000Z',
      updatedAt: '2022-03-15T00:00:00.000Z',
      avatar: 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png',
      cmnd: '123456789',
      dateOfBirth: '2000-01-16T07:58:29.000Z',
      email: 'test123@gmail.com',
      gender: true,
      isActive: false,
      mobile: '0975846784',
      name: 'Nguyễn Văn B',
      hospital: {
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
    },
    {
      id: 17,
      uuid: '98a20510-e61f-42a3-9324-3bbc6b51165f',
      createdAt: '2022-03-15T00:00:00.000Z',
      updatedAt: '2022-03-15T00:00:00.000Z',
      avatar: 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png',
      cmnd: '123456789',
      dateOfBirth: '2000-01-16T07:58:29.000Z',
      email: 'test123@gmail.com',
      gender: true,
      isActive: false,
      mobile: '0975846784',
      name: 'Nguyễn Văn B',
      hospital: {
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
    },
    {
      id: 17,
      uuid: '98a20510-e61f-42a3-9324-3bbc6b51165f',
      createdAt: '2022-03-15T00:00:00.000Z',
      updatedAt: '2022-03-15T00:00:00.000Z',
      avatar: 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png',
      cmnd: '123456789',
      dateOfBirth: '2000-01-16T07:58:29.000Z',
      email: 'test123@gmail.com',
      gender: true,
      isActive: false,
      mobile: '0975846784',
      name: 'Nguyễn Văn B',
      hospital: {
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
    },
    {
      id: 17,
      uuid: '98a20510-e61f-42a3-9324-3bbc6b51165f',
      createdAt: '2022-03-15T00:00:00.000Z',
      updatedAt: '2022-03-15T00:00:00.000Z',
      avatar: 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png',
      cmnd: '123456789',
      dateOfBirth: '2000-01-16T07:58:29.000Z',
      email: 'test123@gmail.com',
      gender: true,
      isActive: false,
      mobile: '0975846784',
      name: 'Nguyễn Văn B',
      hospital: {
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
    },
    {
      id: 17,
      uuid: '98a20510-e61f-42a3-9324-3bbc6b51165f',
      createdAt: '2022-03-15T00:00:00.000Z',
      updatedAt: '2022-03-15T00:00:00.000Z',
      avatar: 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png',
      cmnd: '123456789',
      dateOfBirth: '2000-01-16T07:58:29.000Z',
      email: 'test123@gmail.com',
      gender: true,
      isActive: false,
      mobile: '0975846784',
      name: 'Nguyễn Văn B',
      hospital: {
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
    },
    {
      id: 17,
      uuid: '98a20510-e61f-42a3-9324-3bbc6b51165f',
      createdAt: '2022-03-15T00:00:00.000Z',
      updatedAt: '2022-03-15T00:00:00.000Z',
      avatar: 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png',
      cmnd: '123456789',
      dateOfBirth: '2000-01-16T07:58:29.000Z',
      email: 'test123@gmail.com',
      gender: true,
      isActive: false,
      mobile: '0975846784',
      name: 'Nguyễn Văn B',
      hospital: {
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
    },
    {
      id: 17,
      uuid: '98a20510-e61f-42a3-9324-3bbc6b51165f',
      createdAt: '2022-03-15T00:00:00.000Z',
      updatedAt: '2022-03-15T00:00:00.000Z',
      avatar: 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png',
      cmnd: '123456789',
      dateOfBirth: '2000-01-16T07:58:29.000Z',
      email: 'test123@gmail.com',
      gender: true,
      isActive: false,
      mobile: '0975846784',
      name: 'Nguyễn Văn B',
      hospital: {
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
    },
  ];
  const tableColumns = [
    {
      title: 'STT',
      key: 'index',
      width: 40,
      align: 'center',
      render: (text, record) => doctorPendingSource.indexOf(record) + 1,
    },
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      render: (avatar) => (
        <img
          src={
            avatar
              ? avatar
              : 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png'
          }
          style={{ width: '60px' }}
        />
      ),
    },
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Ngày Sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (dateOfBirth) => moment(dateOfBirth).format('DD/MM/YYYY'),
    },
    {
      title: 'Giới Tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => {
        if (gender) {
          return 'Nam';
        }
        return 'Nữ';
      },
    },
    {
      title: 'CMND/CCCD',
      dataIndex: 'cmnd',
      key: 'cmnd',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'mobile',
      key: 'mobile',
    },

    // {
    //   title: 'Bệnh Viện Công Tác',
    //   dataIndex: 'hospital',
    //   key: 'hospital',
    //   render: (hospital) => hospital.name,
    // },

    {
      title: 'Tác Vụ',
      key: 'action',
      align: 'center',
      render: (record) => {
        return (
          <Space>
            {/* <AiOutlineEdit
              style={{ cursor: 'pointer', verticalAlign: 'middle' }}
              size={18}
              onClick={() => {
                console.log(record);
              }}
            />
            <AiOutlineDelete
              size={18}
              style={{ color: 'red', cursor: 'pointer', verticalAlign: 'middle' }}
            /> */}
            <Tooltip title="Chấp nhận yêu cầu">
              <Button
                type="primary"
                icon={
                  <AiOutlineCheck
                    style={{
                      verticalAlign: 'middle',
                      marginBottom: '2px',
                    }}
                  />
                }
                onClick={() => handleApprovedDoctor(record)}
              />
            </Tooltip>
            <Tooltip title="Xoá yêu cầu">
              <Button
                type="primary"
                icon={
                  <AiOutlineDelete
                    style={{
                      verticalAlign: 'middle',
                      marginBottom: '2px',
                    }}
                  />
                }
                danger
                onClick={() => handleNotApprovedDoctor(record)}
              />
            </Tooltip>
          </Space>
        );
      },
    },
  ];
  const getAllPendingDoctors = async () => {
    try {
      const pendingDoctorsResult = await doctorAPI.getPendingDoctors();
      setDoctorPendingSource(pendingDoctorsResult);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllPendingDoctors();
  }, []);

  const handleNotApprovedDoctor = (record) => {
    const confirmNotApprovedDoctor = Modal.confirm({
      title: 'Xác Nhận',
      content: 'Bạn có chắc chắn muốn yêu cầu này?',
      okText: 'Xoá',
      okType: 'primary',
      okButtonProps: {
        danger: true,
      },
      cancelText: 'Huỷ',
      onOk() {
        console.log('delete', record.id);
      },
      onCancel() {
        confirmNotApprovedDoctor.destroy();
      },
    });
  };

  const handleApprovedDoctor = (record) => {
    const confirmNotApprovedDoctor = Modal.confirm({
      title: 'Xác Nhận',
      content: 'Bạn có chắc chắn muốn đồng ý yêu cầu này?',
      okText: 'Đồng Ý',
      okType: 'primary',
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await doctorAPI.approvePendingDoctor(record.id);
          confirmNotApprovedDoctor.destroy();
          message.success('Thao tác thành công.', 5);
          getAllPendingDoctors();
        } catch (error) {
          message.error('Thao tác thất bại.', 5);
        }
      },
      onCancel() {
        confirmNotApprovedDoctor.destroy();
      },
    });
  };

  return (
    <div className="doctor-pending-container">
      <div className="tool-container">
        <Input.Search
          placeholder="Tìm kiếm"
          style={{ width: 320, marginLeft: 'auto' }}
          size="large"
        />
      </div>
      <Table
        columns={tableColumns}
        dataSource={doctorPendingSource}
        pagination={{ pageSize: 10 }}
      />
    </div>
  );
};

export default DoctorRegisterPending;
