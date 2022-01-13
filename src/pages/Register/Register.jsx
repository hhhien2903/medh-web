import { Button, DatePicker, Form, Image, Input, Select } from 'antd';
import React from 'react';
import backgroundImage from '../../assets/images/background-1.jpg';
import medHLogo from '../../assets/images/med-h-logo.png';
import '../Register/Register.scss';
import localeVN from 'antd/es/date-picker/locale/vi_VN';
import moment from 'moment';
import 'moment/locale/vi';

const Register = () => {
  return (
    <div
      className="form-register-container"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundRepeat: 'no-repeat',
      }}
    >
      <Image src={medHLogo} preview={false} width={125} style={{ marginBottom: 5 }} />
      <h1 style={{ fontWeight: 'bold', fontSize: 30, marginBottom: 5 }}>Đăng Ký Thông Tin</h1>
      <Form
        className="register-form"
        // onFinish={onFinish}
        size={'large'}
        layout="vertical"
      >
        <Form.Item
          name="fullName"
          label="Họ Và Tên:"
          rules={[
            {
              required: true,
              message: 'Họ Và Tên không được để trống!',
            },
          ]}
        >
          <Input placeholder="Họ Và Tên" />
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
            disabledDate={(current) => current > moment().subtract(16, 'year').endOf('year')}
            defaultPickerValue={moment().subtract(16, 'year')}
            placeholder="Vui lòng chọn ngày sinh"
            style={{ width: '100%' }}
            locale={localeVN}
            format={'DD/MM/YYYY'}
          />
        </Form.Item>
        <Form.Item
          name="hospital"
          label="Thuộc Bệnh Viện:"
          rules={[
            {
              required: true,
              message: 'Bênh Viện Không Được Để Trống!',
            },
          ]}
        >
          <Select placeholder="Vui lòng chọn Bệnh Viện">
            <Select.Option value={'quany115'}>Quân Y 115</Select.Option>
            <Select.Option value={'choray'}>Chợ Rẫy</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button block type="primary" htmlType="submit" style={{ marginTop: 10 }}>
            Xác Nhận
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
