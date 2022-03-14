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
import { MenuUnfoldOutlined, MenuFoldOutlined, CameraFilled } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../../contexts/AppProvider';
import { AuthContext } from '../../../contexts/AuthProvider';
import { firebaseAuth } from '../../../config/firebase';
import expertAPI from '../../../api/expertAPI';
import ImgCrop from 'antd-img-crop';
import localeVN from 'antd/es/date-picker/locale/vi_VN';
import moment from 'moment';
import { phoneNumberRegex } from '../../../utils/regex';
const Header = () => {
  const { menuToggleCollapsed, setMenuToggleCollapsed } = useContext(AppContext);
  const { currentUser, setCurrentUser } = useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [formUpdateCurrentUserInfo] = Form.useForm();
  const history = useHistory();

  const getPageTitle = () => {
    const title = history.location.pathname;
    switch (title) {
      case '/expert/dashboard':
        return 'Dashboard';
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
        Thông Tin Cá Nhân
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
            },
          });
        }}
      >
        Thoát
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

    const expertData = await expertAPI.checkAccountRegistered(phoneNumber, email);
    setCurrentUser(expertData);
    console.log(currentUser);
    formUpdateCurrentUserInfo.setFieldsValue({
      id: currentUser.id,
      name: currentUser.name,
      gender: currentUser.gender,
      dateOfBirth: moment(currentUser.dateOfBirth),
      mobile: currentUser.mobile,
      email: currentUser.email,
    });
    // console.log(moment(currentUser.dateOfBirth).format('DD/MM/YYYY'));
    setIsModalVisible(true);
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
            console.log(data);
            const result = await expertAPI.updateInfo(data);
            console.log(result);
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

  return (
    <Layout.Header className="site-layout-background header-container">
      <div>
        {menuToggleCollapsed ? (
          <MenuUnfoldOutlined className="toggle-menu" onClick={handleClickToggleMenu} />
        ) : (
          <MenuFoldOutlined className="toggle-menu" onClick={handleClickToggleMenu} />
        )}
        <h2 style={{ display: 'inline', marginLeft: 10 }}>{getPageTitle()}</h2>
      </div>

      <div className="avatar">
        <Dropdown overlay={menu} trigger={['click']}>
          <div>
            <Avatar size={45} src={currentUser?.photoURL}>
              {currentUser.name}
            </Avatar>
          </div>
        </Dropdown>
        <div>
          <Modal
            className="modal-user"
            title="Cập nhật thông tin"
            centered
            visible={isModalVisible}
            width={400}
            onCancel={() => setIsModalVisible(false)}
            footer={[
              <Button
                style={{ fontWeight: 'bold', fontFamily: 'Helvetica' }}
                onClick={() => setIsModalVisible(false)}
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
                  <Avatar size={80}>{currentUser.name}</Avatar>
                </div>
                <div className="btn-upload-avatar">
                  <Tooltip title="Tải ảnh lên">
                    <ImgCrop
                      // {...checkFileIsImage}
                      rotate
                      modalTitle="Chỉnh sửa ảnh"
                      modalOk="Xác Nhận"
                      modalCancel="Huỷ"
                    >
                      <Upload
                        previewFile={false}
                        //  customRequest={handleUploadAvatar}
                        progress={false}
                      >
                        {<CameraFilled />}
                      </Upload>
                    </ImgCrop>
                  </Tooltip>
                </div>
              </div>
            </div>
            <Form form={formUpdateCurrentUserInfo} layout="vertical" style={{ gap: '10px' }}>
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
