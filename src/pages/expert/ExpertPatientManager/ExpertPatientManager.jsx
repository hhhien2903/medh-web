import {
  Button,
  DatePicker,
  Dropdown,
  Empty,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Select,
  Table,
  Descriptions,
} from 'antd';
import localeVN from 'antd/es/date-picker/locale/vi_VN';
import moment from 'moment';
import React, { useState, useEffect } from 'react';
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineInfoCircle,
  AiOutlinePlus,
  AiOutlineAreaChart,
} from 'react-icons/ai';
import { MdMoreHoriz } from 'react-icons/md';
import { emailRegex, phoneNumberRegex, vietnameseNameRegex } from '../../../utils/regex';
import './ExpertPatientManager.scss';
import useFormItemAddress from '../../../components/shared/FormItemAddress/useFormItemAddress';
import patientAPI from '../../../api/patientAPI';
import useFormItemHospital from '../../../components/shared/FormItemHospital/useFormItemHospital';
import useFormItemDoctor from '../../../components/shared/FormItemDoctor/useFormItemDoctor';
import useFormItemDevice from '../../../components/shared/FormItemDevice/useFormItemDevice';
import useLoadingSkeleton from '../../../components/shared/LoadingSkeleton/useLoadingSkeleton';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);
const ExpertPatientManager = () => {
  const [patientSource, setPatientSource] = useState([]);
  const [isAddEditPatientModalVisible, setIsAddEditPatientModalVisible] = useState(false);
  const [isConfirmLoadingAddEditPatientModal, setIsConfirmLoadingAddEditPatientModal] =
    useState(false);
  const [formAddEditPatient] = Form.useForm();
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsedFor, setModalUsedFor] = useState('');
  const { renderFormItemHospital } = useFormItemHospital();
  const { setIsDisableDistrict, setIsDisableWard, renderFormItemAddress } =
    useFormItemAddress(formAddEditPatient);
  const { renderFormItemDoctor, setIsDoctorFormItemRequired } = useFormItemDoctor();
  const { renderFormItemDevice, setIsDeviceFormItemRequired } = useFormItemDevice();
  const { renderLoadingSkeleton, setIsLoadingSkeleton, isLoadingSkeleton } = useLoadingSkeleton();
  const [isVisibleChartModal, setIsVisibleChartModal] = useState(false);
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [patientDetail, setPatientDetail] = useState({});
  // const dataSourceTest = [
  //   {
  //     id: 16,
  //     uuid: '98a20510-e61f-42a3-9324-3bbc6b51165f',
  //     createdAt: '2022-03-15T00:00:00.000Z',
  //     updatedAt: '2022-03-15T00:00:00.000Z',
  //     avatar: 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png',
  //     cmnd: '123456789',
  //     dateOfBirth: '2000-01-16T07:58:29.000Z',
  //     email: 'test123@gmail.com',
  //     gender: true,
  //     isActive: true,
  //     mobile: '0975846784',
  //     name: 'Nguyễn Văn A',
  //     address: '12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, Thành phố Hồ Chí Minh',
  //     hospital: 'Bệnh Viện Quân Y',
  //     doctor: 'Nguyễn Văn A',
  //     device: 'Số 1',
  //     cityId: 79,
  //     districtId: 767,
  //     wardId: 1460,
  //   },
  //   {
  //     id: 17,
  //     uuid: '98a20510-e61f-42a3-9324-3bbc6b51165f',
  //     createdAt: '2022-03-15T00:00:00.000Z',
  //     updatedAt: '2022-03-15T00:00:00.000Z',
  //     avatar: 'https://eitrawmaterials.eu/wp-content/uploads/2016/09/person-icon.png',
  //     cmnd: '123456789',
  //     dateOfBirth: '2000-01-16T07:58:29.000Z',
  //     email: 'test123@gmail.com',
  //     gender: true,
  //     isActive: true,
  //     mobile: '0975846784',
  //     name: 'Nguyễn Văn B',
  //     address: '12 Nguyễn Văn Bảo, Phường 4, Gò Vấp, Thành phố Hồ Chí Minh',
  //     hospital: 'Bệnh Viện Quân Y',
  //     doctor: 'Nguyễn Văn B',
  //     device: 'Số 2',
  //   },
  // ];
  const tableColumns = [
    {
      title: 'STT',
      key: 'index',
      width: 40,
      align: 'center',
      className: 'index-row',
      render: (text, record) => patientSource.indexOf(record) + 1,
    },
    {
      title: 'Tên',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Ngày Sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (dateOfBirth) => moment(dateOfBirth).format('DD/MM/YYYY'),
    },
    {
      title: 'Giới Tính',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => {
        if (gender) {
          return 'Nam';
        }
        return 'Nữ';
      },
    },
    {
      title: 'CMND',
      dataIndex: 'cmnd',
      key: 'cmnd',
    },
    // {
    //   title: 'Email',
    //   dataIndex: 'email',
    //   key: 'email',
    // },
    {
      title: 'Số Điện Thoại',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    // {
    //   title: 'Địa Chỉ',
    //   dataIndex: 'address',
    //   key: 'address',
    // },
    {
      title: 'Bệnh Viện',
      key: 'hospital',
      render: (text, record) => {
        return record.hospital.name;
      },
    },
    {
      title: 'Bác Sĩ Phụ Trách',
      key: 'doctor',
      render: (text, record) => {
        return record.doctor?.name;
      },
    },
    {
      title: 'Vòng Đeo',
      dataIndex: 'device',
      key: 'device',
    },

    {
      title: 'Tác Vụ',
      key: 'action',
      render: (record) => {
        return (
          <Dropdown
            overlay={
              <Menu>
                <Menu.Item
                  key="1"
                  icon={<AiOutlineEdit size={15} color="#1890FF" />}
                  style={{ color: '#1890FF' }}
                  onClick={() => handleVisibleEditPatient(record)}
                >
                  Sửa thông tin
                </Menu.Item>
                <Menu.Item
                  key="2"
                  icon={<AiOutlineDelete size={15} color="#FF4D4F" />}
                  style={{ color: '#FF4D4F' }}
                  onClick={() => handleDeleteDoctor(record)}
                >
                  Xoá
                </Menu.Item>
                <Menu.Item
                  key="3"
                  icon={<AiOutlineInfoCircle size={15} />}
                  onClick={() => handleVisibleDetailModal(record)}
                >
                  Xem chi tiết
                </Menu.Item>
                <Menu.Item
                  key="4"
                  icon={<AiOutlineAreaChart size={15} />}
                  onClick={() => setIsVisibleChartModal(true)}
                >
                  Xem biểu đồ
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
  const getAllPatient = async () => {
    try {
      setIsLoadingSkeleton(true);
      const patientSourceResult = await patientAPI.getAllPatients();
      setPatientSource(patientSourceResult);
      setIsLoadingSkeleton(false);
      console.log(patientSourceResult);
    } catch (error) {
      setIsLoadingSkeleton(false);
      console.log(error);
    }
  };
  useEffect(() => {
    setIsDoctorFormItemRequired(false);
    setIsDeviceFormItemRequired(false);
    getAllPatient();
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

  const handleEditPatient = () => {
    console.log('edit doctor');
  };
  const handleAddPatient = () => {
    formAddEditPatient.validateFields().then(async (formValue) => {
      setIsConfirmLoadingAddEditPatientModal(true);
      try {
        const sendData = {
          name: formValue.name,
          surname: formValue.surname,
          cmnd: formValue.cmnd,
          dateOfBirth: moment(formAddEditPatient).toISOString(),
          gender: formValue.gender,
          mobile: formValue.mobile,
          email: formValue.email,
          hospitalId: formValue.hospitalId,
          doctor_id: formValue.doctorId,
          cityId: formValue.cityId,
          districtId: formValue.districtId,
          wardId: formValue.wardId,
          address: formValue.address,
          device_id: 1,
        };
        console.log(sendData);
        await patientAPI.createPatient(sendData);
        message.success('Tạo Bệnh Nhân thành công.', 5);
        getAllPatient();
        handleCancelAddPatient();
      } catch (error) {
        console.log(error);
        message.error('Tạo Bệnh Nhân không thành công.', 5);
        setIsConfirmLoadingAddEditPatientModal(false);
      }
    });
  };

  const handleVisibleAddPatient = async () => {
    setIsAddEditPatientModalVisible(true);
    setModalUsedFor('addPatient');
    setModalTitle('Thêm Bệnh Nhân');
  };

  const handleVisibleEditPatient = async (record) => {
    setIsAddEditPatientModalVisible(true);
    setModalUsedFor('editPatient');
    setModalTitle('Sửa Bệnh Nhân');
    setIsDisableDistrict(false);
    setIsDisableWard(false);
    formAddEditPatient.setFieldsValue({
      name: record.name,
      surname: record.surname,
      gender: record.gender,
      dateOfBirth: moment(record.dateOfBirth),
      mobile: record.mobile,
      email: record.email,
      cmnd: record.cmnd,
      city: record.cityId,
      wardId: record.wardId,
      cityId: record.cityId,
      districtId: record.districtId,
    });
  };

  const handleCancelAddPatient = () => {
    setIsAddEditPatientModalVisible(false);
    formAddEditPatient.resetFields();
    setIsConfirmLoadingAddEditPatientModal(false);
    setIsDisableDistrict(true);
    setIsDisableWard(true);
  };

  const handleVisibleDetailModal = (record) => {
    setIsDetailModalVisible(true);
    setPatientDetail({
      ...record,
      gender: record.gender ? 'Nam' : 'Nữ',
      dateOfBirth: moment(record.dateOfBirth).format('DD/MM/YYYY'),
    });
  };
  return (
    <div className="patient-manager-container">
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
          onClick={handleVisibleAddPatient}
        >
          Thêm Bệnh Nhân
        </Button>
        <Input.Search
          placeholder="Tìm kiếm"
          style={{ width: 320, marginLeft: 'auto' }}
          size="large"
        />
      </div>
      <Modal
        title={modalTitle}
        visible={isAddEditPatientModalVisible}
        okText="Xác Nhận"
        cancelText="Huỷ"
        confirmLoading={isConfirmLoadingAddEditPatientModal}
        className="add-doctor-modal-container"
        onCancel={handleCancelAddPatient}
        // bodyStyle={{ overflowY: 'scroll' }}
        onOk={() => {
          if (modalUsedFor === 'addPatient') {
            return handleAddPatient();
          } else {
            return handleEditPatient();
          }
        }}
      >
        <Form layout="vertical" className="add-doctor-form" form={formAddEditPatient}>
          <Form.Item
            name="surname"
            label="Họ:"
            rules={[
              {
                required: true,
                message: 'Họ không được để trống!',
              },
              {
                pattern: vietnameseNameRegex,
                message: 'Họ không đúng định dạng',
              },
            ]}
          >
            <Input placeholder="Họ" />
          </Form.Item>
          <Form.Item
            name="name"
            label="Tên:"
            rules={[
              {
                required: true,
                message: 'Tên không được để trống!',
              },
              {
                pattern: vietnameseNameRegex,
                message: 'Tên không đúng định dạng',
              },
            ]}
          >
            <Input placeholder="Tên" />
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
              disabledDate={(current) => current > moment()}
              // defaultPickerValue={moment().subtract(18, 'year')}
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
          >
            <Select placeholder="Vui lòng chọn giới tính">
              <Select.Option value={true}>Nam</Select.Option>
              <Select.Option value={false}>Nữ</Select.Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="cmnd"
            label="CMND/CCCD:"
            rules={[
              {
                required: true,
                message: 'CMND/CCCD không được để trống!',
              },
            ]}
          >
            <Input placeholder="CMND/CCCD" />
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
            <Input placeholder="Số Điện Thoại" />
          </Form.Item>
          {renderFormItemAddress}
          {renderFormItemHospital}
          {renderFormItemDoctor}
          {renderFormItemDevice}
          {/* {renderFormItemDevice} */}
          {/* <Form.Item
            name="hospital"
            label="Bệnh Viện:"
            rules={[
              {
                required: true,
                message: 'Bệnh Viện không được để trống!',
              },
            ]}
          >
            <Select placeholder="Vui lòng chọn Bệnh Viện">
              <Select.Option value={1}>Bệnh Viện Đại Học Y Dược</Select.Option>
              <Select.Option value={2}>Bệnh Viện Quân Y</Select.Option>
            </Select>
          </Form.Item> */}
          {/* <Form.Item
            name="doctor_id"
            label="Bác Sĩ Phụ Trách:"
            rules={[
              {
                required: true,
                message: 'Bác Sĩ Phụ Trách không được để trống!',
              },
            ]}
          >
            <Select placeholder="Vui lòng chọn Bác Sĩ Phụ Trách">
              <Select.Option value={16}>16 - Nguyễn Văn A</Select.Option>
              <Select.Option value={17}>17 - Nguyễn Văn B</Select.Option>
            </Select>
          </Form.Item> */}
          {/* <Form.Item
            name="device_id"
            label="Vòng Đeo:"
            rules={[
              {
                required: true,
                message: 'Vòng Đeo không được để trống!',
              },
            ]}
          >
            <Select placeholder="Vui lòng chọn Vòng Đeo">
              <Select.Option value={1}>Vòng Đeo Số 1</Select.Option>
              <Select.Option value={2}>Vòng Đeo Số 2</Select.Option>
            </Select>
          </Form.Item> */}
        </Form>
      </Modal>

      {/* Temperature Chart Modal */}

      <Modal
        title="Biểu đồ"
        visible={isVisibleChartModal}
        cancelText="Đóng"
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => {
          setIsVisibleChartModal(false);
        }}
      >
        <Line
          data={{
            labels: ['00:00', '01:00', '02:00', '03:00', '04:00', '05:00'],
            datasets: [
              {
                label: 'Nhiệt Độ (°C)',
                data: [36, 37, 38, 37, 37.5, 38],
                backgroundColor: [
                  'rgba(255, 99, 132, 0.2)',
                  'rgba(54, 162, 235, 0.2)',
                  'rgba(255, 206, 86, 0.2)',
                  'rgba(75, 192, 192, 0.2)',
                  'rgba(153, 102, 255, 0.2)',
                  'rgba(255, 159, 64, 0.2)',
                ],
                borderColor: [
                  'rgba(255, 99, 132, 1)',
                  'rgba(54, 162, 235, 1)',
                  'rgba(255, 206, 86, 1)',
                  'rgba(75, 192, 192, 1)',
                  'rgba(153, 102, 255, 1)',
                  'rgba(255, 159, 64, 1)',
                ],
                borderWidth: 1,
              },
              // {
              //   label: 'Quantity',
              //   data: [47, 52, 67, 58, 9, 50],
              //   backgroundColor: 'orange',
              //   borderColor: 'red',
              // },
            ],
          }}
          height={400}
          width={600}
          // options={{
          //   maintainAspectRatio: false,
          //   scales: {

          //     yAxes: [
          //       {
          //         ticks: {
          //           beginAtZero: true,
          //         },
          //       },
          //     ],
          //   },
          //   legend: {
          //     labels: {
          //       fontSize: 25,
          //     },
          //   },
          // }}
        />
      </Modal>

      {/* Doctor Detail Modal */}
      <Modal
        title="Thông Tin Chi Tiết"
        visible={isDetailModalVisible}
        cancelText="Đóng"
        width={550}
        className="add-doctor-modal-container"
        onCancel={() => setIsDetailModalVisible(false)}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <Descriptions
          bordered
          column={1}
          size="middle"
          style={{ marginTop: 20 }}
          labelStyle={{ width: 200 }}
        >
          <Descriptions.Item label="ID:">{patientDetail.id}</Descriptions.Item>
          <Descriptions.Item label="Họ và tên:">{patientDetail.fullName}</Descriptions.Item>
          <Descriptions.Item label="Giới tính:">{patientDetail.gender}</Descriptions.Item>
          <Descriptions.Item label="Ngày sinh:">{patientDetail.dateOfBirth}</Descriptions.Item>
          <Descriptions.Item label="Địa chỉ:">{patientDetail.address}</Descriptions.Item>
          <Descriptions.Item label="CMND:">{patientDetail.cmnd}</Descriptions.Item>
          <Descriptions.Item label="Email:">{patientDetail.email}</Descriptions.Item>
          <Descriptions.Item label="Số điện thoại:">{patientDetail.mobile}</Descriptions.Item>
          <Descriptions.Item label="Bệnh viện:">{patientDetail.hospital?.name}</Descriptions.Item>
          <Descriptions.Item label="Bác sĩ phụ trách:">
            {patientDetail.doctor?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Vòng Đeo:">{patientDetail.device?.name}</Descriptions.Item>
        </Descriptions>
      </Modal>

      {/* Table */}
      {isLoadingSkeleton ? (
        renderLoadingSkeleton
      ) : (
        <Table
          locale={{
            emptyText: <Empty description="Không có dữ liệu." />,
          }}
          columns={tableColumns}
          dataSource={patientSource}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default ExpertPatientManager;
