import {
  Button,
  Dropdown,
  Empty,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Skeleton,
  Table,
  Tooltip,
} from 'antd';
import React, { useState, useEffect } from 'react';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineSetting } from 'react-icons/ai';
import { MdMoreHoriz } from 'react-icons/md';
import addressAPI from '../../../api/addressAPI';
import hospitalAPI from '../../../api/hospitalAPI';
import useFormItemAddress from '../../../components/shared/FormItemAddress/useFormItemAddress';
import useLoadingSkeleton from '../../../components/shared/LoadingSkeleton/useLoadingSkeleton';
import { vietnameseNameRegex } from '../../../utils/regex';
import './ExpertHospitalManager.scss';

const ExpertHospitalManager = () => {
  const [hospitalSource, setHospitalSource] = useState([]);
  const [isAddEditHospitalModalVisible, setAddEditHospitalModalVisible] = useState(false);
  const [formAddEditHospital] = Form.useForm();
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsedFor, setModalUsedFor] = useState('');
  const { renderLoadingSkeleton, setIsLoadingSkeleton, isLoadingSkeleton } = useLoadingSkeleton();
  const [isLoadingSkeletonForm, setIsLoadingSkeletonForm] = useState(false);
  const {
    renderFormItemAddress,
    setCitySource,
    setIsDisableDistrict,
    setIsDisableWard,
    onCitySelect,
    onDistrictSelect,
  } = useFormItemAddress(formAddEditHospital);
  const [loadingSearchButton, setLoadingSearchButton] = useState(false);

  const tableColumns = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    // },
    {
      title: 'STT',
      key: 'index',
      width: '5%',
      align: 'center',
      render: (text, record) => hospitalSource.indexOf(record) + 1,
    },
    {
      title: 'Tên Bệnh Viện',
      dataIndex: 'name',
      key: 'name',
      width: '35%',
    },
    {
      title: 'Địa Chỉ',
      dataIndex: 'address',
      key: 'address',
      width: '55%',
      // render: (name) => <Link to="/expert/patient/123">{name}</Link>,
    },
    {
      title: <AiOutlineSetting size={20} style={{ verticalAlign: 'middle' }} />,
      key: 'action',
      align: 'center',
      width: '5%',
      render: (record) => {
        return (
          <Tooltip title="Tác Vụ">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="1"
                    icon={<AiOutlineEdit size={15} />}
                    // style={{ color: '#1890FF' }}
                    onClick={() => handleVisibleEditHospital(record)}
                  >
                    Sửa thông tin
                  </Menu.Item>
                  <Menu.Item
                    key="2"
                    danger
                    icon={<AiOutlineDelete size={15} />}
                    // style={{ color: '#FF4D4F' }}
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
            ks
          </Tooltip>
        );
      },
    },
  ];
  const getAllHospital = async () => {
    try {
      setIsLoadingSkeleton(true);
      const hospitalSourceResult = await hospitalAPI.getAllHospital();
      setHospitalSource(hospitalSourceResult);
      setIsLoadingSkeleton(false);
      console.log(hospitalSourceResult);
    } catch (error) {
      setIsLoadingSkeleton(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAllHospital();
  }, []);

  const handleDeleteHospital = (record) => {
    const confirmDeleteHospital = Modal.confirm({
      title: 'Xác Nhận',
      content: 'Bạn có chắc chắn muốn xoá?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await hospitalAPI.deleteHospital(record.id);
          confirmDeleteHospital.destroy();
          message.success('Xoá thành công', 5);
          getAllHospital();
        } catch (error) {
          console.log(error);
          message.success('Xoá không thành công', 5);
        }
      },
      onCancel() {
        confirmDeleteHospital.destroy();
      },
    });
  };

  const handleEditDisease = () => {
    formAddEditHospital.validateFields().then((formValue) => {
      const confirmUpdateHospitalModal = Modal.confirm({
        title: 'Xác Nhận',
        content: 'Bạn có chắc chắn với các thông tin đã nhập?',
        okText: 'Xác Nhận',
        cancelText: 'Không',
        onOk: async () => {
          try {
            await hospitalAPI.updateHospital({ ...formValue, status: true });
            message.success('Sửa Bệnh Viện Thành Công.', 5);
            getAllHospital();
            handleCancelHospitalModal();
          } catch (error) {
            console.log(error);
            message.error('Sửa Bệnh Viện Không Thành Công.', 5);
          }
        },
        onCancel() {
          confirmUpdateHospitalModal.destroy();
        },
      });
    });
  };
  const handleAddHospital = () => {
    formAddEditHospital.validateFields().then(async (formValue) => {
      try {
        await hospitalAPI.createHospital({ ...formValue, status: true });
        message.success('Tạo Bệnh Viện thành công.', 5);
        getAllHospital();
        handleCancelHospitalModal();
      } catch (error) {
        console.log(error);
        message.error('Tạo Bệnh Viện không thành công.', 5);
      }
    });
  };

  const handleVisibleAddHospital = async () => {
    setAddEditHospitalModalVisible(true);
    setModalUsedFor('addHospital');
    setModalTitle('Thêm Bệnh Viện');
  };

  const handleVisibleEditHospital = async (record) => {
    setAddEditHospitalModalVisible(true);
    setModalUsedFor('editHospital');
    setModalTitle('Sửa Thông Tin Bệnh Viện');
    setIsLoadingSkeletonForm(true);
    await onCitySelect(record.cityId);
    await onDistrictSelect(record.districtId);
    setIsLoadingSkeletonForm(false);
    formAddEditHospital.setFieldsValue({
      id: record.id,
      name: record.name,
      cityId: record.cityId,
      wardId: record.wardId,
      districtId: record.districtId,
      address: record.address.split(',')[0],
      status: record.status,
    });
  };

  const handleCancelHospitalModal = () => {
    setAddEditHospitalModalVisible(false);
    formAddEditHospital.resetFields();
    setIsDisableDistrict(true);
    setIsDisableWard(true);
  };

  const handleSearch = async (value) => {
    try {
      setLoadingSearchButton(true);
      const searchResult = await hospitalAPI.searchHospital(value);
      setHospitalSource(searchResult);
      setLoadingSearchButton(false);
    } catch (error) {
      setLoadingSearchButton(false);
      console.log(error);
    }
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

        <Input.Search
          allowClear
          enterButton
          loading={loadingSearchButton}
          onSearch={handleSearch}
          placeholder="Tìm kiếm"
          style={{ width: 320 }}
          size="large"
        />
      </div>
      <Modal
        title={modalTitle}
        visible={isAddEditHospitalModalVisible}
        okText="Xác Nhận"
        cancelText="Huỷ"
        className="add-edit-hospital-modal-container"
        onCancel={handleCancelHospitalModal}
        // bodyStyle={{ overflowY: 'scroll' }}
        onOk={() => {
          if (modalUsedFor === 'addHospital') {
            return handleAddHospital();
          } else {
            return handleEditDisease();
          }
        }}
      >
        {isLoadingSkeletonForm ? (
          <Skeleton active loading={isLoadingSkeletonForm} />
        ) : (
          <Form layout="vertical" className="add-edit-hospital-form" form={formAddEditHospital}>
            <Form.Item name="id" noStyle>
              <Input type="hidden"></Input>
            </Form.Item>
            <Form.Item
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
            </Form.Item>
            {renderFormItemAddress}
          </Form>
        )}
      </Modal>
      {isLoadingSkeleton ? (
        renderLoadingSkeleton
      ) : (
        <Table
          scroll={{ y: 705 }}
          locale={{
            emptyText: <Empty description="Không có dữ liệu." />,
          }}
          columns={tableColumns}
          dataSource={hospitalSource}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default ExpertHospitalManager;
