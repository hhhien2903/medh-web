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
      title: 'T??n',
      dataIndex: 'fullName',
      key: 'fullName',
    },
    {
      title: 'Ng??y Sinh',
      dataIndex: 'dateOfBirth',
      key: 'dateOfBirth',
      render: (dateOfBirth) => moment(dateOfBirth).format('DD/MM/YYYY'),
    },
    {
      title: 'Gi???i T??nh',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender) => {
        if (gender) {
          return 'Nam';
        }
        return 'N???';
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
      title: 'S??? ??i???n Tho???i',
      dataIndex: 'mobile',
      key: 'mobile',
    },
    // {
    //   title: '?????a Ch???',
    //   dataIndex: 'address',
    //   key: 'address',
    // },
    // {
    //   title: 'B???nh Vi???n',
    //   key: 'hospital',
    //   render: (text, record) => {
    //     return record.hospital?.name;
    //   },
    // },
    // {
    //   title: 'B??c S?? Ph??? Tr??ch',
    //   key: 'doctor',
    //   render: (text, record) => {
    //     return record.doctor?.name;
    //   },
    // },
    // {
    //   title: 'V??ng ??eo',
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
          <Tooltip title="T??c V???">
            <Dropdown
              overlay={
                <Menu>
                  <Menu.Item
                    key="1"
                    icon={<AiOutlineEdit size={15} />}
                    // style={{ color: '#1890FF' }}
                    onClick={() => handleVisibleEditPatient(record)}
                  >
                    S???a Th??ng Tin
                  </Menu.Item>

                  <Menu.Item
                    key="3"
                    icon={<AiOutlineInfoCircle size={15} />}
                    onClick={() => handleVisibleDetailModal(record)}
                  >
                    Xem Chi Ti???t
                  </Menu.Item>
                  <Menu.Item
                    key="4"
                    icon={<RiHistoryFill size={15} />}
                    onClick={() => handleVisibleMedicalRecordHistory(record)}
                  >
                    L???ch S??? B???nh ??n
                  </Menu.Item>
                  <Menu.Item
                    key="2"
                    danger
                    icon={<AiOutlineDelete size={15} />}
                    // style={{ color: '#FF4D4F' }}
                    onClick={() => handleDeletePatient(record)}
                  >
                    Xo??
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
      title: 'X??c Nh???n',
      content: 'B???n c?? ch???c ch???n mu???n xo???',
      okText: 'Xo??',
      okType: 'danger',
      cancelText: 'Hu???',
      onOk: async () => {
        try {
          await patientAPI.deletePatient(record.id);
          message.success('Xo?? B???nh Nh??n th??nh c??ng.', 5);
          getAllPatient();
        } catch (error) {
          message.error('Xo?? B???nh Nh??n kh??ng th??nh c??ng.', 5);
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
        title: 'X??c Nh???n',
        content: 'B???n c?? ch???c ch???n v???i c??c th??ng tin ???? nh???p?',
        okText: 'X??c Nh???n',
        cancelText: 'Kh??ng',
        onOk: async () => {
          try {
            console.log(formValue);
            const result = await patientAPI.updatePatient({
              ...formValue,
              dateOfBirth: moment(formValue.dateOfBirth).toISOString(),
            });
            console.log(result);
            message.success('S???a Th??ng Tin B???nh Nh??n Th??nh C??ng.', 5);
            getAllPatient();
            handleCancelAddPatient();
          } catch (error) {
            console.log(error);
            message.error('S???a Th??ng Tin B???nh Nh??n Kh??ng Th??nh C??ng.', 5);
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
        message.success('T???o B???nh Nh??n th??nh c??ng.', 5);
        getAllPatient();
        handleCancelAddPatient();
      } catch (error) {
        console.log(error);
        message.error('T???o B???nh Nh??n kh??ng th??nh c??ng.', 5);
      }
    });
  };

  const handleVisibleAddPatient = async () => {
    setIsAddEditPatientModalVisible(true);
    setModalUsedFor('addPatient');
    setModalTitle('Th??m B???nh Nh??n');
  };

  const handleVisibleEditPatient = async (record) => {
    setIsAddEditPatientModalVisible(true);
    setModalUsedFor('editPatient');
    setModalTitle('S???a Th??ng Tin B???nh Nh??n');
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
      gender: record.gender ? 'Nam' : 'N???',
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
      gender: record.gender ? 'Nam' : 'N???',
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
          Th??m B???nh Nh??n
        </Button>
        <Input.Search
          allowClear
          enterButton
          loading={loadingSearchButton}
          onSearch={handleSearch}
          placeholder="T??m ki???m"
          style={{ width: 320, marginLeft: 'auto' }}
          size="large"
        />
      </div>
      <Modal
        title={modalTitle}
        visible={isAddEditPatientModalVisible}
        okText="X??c Nh???n"
        cancelText="Hu???"
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
              label="H???:"
              rules={[
                {
                  required: true,
                  message: 'H??? kh??ng ???????c ????? tr???ng!',
                },
                {
                  pattern: vietnameseNameRegex,
                  message: 'H??? kh??ng ????ng ?????nh d???ng',
                },
              ]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <Input placeholder="H???" />
            </Form.Item>
            <Form.Item
              name="name"
              label="T??n:"
              rules={[
                {
                  required: true,
                  message: 'T??n kh??ng ???????c ????? tr???ng!',
                },
                {
                  pattern: vietnameseNameRegex,
                  message: 'T??n kh??ng ????ng ?????nh d???ng',
                },
              ]}
              style={{ display: 'inline-block', width: '50%', marginLeft: '8px' }}
            >
              <Input placeholder="T??n" />
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
                disabledDate={(current) => current > moment()}
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
              label="CMND/CCCD:"
              rules={[
                {
                  required: true,
                  message: 'CMND/CCCD kh??ng ???????c ????? tr???ng!',
                },
              ]}
              style={{ display: 'inline-block', width: 'calc(50% - 8px)' }}
            >
              <Input placeholder="CMND / CCCD:" />
            </Form.Item>
            <Form.Item
              name="mobile"
              label="S??? ??i???n Tho???i:"
              rules={[
                // {
                //   required: true,
                //   message: 'S??? ??i???n tho???i kh??ng ???????c ????? tr???ng!',
                // },
                {
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
                // {
                //   required: true,
                //   message: 'Email kh??ng ???????c ????? tr???ng!',
                // },
                {
                  pattern: emailRegex,
                  message: 'Email kh??ng ????ng ?????nh d???ng',
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
        title="Th??ng Tin Chi Ti???t"
        visible={isDetailModalVisible}
        cancelText="????ng"
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
          <Descriptions.Item label="H??? v?? t??n:">{patientDetail.fullName}</Descriptions.Item>
          <Descriptions.Item label="Gi???i t??nh:">{patientDetail.gender}</Descriptions.Item>
          <Descriptions.Item label="Ng??y sinh:">{patientDetail.dateOfBirth}</Descriptions.Item>
          <Descriptions.Item label="?????a ch???:">{patientDetail.address}</Descriptions.Item>
          <Descriptions.Item label="CMND:">{patientDetail.cmnd}</Descriptions.Item>
          <Descriptions.Item label="Email:">{patientDetail.email}</Descriptions.Item>
          <Descriptions.Item label="S??? ??i???n tho???i:">{patientDetail.mobile}</Descriptions.Item>
        </Descriptions>
      </Modal>

      <Modal
        bodyStyle={{ maxHeight: 620 }}
        title="L???ch S??? B???nh ??n"
        visible={isMedicalRecordHistoryModalVisible}
        cancelText="????ng"
        width={1150}
        className="add-doctor-modal-container"
        onCancel={() => setIsMedicalRecordHistoryModalVisible(false)}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <Descriptions bordered column={1} size="middle" labelStyle={{ width: 200 }}>
          <Descriptions.Item label="ID B???nh Nh??n:">
            {medicalRecordHistoryDetail.id}
          </Descriptions.Item>
          <Descriptions.Item label="T??n B???nh Nh??n:">
            {medicalRecordHistoryDetail.surname + ' ' + medicalRecordHistoryDetail.name}
          </Descriptions.Item>
        </Descriptions>
        <Table
          scroll={{ y: 420 }}
          pagination={false}
          bordered
          locale={{
            emptyText: <Empty description="Kh??ng c?? d??? li???u." />,
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
              title: 'Lo???i B???nh',
              key: 'diseases',
              // width: '10%',
              render: (text, record) => record?.diseases?.name,
            },
            {
              title: 'B???nh Vi???n',
              key: 'hospital',
              render: (text, record) => record?.doctor?.hospital?.name,
            },
            {
              title: 'B??c S?? Ph??? Tr??ch',
              key: 'doctor',
              render: (text, record) => record?.doctor?.name,
            },

            {
              title: 'Ng??y B???t ?????u',
              key: 'createdAt',
              render: (text, record) => moment(record?.createdAt).format('DD/MM/YYYY'),
            },
            {
              title: 'Ng??y K???t Th??c',
              key: 'updatedAd',
              render: (text, record) => moment(record?.createdAt).format('DD/MM/YYYY'),
            },
            {
              title: 'K???t Lu???n',
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
                  <Tooltip title="Xem Bi???u ?????">
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
        title="Bi???u ?????"
        visible={isVisibleChartModal}
        cancelText="????ng"
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
                label: 'Nhi???t ????? (??C)',
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
        <h3>Ch???n Ng??y:</h3>

        <Select
          notFoundContent={
            <Empty
              description="Kh??ng c?? d??? li???u."
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              style={{ height: 50 }}
            />
          }
          style={{ width: '100%' }}
          placeholder="Vui l??ng ch???n ng??y"
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
            emptyText: <Empty description="Kh??ng c?? d??? li???u." />,
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
