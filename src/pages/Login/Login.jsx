import { Form, Input, Button, Image, Typography } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import './Login.scss';
import medHLogo from '../../assets/images/med-h.png';
import backgroundImage from '../../assets/images/backgound.jpg';
const Login = () => {
  return (
    <div
      className="form-login-container"
      style={{ backgroundImage: `url(${backgroundImage})`, backgroundRepeat: 'no-repeat' }}
    >
      <Image src={medHLogo} preview={false} width={120} />
      <Typography>MED-H</Typography>
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        // onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your Username!',
            },
          ]}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username: admin"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password: admin"
          />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Login;
