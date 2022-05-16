import {
  Button,
  DatePicker,
  Descriptions,
  Dropdown,
  Empty,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Select,
  Skeleton,
  Table,
  Tooltip,
} from 'antd';
import localeVN from 'antd/es/date-picker/locale/vi_VN';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  AiOutlineDelete,
  AiOutlineEdit,
  AiOutlineInfoCircle,
  AiOutlinePlus,
  AiOutlineSetting,
  AiOutlineAreaChart,
} from 'react-icons/ai';
import { RiHistoryFill } from 'react-icons/ri';
import { MdMoreHoriz } from 'react-icons/md';
import patientAPI from '../../../api/patientAPI';
import useFormItemAddress from '../../../components/shared/FormItemAddress/useFormItemAddress';
import useFormItemDevice from '../../../components/shared/FormItemDevice/useFormItemDevice';
import useFormItemDoctor from '../../../components/shared/FormItemDoctor/useFormItemDoctor';
import useFormItemHospital from '../../../components/shared/FormItemHospital/useFormItemHospital';
import useLoadingSkeleton from '../../../components/shared/LoadingSkeleton/useLoadingSkeleton';
import { emailRegex, phoneNumberRegex, vietnameseNameRegex } from '../../../utils/regex';
import './ExpertPatientManager.scss';
import medicalRecordAPI from '../../../api/medicalRecordAPI';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
ChartJS.register(...registerables);

const ExpertPatientManager = () => {
  const [patientSource, setPatientSource] = useState([]);
  const [isAddEditPatientModalVisible, setIsAddEditPatientModalVisible] = useState(false);
  const [formAddEditPatient] = Form.useForm();
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsedFor, setModalUsedFor] = useState('');
  const { renderFormItemHospital } = useFormItemHospital();
  const {
    setIsDisableDistrict,
    setIsDisableWard,
    renderFormItemAddress,
    onCitySelect,
    onDistrictSelect,
  } = useFormItemAddress(formAddEditPatient);
  const { renderFormItemDoctor, setIsDoctorFormItemRequired } = useFormItemDoctor();
  const { renderFormItemDevice, setIsDeviceFormItemRequired } = useFormItemDevice();
  const { renderLoadingSkeleton, setIsLoadingSkeleton, isLoadingSkeleton } = useLoadingSkeleton();
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [isMedicalRecordHistoryModalVisible, setIsMedicalRecordHistoryModalVisible] =
    useState(false);
  const [patientDetail, setPatientDetail] = useState({});
  const [medicalRecordHistoryDetail, setMedicalRecordHistoryDetail] = useState({});
  const [isLoadingSkeletonForm, setIsLoadingSkeletonForm] = useState(false);
  const [loadingSearchButton, setLoadingSearchButton] = useState(false);
  const [isVisibleChartModal, setIsVisibleChartModal] = useState(false);
  const [dateSelectedChart, setDateSelectedChart] = useState(null);
  const [medicalReportSource, setMedicalReportSource] = useState([]);
  const [listTempDateChart, setListTempDateChart] = useState([]);
  const [tempChart, setTempChart] = useState([]);
  const tableColumns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
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
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
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
    // {
    //   title: 'Bệnh Viện',
    //   key: 'hospital',
    //   render: (text, record) => {
    //     return record.hospital?.name;
    //   },
    // },
    // {
    //   title: 'Bác Sĩ Phụ Trách',
    //   key: 'doctor',
    //   render: (text, record) => {
    //     return record.doctor?.name;
    //   },
    // },
    // {
    //   title: 'Vòng Đeo',
    //   dataIndex: 'device',
    //   key: 'device',
    // },

    {
      title: <AiOutlineSetting size={20} style={{ verticalAlign: 'middle' }} />,
      key: 'action',
      width: 70,
      align: 'center',

      render: (record) => {
        return (
          <Tooltip title="Tác Vụ">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="1"
                    icon={<AiOutlineEdit size={15} />}
                    // style={{ color: '#1890FF' }}
                    onClick={() => handleVisibleEditPatient(record)}
                  >
                    Sửa Thông Tin
                  </Menu.Item>

                  <Menu.Item
                    key="3"
                    icon={<AiOutlineInfoCircle size={15} />}
                    onClick={() => handleVisibleDetailModal(record)}
                  >
                    Xem Chi Tiết
                  </Menu.Item>
                  <Menu.Item
                    key="4"
                    icon={<RiHistoryFill size={15} />}
                    onClick={() => handleVisibleMedicalRecordHistory(record)}
                  >
                    Lịch Sử Bệnh Án
                  </Menu.Item>
                  <Menu.Item
                    key="2"
                    danger
                    icon={<AiOutlineDelete size={15} />}
                    // style={{ color: '#FF4D4F' }}
                    onClick={() => handleDeletePatient(record)}
                  >
                    Xoá
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

  const handleDeletePatient = (record) => {
    const confirmDeleteDoctor = Modal.confirm({
      title: 'Xác Nhận',
      content: 'Bạn có chắc chắn muốn xoá?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await patientAPI.deletePatient(record.id);
          message.success('Xoá Bệnh Nhân thành công.', 5);
          getAllPatient();
        } catch (error) {
          message.error('Xoá Bệnh Nhân không thành công.', 5);
          console.log(error);
        }
      },
      onCancel() {
        confirmDeleteDoctor.destroy();
      },
    });
  };

  const handleEditPatient = () => {
    formAddEditPatient.validateFields().then((formValue) => {
      const confirmUpdatePatientModal = Modal.confirm({
        title: 'Xác Nhận',
        content: 'Bạn có chắc chắn với các thông tin đã nhập?',
        okText: 'Xác Nhận',
        cancelText: 'Không',
        onOk: async () => {
          try {
            console.log(formValue);
            const result = await patientAPI.updatePatient({
              ...formValue,
              dateOfBirth: moment(formValue.dateOfBirth).toISOString(),
            });
            console.log(result);
            message.success('Sửa Thông Tin Bệnh Nhân Thành Công.', 5);
            getAllPatient();
            handleCancelAddPatient();
          } catch (error) {
            console.log(error);
            message.error('Sửa Thông Tin Bệnh Nhân Không Thành Công.', 5);
          }
        },
        onCancel() {
          confirmUpdatePatientModal.destroy();
        },
      });
    });
  };
  const handleAddPatient = () => {
    formAddEditPatient.validateFields().then(async (formValue) => {
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
          cityId: formValue.cityId,
          districtId: formValue.districtId,
          wardId: formValue.wardId,
          address: formValue.address,
        };
        console.log(sendData);
        await patientAPI.createPatient(sendData);
        message.success('Tạo Bệnh Nhân thành công.', 5);
        getAllPatient();
        handleCancelAddPatient();
      } catch (error) {
        console.log(error);
        message.error('Tạo Bệnh Nhân không thành công.', 5);
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
    setModalTitle('Sửa Thông Tin Bệnh Nhân');
    setIsDisableDistrict(false);
    setIsDisableWard(false);
    setIsLoadingSkeletonForm(true);
    await onCitySelect(record.cityId);
    await onDistrictSelect(record.districtId);
    setIsLoadingSkeletonForm(false);
    formAddEditPatient.setFieldsValue({
      id: record.id,
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
      address: record.address.split(',')[0],
      hospitalId: record.hospital?.id,
      doctorId: record.doctor?.id,
      deviceId: record.device?.id,
    });
  };

  const handleCancelAddPatient = () => {
    setIsAddEditPatientModalVisible(false);
    formAddEditPatient.resetFields();
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

  const handleVisibleMedicalRecordHistory = async (record) => {
    setIsMedicalRecordHistoryModalVisible(true);
    const medicalRecordByPatientIdResult = await medicalRecordAPI.findByOptions(
      `patientId=${record.id}&treated=true`
    );
    console.log(medicalRecordByPatientIdResult);
    setMedicalRecordHistoryDetail({
      ...record,
      gender: record.gender ? 'Nam' : 'Nữ',
      dateOfBirth: moment(record.dateOfBirth).format('DD/MM/YYYY'),
      medicalReports: [...medicalRecordByPatientIdResult],
    });
  };

  const handleSearch = async (value) => {
    try {
      setLoadingSearchButton(true);
      const searchResult = await patientAPI.searchPatients(value);
      setPatientSource(searchResult);
      setLoadingSearchButton(false);
    } catch (error) {
      setLoadingSearchButton(false);
      console.log(error);
    }
  };

  const handleVisibleChartModal = async (record) => {
    try {
      const medicalReportResult = await medicalRecordAPI.getReportByMedicalRecordId(record.id);
      setMedicalReportSource(medicalReportResult);
      //create array of temperature date not duplicate
      const filteredDates = medicalReportResult
        .map((temp) => moment(temp.date).format('DD/MM/YYYY'))
        .filter((date, index, arrayDate) => arrayDate.indexOf(date) === index);
      setListTempDateChart(filteredDates);
      setDateSelectedChart(null);
      setIsVisibleChartModal(true);
    } catch (error) {
      console.log(error);
    }
  };

  const handleChangeDateChart = (selectedDate) => {
    setDateSelectedChart(selectedDate);
    const temp = medicalReportSource.filter(
      (medicalReport) => moment(medicalReport.date).format('DD/MM/YYYY') === selectedDate
    );
    setTempChart(temp);
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
          allowClear
          enterButton
          loading={loadingSearchButton}
          onSearch={handleSearch}
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
        className="add-doctor-modal-container"
        onCancel={handleCancelAddPatient}
        bodyStyle={{ overflowY: 'auto', height: 600 }}
        onOk={() => {
          if (modalUsedFor === 'addPatient') {
            return handleAddPatient();
          } else {
            return handleEditPatient();
          }
        }}
      >
        {isLoadingSkeletonForm ? (
          <Skeleton active loading={isLoadingSkeletonForm} />
        ) : (
          <Form layout="vertical" className="add-doctor-form" form={formAddEditPatient}>
            <Form.Item name="id" noStyle>
              <Input type="hidden" />
            </Form.Item>
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
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
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
              style={{ display: 'inline-block', width: '50%', marginLeft: '8px' }}
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
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <DatePicker
                disabledDate={(current) => current > moment()}
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
              label="CMND/CCCD:"
              rules={[
                {
                  required: true,
                  message: 'CMND/CCCD không được để trống!',
                },
              ]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <Input placeholder="CMND / CCCD:" />
            </Form.Item>
            <Form.Item
              name="mobile"
              label="Số Điện Thoại:"
              rules={[
                // {
                //   required: true,
                //   message: 'Số điện thoại không được để trống!',
                // },
                {
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
                // {
                //   required: true,
                //   message: 'Email không được để trống!',
                // },
                {
                  pattern: emailRegex,
                  message: 'Email không đúng định dạng',
                },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>

            {renderFormItemAddress}
          </Form>
        )}
      </Modal>

      {/* Patient Detail Modal */}
      <Modal
        title="Thông Tin Chi Tiết"
        visible={isDetailModalVisible}
        cancelText="Đóng"
        width={700}
        style={{ top: 50 }}
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
        </Descriptions>
      </Modal>

      <Modal
        bodyStyle={{ maxHeight: 620 }}
        title="Lịch Sử Bệnh Án"
        visible={isMedicalRecordHistoryModalVisible}
        cancelText="Đóng"
        width={1150}
        className="add-doctor-modal-container"
        onCancel={() => setIsMedicalRecordHistoryModalVisible(false)}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <Descriptions bordered column={1} size="middle" labelStyle={{ width: 200 }}>
          <Descriptions.Item label="ID Bệnh Nhân:">
            {medicalRecordHistoryDetail.id}
          </Descriptions.Item>
          <Descriptions.Item label="Tên Bệnh Nhân:">
            {medicalRecordHistoryDetail.surname + ' ' + medicalRecordHistoryDetail.name}
          </Descriptions.Item>
        </Descriptions>
        <Table
          scroll={{ y: 420 }}
          pagination={false}
          bordered
          locale={{
            emptyText: <Empty description="Không có dữ liệu." />,
          }}
          dataSource={medicalRecordHistoryDetail?.medicalReports}
          columns={[
            {
              title: 'STT',
              key: 'index',
              width: '7%',
              align: 'center',
              render: (text, record) =>
                medicalRecordHistoryDetail?.medicalReports.indexOf(record) + 1,
            },
            {
              title: 'Loại Bệnh',
              key: 'diseases',
              // width: '10%',
              render: (text, record) => record?.diseases?.name,
            },
            {
              title: 'Bệnh Viện',
              key: 'hospital',
              render: (text, record) => record?.doctor?.hospital?.name,
            },
            {
              title: 'Bác Sĩ Phụ Trách',
              key: 'doctor',
              render: (text, record) => record?.doctor?.name,
            },

            {
              title: 'Ngày Bắt Đầu',
              key: 'createdAt',
              render: (text, record) => moment(record?.createdAt).format('DD/MM/YYYY'),
            },
            {
              title: 'Ngày Kết Thúc',
              key: 'updatedAd',
              render: (text, record) => moment(record?.createdAt).format('DD/MM/YYYY'),
            },
            {
              title: 'Kết Luận',
              key: 'conclude',
              render: (text, record) => record?.conclude,
            },
            {
              title: <AiOutlineSetting size={20} style={{ verticalAlign: 'middle' }} />,
              key: 'tool',
              width: '6%',

              align: 'center',
              render: (record) => {
                return (
                  <Tooltip title="Xem Biểu Đồ">
                    <Button
                      onClick={() => handleVisibleChartModal(record)}
                      icon={
                        <AiOutlineAreaChart
                          style={{
                            verticalAlign: 'middle',
                            marginBottom: '2px',
                          }}
                        />
                      }
                    />
                  </Tooltip>
                );
              },
            },
          ]}
        ></Table>
      </Modal>

      {/* Temperature Chart Modal */}
      <Modal
        // bodyStyle={{ maxHeight: 500, top: 20 }}
        title="Biểu đồ"
        visible={isVisibleChartModal}
        cancelText="Đóng"
        okButtonProps={{ style: { display: 'none' } }}
        onCancel={() => {
          setIsVisibleChartModal(false);
          setTempChart([]);
          setListTempDateChart([]);
        }}
        width={600}
        style={{ top: 30 }}
      >
        <Line
          data={{
            labels: tempChart?.map((temp) => temp.hour),
            datasets: [
              {
                label: 'Nhiệt Độ (°C)',
                data: tempChart?.map((temp) => temp.temperature),
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
            ],
          }}
          height={400}
          width={600}
        />
        <h3>Chọn Ngày:</h3>

        <Select
          notFoundContent={
            <Empty
              description="Không có dữ liệu."
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ height: 50 }}
            />
          }
          style={{ width: '100%' }}
          placeholder="Vui lòng chọn ngày"
          onChange={handleChangeDateChart}
          value={dateSelectedChart}
        >
          {listTempDateChart.map((tempDate) => {
            return (
              <Select.Option key={tempDate} value={tempDate}>
                {tempDate}
              </Select.Option>
            );
          })}
        </Select>
      </Modal>

      {/* Table */}
      {isLoadingSkeleton ? (
        renderLoadingSkeleton
      ) : (
        <Table
          scroll={{ y: 705 }}
          //scroll={{ y: 705 }}
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
