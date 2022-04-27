import React, { useEffect, useState } from 'react';
import doctorAPI from '../../../../api/doctorAPI';
import {
  Button,
  DatePicker,
  Form,
  Input,
  Modal,
  Table,
  Tag,
  Select,
  Avatar,
  Tooltip,
  Upload,
  Dropdown,
  Menu,
  Descriptions,
  message,
  Empty,
} from 'antd';
import moment from 'moment';
import { AiOutlineDelete, AiOutlineEdit, AiOutlinePlus, AiOutlineInfoCircle } from 'react-icons/ai';
import { MdMoreHoriz } from 'react-icons/md';
import './DoctorManager.scss';
import { emailRegex, phoneNumberRegex, vietnameseNameRegex } from '../../../../utils/regex';
import localeVN from 'antd/es/date-picker/locale/vi_VN';
import ImgCrop from 'antd-img-crop';
import { AiFillCamera, AiOutlineUser } from 'react-icons/ai';
import useFormItemHospital from '../../../../components/shared/FormItemHospital/useFormItemHospital';
import useLoadingSkeleton from '../../../../components/shared/LoadingSkeleton/useLoadingSkeleton';

const DoctorManager = () => {
  const [doctorSource, setDoctorSource] = useState([]);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isAddDoctorModalVisible, setIsAddDoctorModalVisible] = useState(false);
  const [formAddEditDoctor] = Form.useForm();
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsedFor, setModalUsedFor] = useState('');
  const [doctorDetail, setDoctorDetail] = useState({});
  const { renderFormItemHospital } = useFormItemHospital();
  const { renderLoadingSkeleton, setIsLoadingSkeleton, isLoadingSkeleton } = useLoadingSkeleton();
  const [avatarUploadPreview, setAvatarUploadPreview] = useState(null);
  const [avatarUploadSource, setAvatarUploadSource] = useState(null);
  const [avatarSource, setAvatarSource] = useState(null);

  const tableColumns = [
    {
      title: 'STT',
      key: 'index',
      width: 40,
      align: 'center',
      className: 'index-row',
      render: (text, record) => doctorSource.indexOf(record) + 1,
    },
    {
      title: 'Ảnh',
      dataIndex: 'avatar',
      align: 'center',
      width: 80,
      key: 'avatar',
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
      width: 155,
      // render: (name) => <Link to="/expert/patient/123">{name}</Link>,
    },
    // {
    //   title: 'Ngày Sinh',
    //   dataIndex: 'dateOfBirth',
    //   key: 'dateOfBirth',
    //   width: 120,
    //   render: (dateOfBirth) => moment(dateOfBirth).format('DD/MM/YYYY'),
    // },
    // {
    //   title: 'Giới Tính',
    //   dataIndex: 'gender',
    //   key: 'gender',
    //   width: 100,
    //   render: (gender) => {
    //     if (gender) {
    //       return 'Nam';
    //     }
    //     return 'Nữ';
    //   },
    // },
    {
      title: 'CMND',
      dataIndex: 'cmnd',
      key: 'cmnd',
      width: 80,
    },
    // {
    //   title: 'Email',
    //   dataIndex: 'email',
    //   key: 'email',
    //   width: 200,
    // },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 110,
    },

    {
      title: 'Bệnh Viện Công Tác',
      dataIndex: 'hospital',
      key: 'hospital',
      width: 250,
      render: (_text, record) => record.hospital.name,
    },
    {
      title: 'Trạng Thái',
      dataIndex: 'isDisabled',
      key: 'isDisabled',
      width: 100,
      align: 'center',
      // fixed: 'right',
      render: (isDisabled) => {
        if (isDisabled) {
          return <Tag color="volcano">Vô Hiệu Hoá</Tag>;
        }
        return <Tag color="green">Đang Hoạt Động</Tag>;
      },
    },
    {
      title: 'Tác Vụ',
      key: 'action',
      align: 'center',
      width: 60,
      fixed: 'right',
      render: (record) => {
        return (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="1"
                  icon={<AiOutlineEdit size={15} color="#1890FF" />}
                  style={{ color: '#1890FF' }}
                  onClick={() => handleVisibleEditDoctor(record)}
                >
                  Sửa thông tin
                </Menu.Item>
                {/* <Menu.Item
                  key="2"
                  icon={<AiOutlineDelete size={15} color="#FF4D4F" />}
                  style={{ color: '#FF4D4F' }}
                  onClick={() => handleDeleteDoctor(record)}
                >
                  Xoá
                </Menu.Item> */}
                <Menu.Item
                  key="3"
                  icon={<AiOutlineInfoCircle size={15} />}
                  onClick={() => handleVisibleDetailDoctor(record)}
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
      setIsLoadingSkeleton(true);
      const doctorSourceResult = await doctorAPI.getAllDoctors();
      setDoctorSource(doctorSourceResult.filter((doctor) => doctor.isActive));
      setIsLoadingSkeleton(false);
    } catch (error) {
      setIsLoadingSkeleton(true);
      console.log(error);
    }
  };

  useEffect(() => {
    getAllDoctors();
  }, []);

  const handleDeleteDoctor = (record) => {
    const confirmDeleteDoctor = Modal.confirm({
      title: 'Xác Nhận',
      content: 'Bạn có chắc chắn muốn xoá?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk() {
        console.log('delete', record.id);
      },
      onCancel() {
        confirmDeleteDoctor.destroy();
      },
    });
  };

  const handleEditDoctor = () => {
    formAddEditDoctor.validateFields().then(async (formValue) => {
      const confirmUpdateInfoModal = Modal.confirm({
        title: 'Xác Nhận',
        content: 'Bạn có chắc chắn với các thông tin đã nhập?',
        okText: 'Xác Nhận',
        cancelText: 'Không',
        onOk: async () => {
          try {
            const sendData = {
              name: formValue.name,
              cmnd: formValue.cmnd,
              dateOfBirth: moment(formValue.dateOfBirth).toISOString(),
              gender: formValue.gender,
              mobile: formValue.mobile,
              email: formValue.email,
              hospitalId: formValue.hospitalId,
              id: formValue.id,
            };
            delete sendData['avatar'];
            if (avatarUploadSource) {
              const uploadAvatarForm = new FormData();
              uploadAvatarForm.append('file', avatarUploadSource);
              await doctorAPI.uploadAvatar(formValue.id, uploadAvatarForm);
            }
            await doctorAPI.updateDoctor(sendData);
            await doctorAPI.activeDoctor(formValue.id);
            if (formValue.isDisabled) {
              await doctorAPI.disableDoctor(formValue.id);
            }
            message.success('Sửa Bác Sĩ thành công.', 5);
            getAllDoctors();
            handleCancelAddDoctor();
          } catch (error) {
            console.log(error);
            message.error('Sửa Bác Sĩ không thành công.', 5);
          }
        },
        onCancel() {
          confirmUpdateInfoModal.destroy();
        },
      });
    });
  };
  const handleAddDoctor = () => {
    formAddEditDoctor.validateFields().then(async (formValue) => {
      try {
        const sendData = {
          name: formValue.name,
          cmnd: formValue.cmnd,
          dateOfBirth: moment(formAddEditDoctor).toISOString(),
          gender: formValue.gender,
          mobile: formValue.mobile,
          email: formValue.email,
          hospitalId: formValue.hospitalId,
        };
        const createDoctorResult = await doctorAPI.createDoctor(sendData);
        await doctorAPI.activeDoctor(createDoctorResult.id);
        if (formValue.isDisabled) {
          await doctorAPI.disableDoctor(createDoctorResult.id);
        }
        message.success('Tạo Bác Sĩ thành công.', 5);
        getAllDoctors();
        handleCancelAddDoctor();
      } catch (error) {
        console.log(error);
        message.error('Tạo Bác Sĩ không thành công.', 5);
      }
    });
  };

  const handleVisibleAddDoctor = () => {
    setIsAddDoctorModalVisible(true);
    setModalUsedFor('addDoctor');
    setModalTitle('Thêm Bác Sĩ');

    formAddEditDoctor.setFieldsValue({ isDisabled: false });
  };

  const handleVisibleEditDoctor = (record) => {
    setIsAddDoctorModalVisible(true);
    setModalUsedFor('editDoctor');
    setModalTitle('Sửa Bác Sĩ');
    formAddEditDoctor.setFieldsValue({
      id: record.id,
      name: record.name,
      gender: record.gender,
      dateOfBirth: moment(record.dateOfBirth),
      mobile: record.mobile,
      isDisabled: record.isDisabled,
      hospitalId: record.hospital.id,
      email: record.email,
      cmnd: record.cmnd,
    });
    setAvatarUploadPreview(null);
    setAvatarUploadSource(null);
    setAvatarSource(record.avatar);
  };

  const handleVisibleDetailDoctor = (record) => {
    setIsDetailModalVisible(true);
    setDoctorDetail({
      id: record.id,
      name: record.name,
      gender: record.gender ? 'Nam' : 'Nữ',
      dateOfBirth: moment(record.dateOfBirth).format('DD/MM/YYYY'),
      mobile: record.mobile,
      isDisabled: record.isDisabled ? 'Vô Hiệu Hoá' : 'Đang Hoạt Động',
      hospital: record.hospital.name,
      email: record.email,
      cmnd: record.cmnd,
    });

    setAvatarSource(record.avatar);
  };

  const handleCancelAddDoctor = () => {
    setIsAddDoctorModalVisible(false);
    formAddEditDoctor.resetFields();
    setAvatarUploadPreview(null);
    setAvatarUploadSource(null);
    setAvatarSource(null);
  };
  const handleUploadAvatar = async (fileUpload) => {
    const { file } = fileUpload;
    let src = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
    });
    setAvatarUploadPreview(src);
    setAvatarUploadSource(file);
  };
  const checkFileIsImage = {
    beforeCrop: (file) => {
      if (!file['type'].includes('image')) {
        message.error(`${file.name} Không phải là tệp hình ảnh.`);
        return false;
      }
      if (file.size > 1048576) {
        message.error(`${file.name} vượt quá dung lượng cho phép.`);
        return false;
      }
      return true;
    },
  };

  return (
    <div className="doctor-manager-container">
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
          onClick={handleVisibleAddDoctor}
        >
          Thêm Bác Sĩ
        </Button>

        <Input.Search placeholder="Tìm kiếm" style={{ width: 320 }} size="large" />
      </div>
      <Modal
        title={modalTitle}
        visible={isAddDoctorModalVisible}
        okText="Xác Nhận"
        cancelText="Huỷ"
        className="add-doctor-modal-container"
        onCancel={handleCancelAddDoctor}
        bodyStyle={{ overflowY: 'auto', height: 600 }}
        onOk={() => {
          if (modalUsedFor === 'addDoctor') {
            return handleAddDoctor();
          } else {
            return handleEditDoctor();
          }
        }}
      >
        <div className="avatar-container-profile">
          <div className="upload-avatar">
            {!avatarUploadPreview ? (
              <Avatar size={100} src={avatarSource} icon={<AiOutlineUser />}></Avatar>
            ) : (
              <Avatar size={100} src={avatarUploadPreview} icon={<AiOutlineUser />}></Avatar>
            )}
            <div className="btn-upload-avatar">
              <Tooltip title="Tải ảnh lên">
                <ImgCrop
                  {...checkFileIsImage}
                  rotate
                  modalTitle="Chỉnh sửa ảnh"
                  modalOk="Xác Nhận"
                  modalCancel="Huỷ"
                >
                  <Upload previewFile={false} customRequest={handleUploadAvatar} progress={false}>
                    {<AiFillCamera style={{ position: 'absolute', top: '3px', right: '4px' }} />}
                  </Upload>
                </ImgCrop>
              </Tooltip>
            </div>
          </div>
        </div>

        <Form layout="vertical" className="add-doctor-form" form={formAddEditDoctor}>
          <Form.Item name="id" noStyle>
            <Input type="hidden" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Họ Và Tên:"
            rules={[
              {
                required: true,
                message: 'Họ Và Tên không được để trống!',
              },
              {
                pattern: vietnameseNameRegex,
                message: 'Họ Và Tên không đúng định dạng',
              },
            ]}
          >
            <Input placeholder="Họ Và Tên" />
          </Form.Item>
          <Form.Item
            name="dateOfBirth"
            label="Ngày Sinh:"
            rules={[
              {
                required: true,
                message: 'Ngày sinh không được để trống!',
              },
            ]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <DatePicker
              disabledDate={(current) => current > moment().subtract(18, 'year').endOf('year')}
              defaultPickerValue={moment().subtract(18, 'year')}
              placeholder="Vui lòng chọn ngày sinh"
              style={{ width: '100%' }}
              locale={localeVN}
              format={'DD/MM/YYYY'}
            />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Giới Tính:"
            rules={[
              {
                required: true,
                message: 'Giới tính không được để trống!',
              },
            ]}
            style={{ display: 'inline-block', width: '50%', marginLeft: '8px' }}
          >
            <Select placeholder="Vui lòng chọn giới tính">
              <Select.Option value={true}>Nam</Select.Option>
              <Select.Option value={false}>Nữ</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="cmnd"
            label="CMND / CCCD:"
            rules={[
              {
                required: true,
                message: 'CMND không được để trống!',
              },
            ]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Input placeholder="CMND" />
          </Form.Item>
          <Form.Item
            name="mobile"
            label="Số Điện Thoại:"
            rules={[
              {
                required: true,
                message: 'Số điện thoại không được để trống!',
              },
              {
                required: true,
                pattern: phoneNumberRegex,
                message: 'Số điện thoại không đúng định dạng',
              },
            ]}
            style={{ display: 'inline-block', width: '50%', marginLeft: '8px' }}
          >
            <Input placeholder="Số Điện Thoại" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email:"
            rules={[
              {
                required: true,
                message: 'Email không được để trống!',
              },
              {
                pattern: emailRegex,
                message: 'Email không đúng định dạng',
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          {/* <Form.Item
            name="hospital"
            label="Bệnh Viện Công Tác:"
            rules={[
              {
                required: true,
                message: 'Bệnh Viện Công Tác không được để trống!',
              },
            ]}
          >
            <Select placeholder="Vui lòng chọn Bệnh Viện Công Tác">
              <Select.Option value={1}>Bệnh Viện Đại Học Y Dược</Select.Option>
              <Select.Option value={2}>Bệnh Viện Quân Y</Select.Option>
            </Select>
          </Form.Item> */}

          {renderFormItemHospital}
          <Form.Item
            name="isDisabled"
            label="Trạng Thái Hoạt Động:"
            rules={[
              {
                required: true,
                message: 'Trạng Thái Hoạt Động không được để trống!',
              },
            ]}
          >
            <Select placeholder="Vui lòng chọn Trạng Thái Hoạt Động">
              <Select.Option value={false}>Hoạt Động</Select.Option>
              <Select.Option value={true}>Vô Hiệu Hoá</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Thông Tin Chi Tiết"
        visible={isDetailModalVisible}
        cancelText="Đóng"
        width={550}
        className="add-doctor-modal-container"
        onCancel={() => setIsDetailModalVisible(false)}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <div className="avatar-container-profile">
          <div className="upload-avatar">
            <Avatar size={100} src={avatarSource} icon={<AiOutlineUser />}></Avatar>
          </div>
        </div>

        <Descriptions
          bordered
          column={1}
          size="middle"
          style={{ marginTop: 20 }}
          labelStyle={{ width: 200 }}
        >
          <Descriptions.Item label="ID:">{doctorDetail.id}</Descriptions.Item>
          <Descriptions.Item label="Họ và tên:">{doctorDetail.name}</Descriptions.Item>
          <Descriptions.Item label="Giới tính:">{doctorDetail.gender}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh:">{doctorDetail.dateOfBirth}</Descriptions.Item>
          <Descriptions.Item label="CMND:">{doctorDetail.cmnd}</Descriptions.Item>
          <Descriptions.Item label="Email:">{doctorDetail.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại:">{doctorDetail.mobile}</Descriptions.Item>
          <Descriptions.Item label="Bệnh viện công tác:">{doctorDetail.hospital}</Descriptions.Item>
          <Descriptions.Item label="Trạng thái hoạt động:">
            {doctorDetail.isDisabled}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      {isLoadingSkeleton ? (
        renderLoadingSkeleton
      ) : (
        <Table
          locale={{
            emptyText: <Empty description="Không có dữ liệu." />,
          }}
          className="doctor-table"
          columns={tableColumns}
          dataSource={doctorSource}
          pagination={{ pageSize: 10 }}
          scroll={{ x: 1200 }}
        />
      )}
    </div>
  );
};

export default DoctorManager;
