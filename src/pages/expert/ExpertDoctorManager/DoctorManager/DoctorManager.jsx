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
import { AiFillCamera, AiOutlineUser, AiOutlineSetting } from 'react-icons/ai';
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
  const [loadingSearchButton, setLoadingSearchButton] = useState(false);

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
      title: '???nh',
      align: 'center',
      width: 80,
      key: 'avatar',
      render: (_text, record) => (
        <Avatar src={record?.avatar} size={55}>
          {record.name.substring(0, 1)}
        </Avatar>
      ),
    },
    {
      title: 'T??n',
      dataIndex: 'name',
      key: 'name',
      width: 155,
      // render: (name) => <Link to="/expert/patient/123">{name}</Link>,
    },
    // {
    //   title: 'Ng??y Sinh',
    //   dataIndex: 'dateOfBirth',
    //   key: 'dateOfBirth',
    //   width: 120,
    //   render: (dateOfBirth) => moment(dateOfBirth).format('DD/MM/YYYY'),
    // },
    // {
    //   title: 'Gi???i T??nh',
    //   dataIndex: 'gender',
    //   key: 'gender',
    //   width: 100,
    //   render: (gender) => {
    //     if (gender) {
    //       return 'Nam';
    //     }
    //     return 'N???';
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
      title: 'S??? ??i???n Tho???i',
      dataIndex: 'mobile',
      key: 'mobile',
      width: 110,
    },

    {
      title: 'B???nh Vi???n C??ng T??c',
      dataIndex: 'hospital',
      key: 'hospital',
      width: 250,
      render: (_text, record) => record.hospital.name,
    },
    {
      title: 'Tr???ng Th??i',
      dataIndex: 'isDisabled',
      key: 'isDisabled',
      width: 100,
      align: 'center',
      // fixed: 'right',
      render: (isDisabled) => {
        if (isDisabled) {
          return <Tag color="volcano">V?? Hi???u Ho??</Tag>;
        }
        return <Tag color="green">??ang Ho???t ?????ng</Tag>;
      },
    },
    {
      title: <AiOutlineSetting size={20} style={{ verticalAlign: 'middle' }} />,
      key: 'action',
      align: 'center',
      width: 60,

      render: (record) => {
        return (
          <Tooltip title="T??c V???">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="1"
                    icon={<AiOutlineEdit size={15} />}
                    // style={{ color: '#1890FF' }}
                    onClick={() => handleVisibleEditDoctor(record)}
                  >
                    S???a Th??ng Tin
                  </Menu.Item>
                  {/* <Menu.Item
                  key="2"
                  icon={<AiOutlineDelete size={15} color="#FF4D4F" />}
                  style={{ color: '#FF4D4F' }}
                  onClick={() => handleDeleteDoctor(record)}
                >
                  Xo??
                </Menu.Item> */}
                  <Menu.Item
                    key="3"
                    icon={<AiOutlineInfoCircle size={15} />}
                    onClick={() => handleVisibleDetailDoctor(record)}
                  >
                    Xem chi ti???t
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
      title: 'X??c Nh???n',
      content: 'B???n c?? ch???c ch???n mu???n xo???',
      okText: 'Xo??',
      okType: 'danger',
      cancelText: 'Hu???',
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
        title: 'X??c Nh???n',
        content: 'B???n c?? ch???c ch???n v???i c??c th??ng tin ???? nh???p?',
        okText: 'X??c Nh???n',
        cancelText: 'Kh??ng',
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
            message.success('S???a B??c S?? th??nh c??ng.', 5);
            getAllDoctors();
            handleCancelAddDoctor();
          } catch (error) {
            console.log(error);
            message.error('S???a B??c S?? kh??ng th??nh c??ng.', 5);
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
        message.success('T???o B??c S?? th??nh c??ng.', 5);
        getAllDoctors();
        handleCancelAddDoctor();
      } catch (error) {
        console.log(error);
        message.error('T???o B??c S?? kh??ng th??nh c??ng.', 5);
      }
    });
  };

  const handleVisibleAddDoctor = () => {
    setIsAddDoctorModalVisible(true);
    setModalUsedFor('addDoctor');
    setModalTitle('Th??m B??c S??');

    formAddEditDoctor.setFieldsValue({ isDisabled: false });
  };

  const handleVisibleEditDoctor = (record) => {
    setIsAddDoctorModalVisible(true);
    setModalUsedFor('editDoctor');
    setModalTitle('S???a B??c S??');
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
      gender: record.gender ? 'Nam' : 'N???',
      dateOfBirth: moment(record.dateOfBirth).format('DD/MM/YYYY'),
      mobile: record.mobile,
      isDisabled: record.isDisabled ? 'V?? Hi???u Ho??' : '??ang Ho???t ?????ng',
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
        message.error(`${file.name} Kh??ng ph???i l?? t???p h??nh ???nh.`);
        return false;
      }
      if (file.size > 1048576) {
        message.error(`${file.name} v?????t qu?? dung l?????ng cho ph??p.`);
        return false;
      }
      return true;
    },
  };

  const handleSearch = async (value) => {
    try {
      setLoadingSearchButton(true);
      const searchResult = await doctorAPI.searchDoctor(value);
      setDoctorSource(searchResult);
      setLoadingSearchButton(false);
    } catch (error) {
      setLoadingSearchButton(false);
      console.log(error);
    }
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
          Th??m B??c S??
        </Button>

        <Input.Search
          allowClear
          enterButton
          loading={loadingSearchButton}
          onSearch={handleSearch}
          placeholder="T??m ki???m"
          style={{ width: 320 }}
          size="large"
        />
      </div>
      <Modal
        title={modalTitle}
        visible={isAddDoctorModalVisible}
        okText="X??c Nh???n"
        cancelText="Hu???"
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
              <Tooltip title="T???i ???nh l??n">
                <ImgCrop
                  {...checkFileIsImage}
                  rotate
                  modalTitle="Ch???nh s???a ???nh"
                  modalOk="X??c Nh???n"
                  modalCancel="Hu???"
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
            label="H??? V?? T??n:"
            rules={[
              {
                required: true,
                message: 'H??? V?? T??n kh??ng ???????c ????? tr???ng!',
              },
              {
                pattern: vietnameseNameRegex,
                message: 'H??? V?? T??n kh??ng ????ng ?????nh d???ng',
              },
            ]}
          >
            <Input placeholder="H??? V?? T??n" />
          </Form.Item>
          <Form.Item
            name="dateOfBirth"
            label="Ng??y Sinh:"
            rules={[
              {
                required: true,
                message: 'Ng??y sinh kh??ng ???????c ????? tr???ng!',
              },
            ]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <DatePicker
              disabledDate={(current) => current > moment().subtract(18, 'year').endOf('year')}
              defaultPickerValue={moment().subtract(18, 'year')}
              placeholder="Vui l??ng ch???n ng??y sinh"
              style={{ width: '100%' }}
              locale={localeVN}
              format={'DD/MM/YYYY'}
            />
          </Form.Item>

          <Form.Item
            name="gender"
            label="Gi???i T??nh:"
            rules={[
              {
                required: true,
                message: 'Gi???i t??nh kh??ng ???????c ????? tr???ng!',
              },
            ]}
            style={{ display: 'inline-block', width: '50%', marginLeft: '8px' }}
          >
            <Select placeholder="Vui l??ng ch???n gi???i t??nh">
              <Select.Option value={true}>Nam</Select.Option>
              <Select.Option value={false}>N???</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item
            name="cmnd"
            label="CMND / CCCD:"
            rules={[
              {
                required: true,
                message: 'CMND kh??ng ???????c ????? tr???ng!',
              },
            ]}
            style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
          >
            <Input placeholder="CMND" />
          </Form.Item>
          <Form.Item
            name="mobile"
            label="S??? ??i???n Tho???i:"
            rules={[
              {
                required: true,
                message: 'S??? ??i???n tho???i kh??ng ???????c ????? tr???ng!',
              },
              {
                required: true,
                pattern: phoneNumberRegex,
                message: 'S??? ??i???n tho???i kh??ng ????ng ?????nh d???ng',
              },
            ]}
            style={{ display: 'inline-block', width: '50%', marginLeft: '8px' }}
          >
            <Input placeholder="S??? ??i???n Tho???i" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email:"
            rules={[
              {
                required: true,
                message: 'Email kh??ng ???????c ????? tr???ng!',
              },
              {
                pattern: emailRegex,
                message: 'Email kh??ng ????ng ?????nh d???ng',
              },
            ]}
          >
            <Input placeholder="Email" />
          </Form.Item>
          {/* <Form.Item
            name="hospital"
            label="B???nh Vi???n C??ng T??c:"
            rules={[
              {
                required: true,
                message: 'B???nh Vi???n C??ng T??c kh??ng ???????c ????? tr???ng!',
              },
            ]}
          >
            <Select placeholder="Vui l??ng ch???n B???nh Vi???n C??ng T??c">
              <Select.Option value={1}>B???nh Vi???n ?????i H???c Y D?????c</Select.Option>
              <Select.Option value={2}>B???nh Vi???n Qu??n Y</Select.Option>
            </Select>
          </Form.Item> */}

          {renderFormItemHospital}
          <Form.Item
            name="isDisabled"
            label="Tr???ng Th??i Ho???t ?????ng:"
            rules={[
              {
                required: true,
                message: 'Tr???ng Th??i Ho???t ?????ng kh??ng ???????c ????? tr???ng!',
              },
            ]}
          >
            <Select placeholder="Vui l??ng ch???n Tr???ng Th??i Ho???t ?????ng">
              <Select.Option value={false}>Ho???t ?????ng</Select.Option>
              <Select.Option value={true}>V?? Hi???u Ho??</Select.Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Th??ng Tin Chi Ti???t"
        visible={isDetailModalVisible}
        cancelText="????ng"
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
          <Descriptions.Item label="H??? v?? t??n:">{doctorDetail.name}</Descriptions.Item>
          <Descriptions.Item label="Gi???i t??nh:">{doctorDetail.gender}</Descriptions.Item>
          <Descriptions.Item label="Ng??y sinh:">{doctorDetail.dateOfBirth}</Descriptions.Item>
          <Descriptions.Item label="CMND:">{doctorDetail.cmnd}</Descriptions.Item>
          <Descriptions.Item label="Email:">{doctorDetail.email}</Descriptions.Item>
          <Descriptions.Item label="S??? ??i???n tho???i:">{doctorDetail.mobile}</Descriptions.Item>
          <Descriptions.Item label="B???nh vi???n c??ng t??c:">{doctorDetail.hospital}</Descriptions.Item>
          <Descriptions.Item label="Tr???ng th??i ho???t ?????ng:">
            {doctorDetail.isDisabled}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      {isLoadingSkeleton ? (
        renderLoadingSkeleton
      ) : (
        <Table
          scroll={{ y: 705 }}
          locale={{
            emptyText: <Empty description="Kh??ng c?? d??? li???u." />,
          }}
          className="doctor-table"
          columns={tableColumns}
          dataSource={doctorSource}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default DoctorManager;
