import { Button, DatePicker, Form, Image, Input, Modal, notification, Select } from 'antd';
import React, { useState, useEffect } from 'react';
import backgroundImage from '../../assets/images/background-1.jpg';
import medHLogo from '../../assets/images/med-h-logo.png';
import '../Register/Register.scss';
import localeVN from 'antd/es/date-picker/locale/vi_VN';
import moment from 'moment';
import 'moment/locale/vi';
import { firebase } from '../../config/firebase';
import { useHistory } from 'react-router-dom';
import expertAPI from '../../api/expertAPI';
import { vietnameseNameRegex, emailRegex, phoneNumberRegex } from '../../utils/regex';
const Register = () => {
  const [formRegisterExpert] = Form.useForm();
  const [isReadOnlyEmailField, setIsReadOnlyEmailField] = useState(false);
  const [isReadOnlyPhoneNumberField, setIsReadOnlyPhoneNumberField] = useState(false);
  const history = useHistory();

  const checkExistingInfo = () => {
    const { email, phoneNumber, displayName } = firebase.auth().currentUser;
    if (email) {
      setIsReadOnlyEmailField(true);
    }
    if (phoneNumber) {
      setIsReadOnlyPhoneNumberField(true);
    }

    formRegisterExpert.setFieldsValue({
      fullName: displayName,
      phoneNumber: phoneNumber,
      email: email,
    });
  };

  useEffect(() => {
    checkExistingInfo();
  }, []);

  const handleClickRegister = () => {
    formRegisterExpert.validateFields().then((formValue) => {
      const confirmRegisterModal = Modal.confirm({
        title: 'Xác Nhận',
        content: 'Bạn có chắc chắn với các thông tin đã nhập?',
        okText: 'Xác Nhận',
        cancelText: 'Không',
        onOk: async () => {
          try {
            let { phoneNumber } = formValue;
            if (phoneNumber.substring(0, 3) === '+84') {
              phoneNumber = '0' + phoneNumber.substring(3);
            }

            const data = {
              name: formValue.fullName,
              dateOfBirth: formValue.dateOfBirth.toISOString(),
              gender: formValue.gender,
              mobile: phoneNumber,
              email: formValue.email,
            };
            const result = await expertAPI.register(data);
            console.log(result);
          } catch (error) {
            if (error.status === 403) {
              notification.open({
                message: 'Đăng ký thông tin không thành công!',
                description: 'Email/SĐT của bạn không nằm trong danh sách được phép đăng ký.',
                duration: 15,
              });
            }
            if (error.status === 500) {
              notification.open({
                message: 'Đăng ký thông tin không thành công!',
                description:
                  'Email/SĐT của bạn đã từng được đăng ký trước đây, hãy bấm nút Thoát và tiến hành đăng nhập lại.',
                duration: 15,
              });
            }
          }
        },
        onCancel() {
          confirmRegisterModal.destroy();
        },
      });
    });
  };

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
        form={formRegisterExpert}
      >
        <Form.Item
          name="fullName"
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
          name="phoneNumber"
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
            readOnly={isReadOnlyPhoneNumberField}
            style={{ backgroundColor: isReadOnlyPhoneNumberField ? '#DCDCDC' : '#FFFFFF' }}
            placeholder="Số Điện Thoại"
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
            {
              pattern: emailRegex,
              message: 'Email không đúng định dạng',
            },
          ]}
        >
          <Input
            readOnly={isReadOnlyEmailField}
            placeholder="Email"
            style={{ backgroundColor: isReadOnlyEmailField ? '#DCDCDC' : '#FFFFFF' }}
          />
        </Form.Item>
        {/* <Form.Item
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
        </Form.Item> */}

        <Form.Item>
          <Button
            block
            type="primary"
            htmlType="submit"
            style={{ marginTop: 10 }}
            onClick={handleClickRegister}
          >
            Xác Nhận
          </Button>
        </Form.Item>
        <Form.Item style={{ marginTop: '30px' }}>
          <Button
            onClick={() => {
              history.push('/logout');
            }}
            block
            type="primary"
            danger
          >
            Thoát
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default Register;
