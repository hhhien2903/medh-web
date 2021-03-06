import {
  Button,
  Descriptions,
  Dropdown,
  Empty,
  Form,
  Input,
  Menu,
  message,
  Modal,
  Table,
  Tag,
  Select,
  Tooltip,
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  AiOutlineFileDone,
  AiOutlineInfoCircle,
  AiOutlinePlus,
  AiOutlineAreaChart,
  AiOutlineEdit,
  AiOutlineSetting,
} from 'react-icons/ai';
import { BiRefresh } from 'react-icons/bi';
import { MdMoreHoriz } from 'react-icons/md';
import medicalRecordAPI from '../../../api/medicalRecordAPI';
import useFormItemDevice from '../../../components/shared/FormItemDevice/useFormItemDevice';
import useFormItemDisease from '../../../components/shared/FormItemDisease/useFormItemDisease';
import useFormItemDoctor from '../../../components/shared/FormItemDoctor/useFormItemDoctor';
import useFormItemHospital from '../../../components/shared/FormItemHospital/useFormItemHospital';
import useFormItemPatient from '../../../components/shared/FormItemPatient/useFormItemPatient';
import useLoadingSkeleton from '../../../components/shared/LoadingSkeleton/useLoadingSkeleton';
import getListFilterHospital from '../../../utils/ListFilterHospital';
import './ExpertMedicalRecordManager.scss';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS, registerables } from 'chart.js';
import patientAPI from '../../../api/patientAPI';
import deviceAPI from '../../../api/deviceAPI';
import AsyncSelect from '../../../components/shared/AsyncSelect';
import doctorAPI from '../../../api/doctorAPI';
ChartJS.register(...registerables);

const ExpertMedicalRecordManager = () => {
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [medicalRecordDetail, setMedicalRecordDetail] = useState(null);
  const [medicalRecordSource, setMedicalRecordSource] = useState([]);
  const [isAddEditMedicalRecordModalVisible, setAddEditMedicalRecordModalVisible] = useState(false);
  const [formAddEditMedicalRecord] = Form.useForm();
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsedFor, setModalUsedFor] = useState('');
  const { renderLoadingSkeleton, setIsLoadingSkeleton, isLoadingSkeleton } = useLoadingSkeleton();
  // const { renderFormItemDoctor, setIsFormItemDoctorDisabled, getAllDoctorByHospitalId } =
  //   useFormItemDoctor();
  const { renderFormItemDisease } = useFormItemDisease();
  // const { renderFormItemPatient, getAllPatientIsTreated, setPatientSource, patientSource } =
  //   useFormItemPatient();
  const {
    renderFormItemDevice,
    setIsFormItemDeviceDisabled,
    getAllUnusedDevicesByHospitalId,
    setDeviceSource,
  } = useFormItemDevice();
  const { renderFormItemHospital } = useFormItemHospital();
  const [listFilterHospital, setListFilterHospital] = useState([]);
  const [dateSelectedChart, setDateSelectedChart] = useState(null);
  const [listTempDateChart, setListTempDateChart] = useState([]);
  const [tempChart, setTempChart] = useState([]);
  const [medicalReportSource, setMedicalReportSource] = useState([]);
  const [patientNameChart, setPatientNameChart] = useState(null);
  const [isVisibleChartModal, setIsVisibleChartModal] = useState(false);
  const [isFormItemDoctorDisabled, setIsFormItemDoctorDisabled] = useState(false);
  const [isFormItemPatientDisabled, setIsFormItemPatientDisabled] = useState(false);
  const [loadingSearchButton, setLoadingSearchButton] = useState(false);
  const [selectSearchType, setSelectSearchType] = useState('patient');

  const [isLoadingRefreshTempIcon, setIsLoadingRefreshTempIcon] = useState(false);

  const tableColumns = [
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text, record) => medicalRecordSource.indexOf(record) + 1,
    },
    {
      title: 'T??n B???nh Nh??n',
      key: 'patient',
      render: (text, record) => {
        return record.patient?.surname + ' ' + record.patient?.name;
      },
    },
    {
      title: 'B??c S?? Ph??? Tr??ch',
      key: 'patient',
      render: (text, record) => {
        return record.doctor?.name;
      },
    },
    // {
    //   title: 'Chu???n ??o??n',
    //   key: 'diagnose',
    //   dataIndex: 'diagnose',
    // },
    {
      title: 'B???nh',
      key: 'diseases',
      render: (text, record) => {
        return record.diseases?.name;
      },
    },
    {
      title: 'Thi???t B??? ??ang ??eo',
      key: 'device',
      render: (text, record) => {
        if (record.treated) {
          return 'Kh??ng c??.';
        }
        return record.medicalRecordDevice?.device?.name;
      },
    },
    {
      title: 'B???nh Vi???n',
      key: 'hospital',
      filters: listFilterHospital,
      onFilter: (value, record) => record.doctor?.hospital?.id === value,
      render: (text, record) => {
        return record.doctor?.hospital?.name;
      },
    },
    // {
    //   title: 'Ng??y L???p B???nh ??n',
    //   key: 'createdAt',
    //   render: (text, record) => {
    //     return moment(record.createdAt).format('DD/MM/YYYY');
    //   },
    // },
    // {
    //   title: 'Ng??y K???t Th??c B???nh ??n',
    //   key: 'updatedAt',
    //   render: (text, record) => {
    //     if (record.treated) {
    //       return moment(record.updatedAt).format('DD/MM/YYYY');
    //     } else {
    //       return 'B???nh ??n ch??a k???t th??c.';
    //     }
    //   },
    // },

    {
      title: 'Tr???ng Th??i',
      key: 'treated',
      align: 'center',
      width: 150,
      filters: [
        {
          text: 'K???t Th??c ??i???u Tr???',
          value: true,
        },
        {
          text: '??ang ??i???u Tr???',
          value: false,
        },
      ],
      defaultFilteredValue: ['false'],
      onFilter: (value, record) => record.treated === value,
      render: (text, record) => {
        return record.treated ? (
          <Tag color="gray" style={{ width: '120px' }}>
            K???t Th??c ??i???u Tr???
          </Tag>
        ) : (
          <Tag color="green" style={{ width: '120px' }}>
            ??ang ??i???u Tr???
          </Tag>
        );
      },
    },

    {
      title: <AiOutlineSetting size={20} style={{ verticalAlign: 'middle' }} />,
      key: 'action',
      align: 'center',
      width: 60,
      render: (record) => {
        return (
          <Tooltip title="T??c V???">
            <Dropdown
              overlay={
                <Menu>
                  {!record.treated && (
                    <Menu.Item
                      key="1"
                      icon={<AiOutlineEdit size={15} />}
                      // style={{ color: '#1890FF' }}
                      onClick={() => handleVisibleEditMedicalRecord(record)}
                    >
                      S???a th??ng tin
                    </Menu.Item>
                  )}
                  <Menu.Item
                    key="3"
                    icon={<AiOutlineInfoCircle size={15} />}
                    onClick={() => handleVisibleDetailMedicalRecord(record)}
                  >
                    Xem chi ti???t
                  </Menu.Item>
                  <Menu.Item
                    key="5"
                    // style={{ color: '#034C3C' }}
                    icon={<AiOutlineAreaChart size={15} />}
                    onClick={() => handleVisibleChartModal(record)}
                  >
                    Xem bi???u ?????
                  </Menu.Item>
                  {!record.treated && (
                    <Menu.Item
                      key="4"
                      // style={{ color: '#ee6123' }}
                      danger
                      icon={<AiOutlineFileDone size={15} />}
                      onClick={() => handleVisibleEndFollowMedicalRecord(record)}
                    >
                      K???t Th??c ??i???u Tr???
                    </Menu.Item>
                  )}
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
  const getAllMedicalRecord = async () => {
    try {
      setIsLoadingSkeleton(true);
      const medicalRecordSourceResult = await medicalRecordAPI.getAllMedicalRecord();
      setMedicalRecordSource(medicalRecordSourceResult);
      setIsLoadingSkeleton(false);
      console.log(medicalRecordSourceResult);
    } catch (error) {
      setIsLoadingSkeleton(false);
      console.log(error);
    }
  };

  useEffect(() => {
    getAllMedicalRecord();
    getListFilterHospital().then((listFilterHospital) => setListFilterHospital(listFilterHospital));
  }, []);

  const handleDeleteMedicalRecord = (record) => {
    const confirmDeleteMedicalRecord = Modal.confirm({
      title: 'X??c Nh???n',
      content: 'B???n c?? ch???c ch???n mu???n xo???',
      okText: 'Xo??',
      okType: 'danger',
      cancelText: 'Hu???',
      onOk: async () => {
        try {
          await medicalRecordAPI.deleteMedicalRecord(record.id);
          confirmDeleteMedicalRecord.destroy();
          message.success('Xo?? th??nh c??ng', 5);
          getAllMedicalRecord();
        } catch (error) {
          console.log(error);
          message.success('Xo?? kh??ng th??nh c??ng', 5);
        }
      },
      onCancel() {
        confirmDeleteMedicalRecord.destroy();
      },
    });
  };

  const handleEditMedicalRecord = () => {
    formAddEditMedicalRecord.validateFields().then((formValue) => {
      const confirmUpdateMedicalRecordModal = Modal.confirm({
        title: 'X??c Nh???n',
        content: 'B???n c?? ch???c ch???n v???i c??c th??ng tin ???? nh???p?',
        okText: 'X??c Nh???n',
        cancelText: 'Kh??ng',
        onOk: async () => {
          try {
            await medicalRecordAPI.updateMedicalRecord({
              ...formValue,
              treated: false,
              doctorId: formValue.doctorId.value,
              patientId: formValue.patientId.value,
            });
            message.success('S???a B???nh ??n Th??nh C??ng.', 5);
            getAllMedicalRecord();
            handleCancelMedicalRecordModal();
          } catch (error) {
            console.log(error);
            message.error('S???a B???nh ??n Kh??ng Th??nh C??ng.', 5);
          }
        },
        onCancel() {
          confirmUpdateMedicalRecordModal.destroy();
        },
      });
    });
  };
  const handleAddMedicalRecord = () => {
    formAddEditMedicalRecord.validateFields().then(async (formValue) => {
      try {
        await medicalRecordAPI.createMedicalRecord({
          ...formValue,
          treated: false,
          doctorId: formValue.doctorId.value,
          patientId: formValue.patientId.value,
        });
        message.success('T???o B???nh ??n th??nh c??ng.', 5);
        getAllMedicalRecord();
        handleCancelMedicalRecordModal();
      } catch (error) {
        console.log(error);
        message.error('T???o B???nh ??n kh??ng th??nh c??ng.', 5);
      }
    });
  };

  const handleEndFollowMedicalRecord = () => {
    formAddEditMedicalRecord.validateFields().then(async (formValue) => {
      const confirmEndFollowMedicalRecordModal = Modal.confirm({
        title: 'X??c Nh???n',
        content: 'B???n c?? ch???c ch???n mu???n k???t th??c ??i???u tr??? B???nh ??n n??y?',
        okText: 'X??c Nh???n',
        cancelText: 'Kh??ng',
        onOk: async () => {
          console.log(formValue);
          try {
            await medicalRecordAPI.endFollowMedicalRecord(formValue);
            message.success('Thao T??c Th??nh C??ng.', 5);
            getAllMedicalRecord();
            handleCancelMedicalRecordModal();
          } catch (error) {
            console.log(error);
            message.error('Thao T??c Kh??ng Th??nh C??ng.', 5);
          }
        },
        onCancel() {
          confirmEndFollowMedicalRecordModal.destroy();
        },
      });
    });
  };

  const handleVisibleAddMedicalRecord = async () => {
    // await getAllPatientIsTreated();
    formAddEditMedicalRecord.setFieldsValue({ treated: false });
    setAddEditMedicalRecordModalVisible(true);
    setModalUsedFor('addMedicalRecord');
    setModalTitle('Th??m B???nh ??n');
    setIsFormItemDeviceDisabled(true);
    setIsFormItemDoctorDisabled(true);
    setIsFormItemPatientDisabled(false);
  };

  const handleVisibleEndFollowMedicalRecord = async (record) => {
    setAddEditMedicalRecordModalVisible(true);
    setModalUsedFor('endFollowMedicalRecord');
    setModalTitle('K???t Th??c B???nh ??n');
    formAddEditMedicalRecord.setFieldsValue({ medicalRecordId: record.id });
  };

  const handleVisibleEditMedicalRecord = async (record) => {
    try {
      setIsFormItemPatientDisabled(true);
      setModalUsedFor('editMedicalRecord');
      setModalTitle('S???a Th??ng Tin B???nh ??n');
      await formAddEditMedicalRecord.setFieldsValue({
        id: record?.id,
        diagnose: record?.diagnose,
        patientId: {
          label: record.patient.surname + ' ' + record.patient.name,
          value: record.patient.id,
        },
        doctorId: {
          label: record.doctor?.name,
          value: record.doctor?.id,
        },
        diseasesId: record.diseases?.id,
        deviceId: record.medicalRecordDevice?.device?.id,
        treated: record?.treated,
        conclude: record?.conclude,
        hospitalId: record.doctor?.hospital?.id,
      });

      setIsFormItemDeviceDisabled(false);
      setIsFormItemDoctorDisabled(false);
      const deviceSourceResult = await deviceAPI.getAllUnusedDevicesByHospitalId(
        record.doctor?.hospital?.id
      );
      deviceSourceResult.unshift(record.medicalRecordDevice?.device);
      setDeviceSource(deviceSourceResult);
      setAddEditMedicalRecordModalVisible(true);
    } catch (error) {
      setDeviceSource([record.medicalRecordDevice?.device]);
      setAddEditMedicalRecordModalVisible(true);
      console.log(error);
    }
  };

  const handleCancelMedicalRecordModal = () => {
    setAddEditMedicalRecordModalVisible(false);
    formAddEditMedicalRecord.resetFields();
    setIsFormItemDeviceDisabled(true);
    setIsFormItemDoctorDisabled(true);
    setIsFormItemPatientDisabled(false);
  };

  const onChangeFormItem = async (fieldData) => {
    if (fieldData.hospitalId) {
      formAddEditMedicalRecord.resetFields(['deviceId', 'doctorId']);
      // await getAllDoctorByHospitalId(fieldData.hospitalId);
      setIsFormItemDeviceDisabled(false);
      setIsFormItemDoctorDisabled(false);
      await getAllUnusedDevicesByHospitalId(fieldData.hospitalId);
    }
  };

  const handleVisibleDetailMedicalRecord = (record) => {
    setIsDetailModalVisible(true);
    setMedicalRecordDetail(record);
  };

  const handleVisibleChartModal = async (record) => {
    try {
      const medicalReportResult = await medicalRecordAPI.getReportByMedicalRecordId(record.id);
      setMedicalReportSource(medicalReportResult);
      setPatientNameChart(record.patient.fullName);

      //create array of temperature date not duplicate
      const filteredDates = medicalReportResult
        .map((temp) => moment(temp.date).format('DD/MM/YYYY'))
        .filter((date, index, arrayDate) => arrayDate.indexOf(date) === index);
      setListTempDateChart(filteredDates);
      setDateSelectedChart(null);
      setIsVisibleChartModal(true);
      setPatientNameChart(`${record?.patient.surname} ${record?.patient.name}`);
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

  const fetchPatient = async (search) => {
    try {
      if (!search) {
        return [];
      }
      const patientSearchResult = await patientAPI.searchAllPatients(true, search);
      console.log(patientSearchResult);
      return patientSearchResult;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const fetchDoctor = async (search) => {
    try {
      if (!search) {
        return [];
      }
      const doctorSearchResult = await doctorAPI.searchDoctorByHospitalIdText(
        formAddEditMedicalRecord.getFieldValue('hospitalId'),
        search
      );

      return doctorSearchResult;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const handleSearch = async (value) => {
    try {
      setLoadingSearchButton(true);
      const searchResult = await medicalRecordAPI.searchMedicalRecord(
        value
        // selectSearchType !== 'all' ? `&option=${selectSearchType}` : null
      );
      setMedicalRecordSource(searchResult);
      setLoadingSearchButton(false);
    } catch (error) {
      setLoadingSearchButton(false);
      console.log(error);
    }
  };

  const handleRefreshMedicalRecordDetail = async () => {
    setIsLoadingRefreshTempIcon(true);
    try {
      const result = await medicalRecordAPI.findByMedicalRecordId(medicalRecordDetail.id);
      console.log(result);
      setMedicalRecordDetail(result);
      setIsLoadingRefreshTempIcon(false);
    } catch (error) {
      setIsLoadingRefreshTempIcon(false);
      console.log(error);
    }
  };

  let intervalRefreshMedicalRecordDetail;
  useEffect(() => {
    if (medicalRecordDetail) {
      intervalRefreshMedicalRecordDetail = setInterval(() => {
        refreshMedicalRecordDetail();
      }, 30000);
    }

    const refreshMedicalRecordDetail = async () => {
      setIsLoadingRefreshTempIcon(true);
      try {
        const result = await medicalRecordAPI.findByMedicalRecordId(medicalRecordDetail.id);
        console.log(result);
        setMedicalRecordDetail(result);
        setIsLoadingRefreshTempIcon(false);
      } catch (error) {
        setIsLoadingRefreshTempIcon(false);

        console.log(error);
      }
    };

    return () => clearInterval(intervalRefreshMedicalRecordDetail);
  }, [medicalRecordDetail]);

  return (
    <div className="medical-record-manager-container">
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
          onClick={handleVisibleAddMedicalRecord}
        >
          Th??m B???nh ??n
        </Button>

        <div>
          <Input.Group>
            {/* <Select
              dropdownMatchSelectWidth={false}
              onChange={(value) => setSelectSearchType(value)}
              value={selectSearchType}
              size="large"
            >
              <Select.Option value="patient">T??n B???nh Nh??n</Select.Option>
              <Select.Option value="doctor">T??n B??c S??</Select.Option>
              <Select.Option value="disease">T??n B???nh</Select.Option>
              <Select.Option value="device">T??n Thi???t B???</Select.Option>
              <Select.Option value="hospital">T??n B???nh Vi???n</Select.Option>
              <Select.Option value="all">T???t C???</Select.Option>
            </Select> */}
            <Input.Search
              allowClear
              enterButton
              loading={loadingSearchButton}
              onSearch={handleSearch}
              placeholder="T??m ki???m"
              style={{ width: 320 }}
              size="large"
            />
          </Input.Group>
        </div>
      </div>
      <Modal
        title={modalTitle}
        visible={isAddEditMedicalRecordModalVisible}
        okText="X??c Nh???n"
        cancelText="Hu???"
        className="add-edit-medical-record-modal-container"
        onCancel={handleCancelMedicalRecordModal}
        // bodyStyle={{ overflowY: 'scroll' }}
        onOk={() => {
          // if (modalUsedFor === 'addMedicalRecord') {
          //   return handleAddMedicalRecord();
          // } else {
          //   return handleEditMedicalRecord();
          // }
          switch (modalUsedFor) {
            case 'addMedicalRecord':
              return handleAddMedicalRecord();
            case 'editMedicalRecord':
              return handleEditMedicalRecord();
            case 'endFollowMedicalRecord':
              return handleEndFollowMedicalRecord();
            default:
              break;
          }
        }}
      >
        <Form
          layout="vertical"
          className="add-edit-medical-record-form"
          form={formAddEditMedicalRecord}
          // onFieldsChange={onChangeFormItem}
          onValuesChange={onChangeFormItem}
          on
        >
          <Form.Item name="id" noStyle>
            <Input type="hidden"></Input>
          </Form.Item>
          {/* <Form.Item
              name="name"
              label="T??n B???nh Vi???n:"
              rules={[
                {
                  required: true,
                  message: 'T??n B???nh Vi???n kh??ng ???????c ????? tr???ng!',
                },
                // {
                //   pattern: vietnameseNameRegex,
                //   message: 'T??n B???nh Vi???n kh??ng ????ng ?????nh d???ng',
                // },
              ]}
            >
              <Input placeholder="T??n B???nh Vi???n" />
            </Form.Item> */}
          {modalUsedFor === 'editMedicalRecord' || modalUsedFor === 'addMedicalRecord' ? (
            <>
              {/* {renderFormItemPatient} */}
              <Form.Item
                name="patientId"
                label="B???nh Nh??n:"
                rules={[
                  {
                    required: true,
                    message: 'B???nh Nh??n kh??ng ???????c ????? tr???ng!',
                  },
                ]}
              >
                <AsyncSelect
                  disabled={isFormItemPatientDisabled}
                  placeholder="Vui l??ng ch???n B???nh Nh??n"
                  fetchOptions={fetchPatient}
                  dropdownRender={(node) => node}
                  findContentLabel="Nh???p T??n, S??T ho???c CMND ????? t??m ki???m."
                  optionLabelKey="fullName"
                  optionValueKey="id"
                />
              </Form.Item>
              {renderFormItemHospital}
              <Form.Item
                name="doctorId"
                label="B??c S??:"
                rules={[
                  {
                    required: true,
                    message: 'B??c S?? kh??ng ???????c ????? tr???ng!',
                  },
                ]}
              >
                <AsyncSelect
                  disabled={isFormItemDoctorDisabled}
                  placeholder="Vui l??ng ch???n B??c S??"
                  fetchOptions={fetchDoctor}
                  dropdownRender={(node) => node}
                  findContentLabel="Nh???p T??n, S??T ho???c CMND ????? t??m ki???m."
                  optionValueKey="id"
                  optionLabelKey="name"
                />
              </Form.Item>
              {/* {renderFormItemDoctor} */}
              {renderFormItemDisease}
              {renderFormItemDevice}

              <Form.Item
                name="diagnose"
                label="Chu???n ??o??n:"
                rules={[
                  {
                    required: true,
                    message: 'Chu???n ??o??n kh??ng ???????c ????? tr???ng!',
                  },
                ]}
              >
                <Input.TextArea placeholder="Chu???n ??o??n" rows={3} />
                {/* <Input  /> */}
              </Form.Item>
            </>
          ) : (
            <></>
          )}

          {modalUsedFor === 'endFollowMedicalRecord' && (
            <>
              <Form.Item label="M?? B???nh ??n:" name="medicalRecordId">
                <Input disabled={true} placeholder="M?? B???nh ??n:"></Input>
              </Form.Item>
              <Form.Item
                name="conclude"
                rules={[
                  {
                    required: true,
                    message: 'K???t Lu???n kh??ng ???????c ????? tr???ng!',
                  },
                ]}
                label="K???t Lu???n:"
              >
                <Input.TextArea rows={3} placeholder="K???t Lu???n:" />
              </Form.Item>
            </>
          )}
        </Form>
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
        <h3>T??n B???nh Nh??n: {patientNameChart}</h3>
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

      {/* Modal Detail Medical Record */}
      <Modal
        title="Th??ng Tin Chi Ti???t"
        visible={isDetailModalVisible}
        cancelText="????ng"
        width={750}
        style={{ top: '20px' }}
        // className="add-doctor-modal-container"
        onCancel={() => {
          setIsDetailModalVisible(false);
          setMedicalRecordDetail(null);
        }}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <Descriptions
          bordered
          column={1}
          size="middle"
          // style={{ marginTop: 20 }}
          labelStyle={{ width: 230 }}
        >
          <Descriptions.Item label="ID B???nh ??n:">{medicalRecordDetail?.id}</Descriptions.Item>
          <Descriptions.Item label="T??n B???nh Nh??n:">
            {medicalRecordDetail?.patient?.surname + ' ' + medicalRecordDetail?.patient?.name}
          </Descriptions.Item>
          <Descriptions.Item label="B???nh Vi???n:">
            {medicalRecordDetail?.doctor?.hospital?.name}
          </Descriptions.Item>
          <Descriptions.Item label="B??c S?? Ph??? Tr??ch:">
            {medicalRecordDetail?.doctor?.name}
          </Descriptions.Item>
          {!medicalRecordDetail?.treated && (
            <>
              <Descriptions.Item label="Thi???t B???:">
                {medicalRecordDetail?.medicalRecordDevice?.device?.name}
              </Descriptions.Item>
              <Descriptions.Item label="MAC Thi???t B???:">
                {medicalRecordDetail?.medicalRecordDevice?.device?.macAddress}
              </Descriptions.Item>
              <Descriptions.Item label="Nhi???t ?????:">
                {medicalRecordDetail?.medicalRecordDevice?.device?.temp ? (
                  <Tooltip
                    title={`${(
                      medicalRecordDetail?.medicalRecordDevice?.device?.temp * 1.8 +
                      32
                    ).toFixed(2)} ??F`}
                  >
                    {`${medicalRecordDetail?.medicalRecordDevice?.device?.temp?.toFixed(2)} ??C`}
                  </Tooltip>
                ) : (
                  '??ang c???p nh???t...'
                )}
                <Tooltip title="C???p nh???t nhi???t ?????">
                  <BiRefresh
                    size={25}
                    style={{
                      verticalAlign: 'bottom',
                      marginLeft: 5,
                      cursor: 'pointer',
                    }}
                    onClick={() => {
                      handleRefreshMedicalRecordDetail();
                    }}
                    className={
                      isLoadingRefreshTempIcon
                        ? 'refresh-icon-temp-loading-on'
                        : 'refresh-icon-temp-loading-off'
                    }
                    color="#1890FF"
                  />
                </Tooltip>
              </Descriptions.Item>
            </>
          )}

          <Descriptions.Item label="B???nh:">{medicalRecordDetail?.diseases?.name}</Descriptions.Item>
          <Descriptions.Item label="Chu???n ??o??n:">{medicalRecordDetail?.diagnose}</Descriptions.Item>
          <Descriptions.Item label="Ng??y L???p B???nh ??n:">
            {moment(medicalRecordDetail?.createdAt).format('DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Ng??y K???t Th??c B???nh ??n:">
            {medicalRecordDetail?.treated
              ? moment(medicalRecordDetail?.updatedAt).format('DD/MM/YYYY')
              : 'B???nh ??n ch??a k???t th??c.'}
          </Descriptions.Item>
          <Descriptions.Item label="T??nh Tr???ng B???nh ??n:">
            {medicalRecordDetail?.treated ? 'K???t Th??c ??i???u Tr???' : '??ang ??i???u Tr???'}
          </Descriptions.Item>
          {medicalRecordDetail?.treated && (
            <Descriptions.Item label="K???t Lu???n:">
              {medicalRecordDetail?.conclude ? medicalRecordDetail?.conclude : 'Kh??ng c??.'}
            </Descriptions.Item>
          )}
        </Descriptions>
      </Modal>
      {isLoadingSkeleton ? (
        renderLoadingSkeleton
      ) : (
        <Table
          scroll={{ y: 705 }}
          locale={{
            filterReset: '?????t l???i',
            emptyText: <Empty description="Kh??ng c?? d??? li???u." />,
          }}
          columns={tableColumns}
          dataSource={medicalRecordSource}
          pagination={{ pageSize: 10 }}
        />
      )}
    </div>
  );
};

export default ExpertMedicalRecordManager;
