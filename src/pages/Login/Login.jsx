import { Form, Input, Button, Image, Tabs, Space } from 'antd';
import { GoogleOutlined, MobileOutlined, LockOutlined, MobileFilled } from '@ant-design/icons';
import './Login.scss';
import medHLogo from '../../assets/images/med-h-logo.png';
import backgroundImage from '../../assets/images/background-1.jpg';
import authApi from '../../api/auth-api';
import { useState } from 'react';
import { firebaseAuth, providers } from '../../config/firebase';
const Login = () => {
  const [formLogin] = Form.useForm();
  const [activeLoginTab, setActiveLoginTab] = useState('1');
  const handleGoogleLogin = () => {
    firebaseAuth.signInWithPopup(providers.googleProvider).catch((err) => {
      if (err.code === 'auth/user-disabled') {
        console.log(err.code);
      }
    });
  };

  return (
    <div
      className="form-login-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Image src={medHLogo} preview={false} width={150} style={{ marginBottom: 10 }} />

      <Tabs centered size="large" activeKey={activeLoginTab} onChange={setActiveLoginTab}>
        <Tabs.TabPane tab="Tài Khoản" key="1">
          <Space direction="vertical">
            <Button
              size={'large'}
              icon={<GoogleOutlined />}
              block
              type="primary"
              onClick={() => handleGoogleLogin()}
            >
              Tiếp Tục Với Google
            </Button>
            <Button
              size={'large'}
              icon={<MobileFilled />}
              onClick={() => setActiveLoginTab('2')}
              block
              type="primary"
            >
              Tiếp Tục Với Số Điện Thoại
            </Button>
          </Space>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Số Điện Thoại" key="2">
          <Form
            // form={formLoginPhone}

            layout="vertical"
            className="login-form-phone"
            size={'large'}
          >
            <Form.Item
              rules={[
                { required: true, message: 'Số điện thoại không được để trống' },
                {
                  required: true,
                  pattern: new RegExp(/(^(84|0)[3|5|7|8|9])+([0-9]{8})\b/),
                  message: 'Số điện thoại không đúng định dạng',
                },
              ]}
              name="phoneNumber"
            >
              <Input prefix={<MobileOutlined />} placeholder="Số Điện Thoại" />
            </Form.Item>

            <Form.Item style={{ marginBottom: '10px' }}>
              <Form.Item
                name="otp"
                rules={[
                  { required: true, message: 'Mã OTP không được để trống' },
                  {
                    required: true,
                    pattern: new RegExp(/^[0-9]{1,6}$\b/),
                    message: 'Mã OTP không đúng định dạng',
                  },
                ]}
                style={{ display: 'inline-block', width: 'calc(55% - 8px)' }}
              >
                <Input prefix={<LockOutlined />} placeholder="Mã Xác Nhận" />
              </Form.Item>
              <Form.Item style={{ display: 'inline-block', width: 'calc(45%)', marginLeft: '8px' }}>
                <Button
                  // onClick={handleReceiveOTP}
                  block
                  type="primary"
                >
                  Nhận mã OTP
                </Button>
              </Form.Item>
            </Form.Item>
            <div id="recaptcha-container"></div>
            <Form.Item>
              <Button
                // onClick={handleSubmitOTP}
                block
                type="primary"
                htmlType="submit"
              >
                Đăng Nhập
              </Button>
            </Form.Item>
          </Form>
        </Tabs.TabPane>
      </Tabs>
    </div>
  );
};

export default Login;
