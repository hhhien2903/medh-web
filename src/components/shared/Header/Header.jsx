import { useEffect, useContext, useState } from 'react';
import {
  Layout,
  Menu,
  Dropdown,
  Avatar,
  Modal,
  Input,
  Form,
  Button,
  Upload,
  Tooltip,
  DatePicker,
  Select,
  message,
} from 'antd';
import '../Header/Header.scss';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../../contexts/AppProvider';
import { AuthContext } from '../../../contexts/AuthProvider';
import { firebaseAuth } from '../../../config/firebase';
import expertAPI from '../../../api/expertAPI';
import ImgCrop from 'antd-img-crop';
import localeVN from 'antd/es/date-picker/locale/vi_VN';
import moment from 'moment';
import { phoneNumberRegex } from '../../../utils/regex';
import {
  AiOutlineMenuUnfold,
  AiFillCamera,
  AiOutlineMenuFold,
  AiOutlineUser,
  AiOutlineLogout,
} from 'react-icons/ai';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
const CARET_DOWN = false;
const Header = () => {
  const { menuToggleCollapsed, setMenuToggleCollapsed } = useContext(AppContext);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formUpdateCurrentUserInfo] = Form.useForm();
  const history = useHistory();
  const [avatarUploadPreview, setAvatarUploadPreview] = useState(null);
  const [avatarUploadSource, setAvatarUploadSource] = useState(null);
  const [caretIconState, setCaretIconState] = useState(CARET_DOWN);
  // console.log(history.location.pathname);
  const getPageTitle = () => {
    const pathnameURL = history.location.pathname;
    // if (title.match(new RegExp(/\/expert\/patient\/[0-9]+/))) {
    //   return 'Chi Tiết Bệnh Nhân';
    // }
    switch (pathnameURL) {
      case '/expert/dashboard':
        return 'Dashboard';
      case '/expert/doctor':
        return 'Quản Lý Bác Sĩ';
      case '/expert/doctor/pending':
        return 'Quản Lý Bác Sĩ Chờ Duyệt';
      case '/expert/patient':
        return 'Quản Lý Bệnh Nhân';
      case '/expert/device':
        return 'Quản Lý Thiết Bị';
      case '/expert/disease':
        return 'Quản Lý Mầm Bệnh';
      case '/expert/rule':
        return 'Quản Lý Tập Luật Y Tế';
      case '/expert/rule-condition':
        return 'Quản Lý Luật Y Tế';
      case '/expert/hospital':
        return 'Quản Lý Bệnh Viện';
      case '/expert/medical-record':
        return 'Quản Lý Bệnh Án';
      default:
        return '';
    }
  };

  const menu = (
    <Menu>
      <Menu.Item
        key={0}
        onClick={() => {
          handleClickGetInfoCurrentUser();
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AiOutlineUser size={16} />
          <p style={{ margin: 0, display: 'inline' }}>&nbsp;Thông Tin Cá Nhân</p>
        </div>
      </Menu.Item>
      <Menu.Item
        key={1}
        danger
        onClick={() => {
          const confirmLogoutModal = Modal.confirm({
            title: 'Xác Nhận',
            content: 'Bạn có chắc chắn muốn thoát?',
            okText: 'Thoát',
            okType: 'danger',
            cancelText: 'Không',
            onOk() {
              history.push('/logout');
            },
            onCancel() {
              confirmLogoutModal.destroy();
              setCaretIconState(CARET_DOWN);
            },
          });
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <AiOutlineLogout size={16} />
          <p style={{ margin: 0, display: 'inline' }}>&nbsp;Thoát</p>
        </div>
      </Menu.Item>
    </Menu>
  );

  const handleClickToggleMenu = () => {
    setMenuToggleCollapsed(!menuToggleCollapsed);
  };

  const handleClickGetInfoCurrentUser = async () => {
    let { phoneNumber, email } = firebaseAuth.currentUser;
    if (phoneNumber) {
      phoneNumber = '0' + phoneNumber.substring(3);
    }
    try {
      const expertData = await expertAPI.checkAccountRegistered(phoneNumber, email);
      setCurrentUser(expertData);
      formUpdateCurrentUserInfo.setFieldsValue({
        id: currentUser.id,
        name: currentUser.name,
        gender: currentUser.gender,
        dateOfBirth: moment(currentUser.dateOfBirth),
        mobile: currentUser.mobile,
        email: currentUser.email,
      });
      setAvatarUploadPreview(null);
      setAvatarUploadSource(null);
      setIsModalVisible(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleClickUpdateInfoCurrentUser = () => {
    formUpdateCurrentUserInfo.validateFields().then((formValue) => {
      const confirmUpdateInfoModal = Modal.confirm({
        title: 'Xác Nhận',
        content: 'Bạn có chắc chắn với các thông tin đã nhập?',
        okText: 'Xác Nhận',
        cancelText: 'Không',
        onOk: async () => {
          try {
            const data = {
              ...currentUser,
              ...formValue,
              dateOfBirth: formValue.dateOfBirth.toISOString(),
            };
            delete data['avatar'];
            if (avatarUploadSource) {
              const uploadAvatarForm = new FormData();
              uploadAvatarForm.append('file', avatarUploadSource);
              await expertAPI.uploadAvatar(currentUser.id, uploadAvatarForm);
            }

            const result = await expertAPI.updateInfo(data);
            setCurrentUser(result);
            setIsModalVisible(false);
            message.success('Cập nhật thành công!', 10);
          } catch (error) {
            console.log(error);
            message.error(error.message, 10);
          }
        },
        onCancel() {
          confirmUpdateInfoModal.destroy();
        },
      });
    });
  };

  useEffect(() => {
    if (window.innerWidth < 600) {
      setMenuToggleCollapsed(true);
    }
  }, []);

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

  const closeInfoCurrentUserModal = () => {
    setIsModalVisible(false);
    setAvatarUploadPreview(null);
    setAvatarUploadSource(null);
    setCaretIconState(CARET_DOWN);
  };
  return (
    <Layout.Header className="site-layout-background header-container">
      <div>
        {menuToggleCollapsed ? (
          <AiOutlineMenuUnfold className="toggle-menu" onClick={handleClickToggleMenu} />
        ) : (
          <AiOutlineMenuFold className="toggle-menu" onClick={handleClickToggleMenu} />
        )}
        <h2 style={{ display: 'inline', marginLeft: 10 }}>{getPageTitle()}</h2>
      </div>

      <div className="avatar">
        <Dropdown
          overlay={menu}
          placement="bottomRight"
          trigger={['hover']}
          onVisibleChange={(state) => setCaretIconState(state)}
        >
          <div>
            <Avatar size={45} src={currentUser?.avatar} style={{ marginRight: 3 }}>
              {!currentUser.avatar ? currentUser.name : ''}
            </Avatar>
            <p
              style={{ margin: 0, padding: 0, fontWeight: 600, fontSize: 15, marginLeft: 1 }}
              className="header-user-name"
            >
              {currentUser.name}
            </p>
            {caretIconState === CARET_DOWN ? (
              <FiChevronDown size={20} className="caret-user" />
            ) : (
              <FiChevronUp size={20} className="caret-user" />
            )}
          </div>
        </Dropdown>
        <div>
          <Modal
            className="modal-user"
            title="Cập nhật thông tin"
            centered
            visible={isModalVisible}
            width={400}
            onCancel={closeInfoCurrentUserModal}
            footer={[
              <Button
                style={{ fontWeight: 'bold', fontFamily: 'Helvetica' }}
                onClick={closeInfoCurrentUserModal}
              >
                Huỷ
              </Button>,
              <Button
                type="primary"
                style={{ fontWeight: 'bold', fontFamily: 'Helvetica' }}
                onClick={handleClickUpdateInfoCurrentUser}
              >
                Cập nhật
              </Button>,
            ]}
          >
            <div className="form-header">
              <div className="avatar-container-profile">
                <div className="upload-avatar">
                  {!avatarUploadPreview ? (
                    <Avatar size={100} src={currentUser?.avatar}>
                      {!currentUser.avatar ? currentUser.name : ''}
                    </Avatar>
                  ) : (
                    <Avatar size={100} src={avatarUploadPreview}></Avatar>
                  )}
                </div>
                <div className="btn-upload-avatar">
                  <Tooltip title="Tải ảnh lên">
                    <ImgCrop
                      {...checkFileIsImage}
                      rotate
                      modalTitle="Chỉnh sửa ảnh"
                      modalOk="Xác Nhận"
                      modalCancel="Huỷ"
                    >
                      <Upload customRequest={handleUploadAvatar} progress={false}>
                        <AiFillCamera style={{ position: 'absolute', top: '3px', right: '4px' }} />
                      </Upload>
                    </ImgCrop>
                  </Tooltip>
                </div>
              </div>
            </div>
            <Form
              form={formUpdateCurrentUserInfo}
              className="form-edit-current-user"
              layout="vertical"
              style={{ gap: '10px' }}
            >
              <Form.Item
                name="name"
                label="Họ Và Tên:"
                rules={[
                  {
                    required: true,
                    message: 'Họ Và Tên không được để trống!',
                  },
                ]}
              >
                <Input />
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
              >
                <Select placeholder="Vui lòng chọn giới tính">
                  <Select.Option value={true}>Nam</Select.Option>
                  <Select.Option value={false}>Nữ</Select.Option>
                </Select>
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
              >
                <Input
                  readOnly
                  placeholder="Số Điện Thoại"
                  style={{ backgroundColor: '#DCDCDC' }}
                />
              </Form.Item>
              <Form.Item
                name="email"
                label="Email:"
                rules={[
                  {
                    required: true,
                    message: 'Email không được để trống!',
                  },
                ]}
              >
                <Input readOnly placeholder="Email" style={{ backgroundColor: '#DCDCDC' }} />
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </Layout.Header>
  );
};

export default Header;
