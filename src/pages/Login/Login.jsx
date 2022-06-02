import { Button, Form, Image, Input, notification, Space, Tabs } from 'antd';
import { useState } from 'react';
import {
  AiFillMobile,
  AiOutlineGoogle,
  AiOutlineLock,
  AiOutlineMobile,
  AiOutlineSetting,
} from 'react-icons/ai';
import backgroundImage from '../../assets/images/background-1.jpg';
import medHLogo from '../../assets/images/med_we_vertical.png';
import { firebase, firebaseAuth, providers } from '../../config/firebase';
import './Login.scss';
const Login = () => {
  const [formLoginPhone] = Form.useForm();
  const [activeLoginTab, setActiveLoginTab] = useState('1');

  const handleGoogleLogin = () => {
    firebaseAuth.signInWithPopup(providers.googleProvider).catch((err) => {
      console.log(err);
      if (err.code === 'auth/user-disabled') {
        console.log(err.code);
      }
    });
  };

  const setUpRecaptcha = () => {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
      size: 'invisible',
      callback: function (response) {
        console.log('Captcha Resolved');
        this.handleReceiveOTP();
      },
    });
  };

  const handleReceiveOTP = () => {
    formLoginPhone.validateFields(['phoneNumber']).then((formValue) => {
      let { phoneNumber } = formValue;
      if (phoneNumber.substring(0, 2) === '84') {
        phoneNumber = '+' + phoneNumber;
      } else {
        phoneNumber = '+84' + phoneNumber.substring(1, phoneNumber.length);
      }
      setUpRecaptcha();
      let appVerifier = window.recaptchaVerifier;
      firebaseAuth
        .signInWithPhoneNumber(phoneNumber, appVerifier)
        .then((confirmationResult) => {
          window.confirmationResult = confirmationResult;
          notification.success({
            key: 'sendedOtpNotify',
            message: 'Mã OTP đã được gửi!',
            description:
              'Một mã OTP đã được gửi đến số điện thoại của bạn, hãy nhập mã vào ô Mã Xác Nhận và tiến hành đăng nhập.',
            duration: 10,
          });
        })
        .catch((err) => {
          console.log(err);
        });
    });
  };

  const handleSubmitOTP = () => {
    formLoginPhone
      .validateFields(['otp'])
      .then((value) => {
        let { otp } = value;
        let optConfirm = window.confirmationResult;
        optConfirm.confirm(otp).catch((err) => {
          notification.destroy();
          if (err.code === 'auth/user-disabled') {
            notification.open({
              key: 'errorLogin',
              message: 'Tài khoản của bạn đã bị khoá!',
              description:
                'Tài khoản của bạn đã bị khoá, hãy liên hệ với Dịch Vụ Chăm Sóc Khách Hàng để biết thêm chi tiết!',
              duration: 10,
            });
            return;
          }
          notification.open({
            message: 'Nhập sai mã OTP!',
            description: 'Bạn đã nhập sai mã OTP, hãy kiểm tra, và tiến hành đăng nhập lại.',
            duration: 10,
          });
        });
      })
      .catch((err) => {
        console.log(err);
        notification.destroy();
        notification.open({
          message: 'Vui lòng chọn nút Nhận Mã OTP!',
          description:
            'Bạn hãy chọn nút Nhận Mã OTP để hệ thống thực hiện gửi mã về số điện thoại của bạn!',
          duration: 10,
        });
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
      <Image src={medHLogo} preview={false} width={180} style={{ marginBottom: 10 }} />

      <Tabs centered size="large" activeKey={activeLoginTab} onChange={setActiveLoginTab}>
        <Tabs.TabPane tab="Tài Khoản" key="1">
          <Space direction="vertical">
            <Button
              size={'large'}
              icon={
                <AiOutlineGoogle style={{ verticalAlign: 'sub', marginRight: '5px' }} size={22} />
              }
              block
              type="primary"
              onClick={handleGoogleLogin}
            >
              Tiếp Tục Với Google
            </Button>
            <Button
              size={'large'}
              icon={<AiFillMobile style={{ verticalAlign: 'sub', marginRight: '5px' }} size={20} />}
              onClick={() => setActiveLoginTab('2')}
              block
              type="primary"
            >
              Tiếp Tục Với Số Điện Thoại
            </Button>
          </Space>
        </Tabs.TabPane>
        <Tabs.TabPane tab="Số Điện Thoại" key="2">
          <Form form={formLoginPhone} layout="vertical" className="login-form-phone" size={'large'}>
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
              <Input prefix={<AiOutlineMobile size={18} />} placeholder="Số Điện Thoại" />
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
                <Input prefix={<AiOutlineLock size={18} />} placeholder="Mã Xác Nhận" />
              </Form.Item>
              <Form.Item style={{ display: 'inline-block', width: 'calc(45%)', marginLeft: '8px' }}>
                <Button onClick={handleReceiveOTP} block type="primary">
                  Nhận mã OTP
                </Button>
              </Form.Item>
            </Form.Item>
            <div id="recaptcha-container" />
            <Form.Item>
              <Button onClick={handleSubmitOTP} block type="primary" htmlType="submit">
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
