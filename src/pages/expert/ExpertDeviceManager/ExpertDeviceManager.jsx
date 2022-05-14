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
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineInfoCircle,
  AiOutlinePlus,
  AiOutlineSetting,
} from 'react-icons/ai';
import { MdMoreHoriz } from 'react-icons/md';
import deviceAPI from '../../../api/deviceAPI';
import useFormItemHospital from '../../../components/shared/FormItemHospital/useFormItemHospital';
import useLoadingSkeleton from '../../../components/shared/LoadingSkeleton/useLoadingSkeleton';
import getListFilterHospital from '../../../utils/ListFilterHospital';
import './ExpertDeviceManager.scss';
const ExpertDeviceManager = () => {
  const [deviceSource, setDeviceSource] = useState([]);
  const [isAddEditDeviceModalVisible, setAddEditDeviceModalVisible] = useState(false);
  const [formAddEditDevice] = Form.useForm();
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsedFor, setModalUsedFor] = useState('');
  const { renderLoadingSkeleton, setIsLoadingSkeleton, isLoadingSkeleton } = useLoadingSkeleton();
  const { renderFormItemHospital } = useFormItemHospital();
  const [listFilterHospital, setListFilterHospital] = useState([]);
  const [loadingSearchButton, setLoadingSearchButton] = useState(false);
  const [selectSearchType, setSelectSearchType] = useState('name');
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
          text: 'Chờ Kích Hoạt',
          value: 'PREPARE',
        },
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
          case 'PREPARE':
            return (
              <Tag color="gray" style={{ width: '120px' }}>
                Chờ Kích Hoạt
              </Tag>
            );
          case 'INIT':
            return (
              <Tag color="green" style={{ width: '120px' }}>
                Sẵn Sàng
              </Tag>
            );
          case 'LISTENING':
            return (
              <Tag color="blue" style={{ width: '120px' }}>
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
      title: <AiOutlineSetting size={20} style={{ verticalAlign: 'middle' }} />,
      key: 'action',
      align: 'center',
      width: 60,
      render: (record) => {
        return (
          <Tooltip title="Tác Vụ">
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
          </Tooltip>
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

  useEffect(() => {
    const interval = setInterval(() => {
      getAllDevicesInterval();
    }, 10000);

    const getAllDevicesInterval = async () => {
      try {
        const deviceResult = await deviceAPI.getAllDevices();
        setDeviceSource(deviceResult);
        console.log(deviceResult);
      } catch (error) {
        console.log(error);
      }
    };

    return () => clearInterval(interval);
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
        const deviceResult = await deviceAPI.createDevice({ ...formValue, status: 'PREPARE' });
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
      id: record.id,
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

  const handleSearch = async (value) => {
    try {
      setLoadingSearchButton(true);
      const searchResult = await deviceAPI.searchDevice(
        value,
        selectSearchType !== 'all' ? `&option=${selectSearchType}` : null
      );
      setDeviceSource(searchResult);
      setLoadingSearchButton(false);
    } catch (error) {
      setLoadingSearchButton(false);
      console.log(error);
    }
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
        <div>
          <Input.Group>
            <Select
              dropdownMatchSelectWidth={false}
              onChange={(value) => setSelectSearchType(value)}
              value={selectSearchType}
              size="large"
            >
              <Select.Option value="name">Tên Thiết Bị</Select.Option>
              <Select.Option value="mac">MAC</Select.Option>
              <Select.Option value="hospital">Tên Bệnh Viện</Select.Option>
              <Select.Option value="all">Tất Cả</Select.Option>
            </Select>
            <Input.Search
              allowClear
              enterButton
              loading={loadingSearchButton}
              onSearch={handleSearch}
              placeholder="Tìm kiếm"
              style={{ width: 320 }}
              size="large"
            />
          </Input.Group>
        </div>
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
          <Form.Item name="id" noStyle>
            <Input type={'hidden'} />
          </Form.Item>
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
        </Form>
      </Modal>
      {isLoadingSkeleton ? (
        renderLoadingSkeleton
      ) : (
        <Table
          scroll={{ y: 705 }}
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
