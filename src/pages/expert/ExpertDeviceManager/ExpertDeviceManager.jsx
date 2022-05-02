import { Button, Dropdown, Empty, Form, Input, Menu, message, Modal, Table, Tag } from 'antd';
import React, { useEffect, useState } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlineInfoCircle, AiOutlinePlus } from 'react-icons/ai';
import { MdMoreHoriz } from 'react-icons/md';
import deviceAPI from '../../../api/deviceAPI';
import hospitalAPI from '../../../api/hospitalAPI';
import useFormItemDisease from '../../../components/shared/FormItemDisease/useFormItemDisease';
import useFormItemHospital from '../../../components/shared/FormItemHospital/useFormItemHospital';
import useFormItemPatient from '../../../components/shared/FormItemPatient/useFormItemPatient';
import useLoadingSkeleton from '../../../components/shared/LoadingSkeleton/useLoadingSkeleton';
import { vietnameseNameRegex } from '../../../utils/regex';
import './ExpertDeviceManager.scss';
import getListFilterHospital from '../../../utils/ListFilterHospital';
const ExpertDeviceManager = () => {
  const [deviceSource, setDeviceSource] = useState([]);
  const [isAddEditDeviceModalVisible, setAddEditDeviceModalVisible] = useState(false);
  const [formAddEditDevice] = Form.useForm();
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsedFor, setModalUsedFor] = useState('');
  const { renderLoadingSkeleton, setIsLoadingSkeleton, isLoadingSkeleton } = useLoadingSkeleton();
  const { renderFormItemHospital } = useFormItemHospital();
  const [listFilterHospital, setListFilterHospital] = useState([]);

  const tableColumns = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    // },
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      className: 'index-row',
      render: (text, record) => deviceSource.indexOf(record) + 1,
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
      dataIndex: 'macAddress',
      key: 'macAddress',
    },
    {
      title: 'Nhiệt Độ',
      dataIndex: 'temp',
      key: 'temp',
      render: (text, record) => {
        if (!record.temp) return 'Đang Cập Nhật';
        else return record.temp;
      },
    },
    {
      title: 'Thuộc Bệnh Viện',
      key: 'hospitalId',
      filters: listFilterHospital,
      onFilter: (value, record) => record.hospital.id === value,
      render: (text, record) => record.hospital?.name,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      filters: [
        {
          text: 'Sẵn Sàng',
          value: 'INIT',
        },
        {
          text: 'Đang Theo Dõi',
          value: 'LISTENING',
        },
        {
          text: 'Sốt',
          value: 'FEVER',
        },
        {
          text: 'Khẩn Cấp',
          value: 'EMERGENCY',
        },
        {
          text: 'Đang Hồi Phục',
          value: 'RECOVERY',
        },
        {
          text: 'Hư Hỏng',
          value: 'INCUBATION',
        },
      ],
      onFilter: (value, record) => record.status === value,
      render: (status) => {
        switch (status) {
          case 'INIT':
            return (
              <Tag color="green" style={{ width: '120px' }}>
                Sẵn Sàng
              </Tag>
            );
          case 'LISTENING':
            return (
              <Tag color="gray" style={{ width: '120px' }}>
                Đang Theo Dõi
              </Tag>
            );
          case 'FEVER':
            return (
              <Tag color="orange" style={{ width: '120px' }}>
                Sốt
              </Tag>
            );
          case 'EMERGENCY':
            return (
              <Tag color="red" style={{ width: '120px' }}>
                Khẩn Cấp
              </Tag>
            );
          case 'RECOVERY':
            return (
              <Tag color="yellow" style={{ width: '120px' }}>
                Đang Hồi Phục
              </Tag>
            );
          case 'INCUBATION':
            return (
              <Tag color="black" style={{ width: '120px' }}>
                Hư Hỏng
              </Tag>
            );
          default:
            break;
        }
      },
    },

    {
      title: 'Tác Vụ',
      key: 'action',
      align: 'center',
      width: 90,
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
  const getAllDevices = async () => {
    try {
      setIsLoadingSkeleton(true);
      const deviceResult = await deviceAPI.getAllDevices();
      setDeviceSource(deviceResult);
      setIsLoadingSkeleton(false);
      console.log(deviceResult);
    } catch (error) {
      setIsLoadingSkeleton(false);
      console.log(error);
    }
  };
  useEffect(() => {
    getAllDevices();
    getListFilterHospital().then((listFilterHospital) => setListFilterHospital(listFilterHospital));
  }, []);

  const handleDeleteDevice = (record) => {
    const confirmDeleteDevice = Modal.confirm({
      title: 'Xác Nhận',
      content: 'Bạn có chắc chắn muốn xoá?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await deviceAPI.deleteDevice(record.id);
          confirmDeleteDevice.destroy();
          message.success('Xoá thành công', 5);
          getAllDevices();
        } catch (error) {
          console.log(error);
          message.success('Xoá không thành công', 5);
        }
      },
      onCancel() {
        confirmDeleteDevice.destroy();
      },
    });
  };

  const handleEditDevice = () => {
    formAddEditDevice.validateFields().then((formValue) => {
      const confirmUpdateDeviceModal = Modal.confirm({
        title: 'Xác Nhận',
        content: 'Bạn có chắc chắn với các thông tin đã nhập?',
        okText: 'Xác Nhận',
        cancelText: 'Không',
        onOk: async () => {
          try {
            await deviceAPI.updateDevice(formValue);
            await deviceAPI.moveDeviceToHospital(formValue.id, formValue.hospitalId);
            message.success('Sửa Thiết Bị Thành Công.', 5);
            getAllDevices();
            handleCancelDeviceModal();
          } catch (error) {
            console.log(error);
            message.error('Sửa Thiết Bị Không Thành Công.', 5);
          }
        },
        onCancel() {
          confirmUpdateDeviceModal.destroy();
        },
      });
    });
  };

  const handleAddDevice = () => {
    formAddEditDevice.validateFields().then(async (formValue) => {
      try {
        const deviceResult = await deviceAPI.createDevice({ ...formValue, status: 'INIT' });
        await deviceAPI.moveDeviceToHospital(deviceResult.id, formValue.hospitalId);
        message.success('Tạo Thiết Bị thành công.', 5);
        getAllDevices();
        handleCancelDeviceModal();
      } catch (error) {
        console.log(error);
        message.error('Tạo Thiết Bị không thành công.', 5);
      }
    });
  };

  const handleVisibleAddDevice = () => {
    setAddEditDeviceModalVisible(true);
    setModalUsedFor('addDevice');
    setModalTitle('Thêm Thiết Bị');
  };

  const handleVisibleEditDevice = (record) => {
    setAddEditDeviceModalVisible(true);
    setModalUsedFor('editDevice');
    setModalTitle('Sửa Thiết Bị');
    formAddEditDevice.setFieldsValue({
      name: record.name,
      description: record.description,
      macAddress: record.macAddress,
      hospitalId: record.hospital?.id,
    });
  };

  const handleCancelDeviceModal = () => {
    setAddEditDeviceModalVisible(false);
    formAddEditDevice.resetFields();
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
        className="add-device-modal-container"
        onCancel={handleCancelDeviceModal}
        // bodyStyle={{ overflowY: 'scroll' }}
        onOk={() => {
          if (modalUsedFor === 'addDevice') {
            return handleAddDevice();
          } else {
            return handleEditDevice();
          }
        }}
      >
        <Form layout="vertical" className="add-device-form" form={formAddEditDevice}>
          <Form.Item
            name="name"
            label="Tên Thiết Bị:"
            rules={[
              {
                required: true,
                message: 'Tên thiết bị không được để trống!',
              },
              // {
              //   pattern: vietnameseNameRegex,
              //   message: 'Tên thiết bị không đúng định dạng',
              // },
            ]}
          >
            <Input placeholder="Tên Thiết Bị" />
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
            name="macAddress"
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
          {renderFormItemHospital}
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
          {/* {renderFormItemPatient}
          {renderFormItemDisease} */}
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

          {/* <Form.Item
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
          </Form.Item> */}
        </Form>
      </Modal>
      {isLoadingSkeleton ? (
        renderLoadingSkeleton
      ) : (
        <Table
          scroll={{ y: 475 }}
          locale={{
            filterReset: 'Đặt lại',
            emptyText: <Empty description="Không có dữ liệu." />,
          }}
          columns={tableColumns}
          dataSource={deviceSource}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default ExpertDeviceManager;
