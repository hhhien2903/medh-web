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
} from 'antd';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import {
  AiOutlineFileDone,
  AiOutlineInfoCircle,
  AiOutlinePlus,
  AiOutlineAreaChart,
} from 'react-icons/ai';
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
ChartJS.register(...registerables);

const ExpertMedicalRecordManager = () => {
  const [isDetailModalVisible, setIsDetailModalVisible] = useState(false);
  const [medicalRecordDetail, setMedicalRecordDetail] = useState({});
  const [medicalRecordSource, setMedicalRecordSource] = useState([]);
  const [isAddEditMedicalRecordModalVisible, setAddEditMedicalRecordModalVisible] = useState(false);
  const [formAddEditMedicalRecord] = Form.useForm();
  const [modalTitle, setModalTitle] = useState('');
  const [modalUsedFor, setModalUsedFor] = useState('');
  const { renderLoadingSkeleton, setIsLoadingSkeleton, isLoadingSkeleton } = useLoadingSkeleton();
  const { renderFormItemDoctor, setIsFormItemDoctorDisabled, getAllDoctorByHospitalId } =
    useFormItemDoctor();
  const { renderFormItemDisease, setIsFormItemDiseaseDisabled } = useFormItemDisease();
  const { renderFormItemPatient, setIsFormItemPatientDisabled, getAllPatientIsTreated } =
    useFormItemPatient();
  const { renderFormItemDevice, setIsFormItemDeviceDisabled, getAllUnusedDevicesByHospitalId } =
    useFormItemDevice();
  const { renderFormItemHospital } = useFormItemHospital();
  const [listFilterHospital, setListFilterHospital] = useState([]);
  const [isDisabledConcludeFormItem, setIsDisabledConcludeFormItem] = useState(true);
  const [dateSelectedChart, setDateSelectedChart] = useState(null);
  const [listTempDateChart, setListTempDateChart] = useState([]);
  const [tempChart, setTempChart] = useState([]);
  const [medicalReportSource, setMedicalReportSource] = useState([]);
  const [patientNameChart, setPatientNameChart] = useState(null);
  const [isVisibleChartModal, setIsVisibleChartModal] = useState(false);
  const tableColumns = [
    // {
    //   title: 'ID',
    //   dataIndex: 'id',
    //   key: 'id',
    // },
    {
      title: 'STT',
      key: 'index',
      width: 60,
      align: 'center',
      render: (text, record) => medicalRecordSource.indexOf(record) + 1,
    },
    {
      title: 'Tên Bệnh Nhân',
      key: 'patient',
      render: (text, record) => {
        return record.patient?.surname + ' ' + record.patient?.name;
      },
    },
    {
      title: 'Bác Sĩ Phụ Trách',
      key: 'patient',
      render: (text, record) => {
        return record.doctor?.name;
      },
    },
    // {
    //   title: 'Chuẩn Đoán',
    //   key: 'diagnose',
    //   dataIndex: 'diagnose',
    // },
    {
      title: 'Bệnh',
      key: 'diseases',
      render: (text, record) => {
        return record.diseases?.name;
      },
    },
    {
      title: 'Thiết Bị Đang Đeo',
      key: 'device',
      render: (text, record) => {
        if (record.treated) {
          return 'Không có.';
        }
        return record.medicalRecordDevice?.device?.name;
      },
    },
    {
      title: 'Bệnh Viện',
      key: 'hospital',
      filters: listFilterHospital,
      onFilter: (value, record) => record.doctor?.hospital?.id === value,
      render: (text, record) => {
        return record.doctor?.hospital?.name;
      },
    },
    // {
    //   title: 'Ngày Lập Bệnh Án',
    //   key: 'createdAt',
    //   render: (text, record) => {
    //     return moment(record.createdAt).format('DD/MM/YYYY');
    //   },
    // },
    // {
    //   title: 'Ngày Kết Thúc Bệnh Án',
    //   key: 'updatedAt',
    //   render: (text, record) => {
    //     if (record.treated) {
    //       return moment(record.updatedAt).format('DD/MM/YYYY');
    //     } else {
    //       return 'Bệnh Án chưa kết thúc.';
    //     }
    //   },
    // },

    {
      title: 'Trạng Thái',
      key: 'treated',
      align: 'center',
      width: 150,
      filters: [
        {
          text: 'Kết Thúc Điều Trị',
          value: true,
        },
        {
          text: 'Đang Điều Trị',
          value: false,
        },
      ],
      defaultFilteredValue: ['false'],
      onFilter: (value, record) => record.treated === value,
      render: (text, record) => {
        return record.treated ? (
          <Tag color="gray" style={{ width: '120px' }}>
            Kết Thúc Điều Trị
          </Tag>
        ) : (
          <Tag color="green" style={{ width: '120px' }}>
            Đang Điều Trị
          </Tag>
        );
      },
    },

    {
      title: 'Tác Vụ',
      key: 'action',
      align: 'center',
      width: 60,
      render: (record) => {
        return (
          <Dropdown
            overlay={
              <Menu>
                {/* <Menu.Item
                  key="1"
                  icon={<AiOutlineEdit size={15} color="#1890FF" />}
                  style={{ color: '#1890FF' }}
                  onClick={() => handleVisibleEditMedicalRecord(record)}
                >
                  Sửa thông tin
                </Menu.Item> */}
                {/* <Menu.Item
                  key="2"
                  icon={<AiOutlineDelete size={15} color="#FF4D4F" />}
                  style={{ color: '#FF4D4F' }}
                  onClick={() => handleDeleteMedicalRecord(record)}
                >
                  Xoá
                </Menu.Item> */}
                <Menu.Item
                  key="3"
                  icon={<AiOutlineInfoCircle size={15} />}
                  onClick={() => handleVisibleDetailMedicalRecord(record)}
                >
                  Xem chi tiết
                </Menu.Item>
                <Menu.Item
                  key="5"
                  icon={<AiOutlineAreaChart size={15} />}
                  onClick={() => handleVisibleChartModal(record)}
                >
                  Xem biểu đồ
                </Menu.Item>
                {!record.treated && (
                  <Menu.Item
                    key="4"
                    style={{ color: '#ee6123' }}
                    icon={<AiOutlineFileDone size={15} />}
                    onClick={() => handleVisibleEndFollowMedicalRecord(record)}
                  >
                    Kết Thúc Điều Trị
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
      title: 'Xác Nhận',
      content: 'Bạn có chắc chắn muốn xoá?',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: async () => {
        try {
          await medicalRecordAPI.deleteMedicalRecord(record.id);
          confirmDeleteMedicalRecord.destroy();
          message.success('Xoá thành công', 5);
          getAllMedicalRecord();
        } catch (error) {
          console.log(error);
          message.success('Xoá không thành công', 5);
        }
      },
      onCancel() {
        confirmDeleteMedicalRecord.destroy();
      },
    });
  };

  const handleEditMedicalRecord = () => {
    formAddEditMedicalRecord.validateFields().then((formValue) => {
      console.log(formValue);
      // const confirmUpdateMedicalRecordModal = Modal.confirm({
      //   title: 'Xác Nhận',
      //   content: 'Bạn có chắc chắn với các thông tin đã nhập?',
      //   okText: 'Xác Nhận',
      //   cancelText: 'Không',
      //   onOk: async () => {
      //     try {
      //       await medicalRecordAPI.updateMedicalRecord({ ...formValue, status: true });
      //       message.success('Sửa Bệnh Án Thành Công.', 5);
      //       getAllMedicalRecord();
      //       handleCancelMedicalRecordModal();
      //     } catch (error) {
      //       console.log(error);
      //       message.error('Sửa Bệnh Án Không Thành Công.', 5);
      //     }
      //   },
      //   onCancel() {
      //     confirmUpdateMedicalRecordModal.destroy();
      //   },
      // });
    });
  };
  const handleAddMedicalRecord = () => {
    formAddEditMedicalRecord.validateFields().then(async (formValue) => {
      try {
        await medicalRecordAPI.createMedicalRecord({ ...formValue, treated: false });
        message.success('Tạo Bệnh Án thành công.', 5);
        getAllMedicalRecord();
        handleCancelMedicalRecordModal();
      } catch (error) {
        console.log(error);
        message.error('Tạo Bệnh Án không thành công.', 5);
      }
    });
  };

  const handleEndFollowMedicalRecord = () => {
    formAddEditMedicalRecord.validateFields().then(async (formValue) => {
      const confirmEndFollowMedicalRecordModal = Modal.confirm({
        title: 'Xác Nhận',
        content: 'Bạn có chắc chắn muốn kết thúc điều trị Bệnh Án này?',
        okText: 'Xác Nhận',
        cancelText: 'Không',
        onOk: async () => {
          console.log(formValue);
          try {
            await medicalRecordAPI.endFollowMedicalRecord(formValue);
            message.success('Thao Tác Thành Công.', 5);
            getAllMedicalRecord();
            handleCancelMedicalRecordModal();
          } catch (error) {
            console.log(error);
            message.error('Thao Tác Không Thành Công.', 5);
          }
        },
        onCancel() {
          confirmEndFollowMedicalRecordModal.destroy();
        },
      });
    });
  };

  const handleVisibleAddMedicalRecord = async () => {
    await getAllPatientIsTreated();
    formAddEditMedicalRecord.setFieldsValue({ treated: false });
    setAddEditMedicalRecordModalVisible(true);
    setModalUsedFor('addMedicalRecord');
    setModalTitle('Thêm Bệnh Án');
    setIsFormItemDeviceDisabled(true);
    setIsFormItemDoctorDisabled(true);
    // setIsFormItemDiseaseDisabled(true);
  };

  const handleVisibleEndFollowMedicalRecord = async (record) => {
    setAddEditMedicalRecordModalVisible(true);
    setModalUsedFor('endFollowMedicalRecord');
    setModalTitle('Kết Thúc Bệnh Án');
    formAddEditMedicalRecord.setFieldsValue({ medicalRecordId: record.id });
  };

  const handleVisibleEditMedicalRecord = async (record) => {
    setModalUsedFor('editMedicalRecord');
    setModalTitle('Sửa Thông Tin Bệnh Án');
    await formAddEditMedicalRecord.setFieldsValue({
      id: record?.id,
      diagnose: record?.diagnose,
      patientId: record.patient?.id,
      doctorId: record.doctor?.id,
      diseasesId: record.diseases?.id,
      deviceId: record.medicalRecordDevice?.device?.id,
      treated: record?.treated,
      conclude: record?.conclude,
      hospitalId: record.doctor?.hospital?.id,
    });
    setIsFormItemDeviceDisabled(false);
    setIsFormItemDoctorDisabled(false);
    setAddEditMedicalRecordModalVisible(true);
  };

  const handleCancelMedicalRecordModal = () => {
    setAddEditMedicalRecordModalVisible(false);
    formAddEditMedicalRecord.resetFields();
    setIsFormItemDeviceDisabled(true);
    setIsFormItemDoctorDisabled(true);
    setIsDisabledConcludeFormItem(true);
  };

  const onChangeFormItem = async (fieldData) => {
    if (fieldData.hospitalId) {
      formAddEditMedicalRecord.resetFields(['deviceId', 'doctorId']);
      await getAllDoctorByHospitalId(fieldData.hospitalId);
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
          Thêm Bệnh Án
        </Button>

        <Input.Search placeholder="Tìm kiếm" style={{ width: 320 }} size="large" />
      </div>
      <Modal
        title={modalTitle}
        visible={isAddEditMedicalRecordModalVisible}
        okText="Xác Nhận"
        cancelText="Huỷ"
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
              label="Tên Bệnh Viện:"
              rules={[
                {
                  required: true,
                  message: 'Tên Bệnh Viện không được để trống!',
                },
                // {
                //   pattern: vietnameseNameRegex,
                //   message: 'Tên Bệnh Viện không đúng định dạng',
                // },
              ]}
            >
              <Input placeholder="Tên Bệnh Viện" />
            </Form.Item> */}
          {modalUsedFor === 'editMedicalRecord' || modalUsedFor === 'addMedicalRecord' ? (
            <>
              {renderFormItemPatient}
              {renderFormItemHospital}
              {renderFormItemDoctor}
              {renderFormItemDisease}
              {renderFormItemDevice}

              <Form.Item
                name="diagnose"
                label="Chuẩn Đoán:"
                rules={[
                  {
                    required: true,
                    message: 'Chuẩn Đoán không được để trống!',
                  },
                ]}
              >
                <Input.TextArea placeholder="Chuẩn Đoán" rows={3} />
                {/* <Input  /> */}
              </Form.Item>
            </>
          ) : (
            <></>
          )}

          {modalUsedFor === 'endFollowMedicalRecord' && (
            <>
              <Form.Item label="Mã Bệnh Án:" name="medicalRecordId">
                <Input disabled={true} placeholder="Mã Bệnh Án:"></Input>
              </Form.Item>
              <Form.Item
                name="conclude"
                rules={[
                  {
                    required: true,
                    message: 'Kết Luận không được để trống!',
                  },
                ]}
                label="Kết Luận:"
              >
                <Input.TextArea rows={3} placeholder="Kết Luận:" />
              </Form.Item>
            </>
          )}
        </Form>
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
        <h3>Tên Bệnh Nhân: {patientNameChart}</h3>
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

      {/* Modal Detail Medical Record */}
      <Modal
        title="Thông Tin Chi Tiết"
        visible={isDetailModalVisible}
        cancelText="Đóng"
        width={680}
        style={{ top: '50px' }}
        // className="add-doctor-modal-container"
        onCancel={() => setIsDetailModalVisible(false)}
        okButtonProps={{ style: { display: 'none' } }}
      >
        <Descriptions
          bordered
          column={1}
          size="middle"
          style={{ marginTop: 20 }}
          labelStyle={{ width: 250 }}
        >
          <Descriptions.Item label="ID Bệnh Án:">{medicalRecordDetail?.id}</Descriptions.Item>
          <Descriptions.Item label="Tên Bệnh Nhân:">
            {medicalRecordDetail.patient?.surname + ' ' + medicalRecordDetail?.patient?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Bệnh Viện:">
            {medicalRecordDetail.doctor?.hospital?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Bác Sĩ Phụ Trách:">
            {medicalRecordDetail.doctor?.name}
          </Descriptions.Item>
          <Descriptions.Item label="Bệnh:">{medicalRecordDetail.diseases?.name}</Descriptions.Item>
          <Descriptions.Item label="Chuẩn Đoán:">{medicalRecordDetail.diagnose}</Descriptions.Item>
          <Descriptions.Item label="Ngày Lập Bệnh Án:">
            {moment(medicalRecordDetail?.createdAt).format('DD/MM/YYYY')}
          </Descriptions.Item>
          <Descriptions.Item label="Ngày Kết Thúc Bệnh Án:">
            {medicalRecordDetail.treated
              ? moment(medicalRecordDetail?.updatedAt).format('DD/MM/YYYY')
              : 'Bệnh Án chưa kết thúc.'}
          </Descriptions.Item>
          <Descriptions.Item label="Tình Trạng Bệnh Án:">
            {medicalRecordDetail?.treated ? 'Kết Thúc Điều Trị' : 'Đang Điều Trị'}
          </Descriptions.Item>
          <Descriptions.Item label="Kết Luận:">
            {medicalRecordDetail?.treated ? medicalRecordDetail?.conclude : 'Không có.'}
          </Descriptions.Item>
        </Descriptions>
      </Modal>
      {isLoadingSkeleton ? (
        renderLoadingSkeleton
      ) : (
        <Table
          scroll={{ y: 705 }}
          locale={{
            filterReset: 'Đặt lại',
            emptyText: <Empty description="Không có dữ liệu." />,
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
