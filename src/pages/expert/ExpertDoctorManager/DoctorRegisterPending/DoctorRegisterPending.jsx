import { Avatar, Button, Empty, Input, message, Modal, Space, Table, Tooltip } from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { AiOutlineCheck, AiOutlineDelete } from 'react-icons/ai';
import doctorAPI from '../../../../api/doctorAPI';
import useLoadingSkeleton from '../../../../components/shared/LoadingSkeleton/useLoadingSkeleton';
import './DoctorRegisterPending.scss';
const DoctorRegisterPending = () => {
  const [doctorPendingSource, setDoctorPendingSource] = useState([]);
  const { renderLoadingSkeleton, setIsLoadingSkeleton, isLoadingSkeleton } = useLoadingSkeleton();

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
      align: 'center',
      render: (_text, record) => (
        <Avatar src={record?.avatar} size={50}>
          {record.name.substring(0, 1)}
        </Avatar>
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

    {
      title: 'Bệnh Viện Công Tác',
      dataIndex: 'hospital',
      key: 'hospital',
      render: (hospital) => hospital.name,
    },

    {
      title: 'Tác Vụ',
      key: 'action',
      align: 'center',
      render: (record) => {
        return (
          <Space>
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
      setIsLoadingSkeleton(true);
      const pendingDoctorsResult = await doctorAPI.getPendingDoctors();
      setDoctorPendingSource(pendingDoctorsResult);
      setIsLoadingSkeleton(false);
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
      {isLoadingSkeleton ? (
        renderLoadingSkeleton
      ) : (
        <Table
          locale={{
            emptyText: <Empty description="Không có dữ liệu." />,
          }}
          columns={tableColumns}
          dataSource={doctorPendingSource}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default DoctorRegisterPending;
