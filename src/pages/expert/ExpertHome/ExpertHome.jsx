import { Layout as AntLayout } from 'antd';
import { BsFileEarmarkMedicalFill } from 'react-icons/bs';
import {
  FaChartPie,
  FaDisease,
  FaMicrochip,
  FaUser,
  FaUserMd,
  FaNotesMedical,
} from 'react-icons/fa';
import { RiHospitalFill } from 'react-icons/ri';
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import backgroundImage from '../../../assets/images/background-1.jpg';
import Layout from '../../../components/shared/Layout/Layout';
import ExpertDashboard from '../ExpertDashboard/ExpertDashboard';
import ExpertDeviceManager from '../ExpertDeviceManager/ExpertDeviceManager';
import ExpertDiseaseManager from '../ExpertDiseaseManager/ExpertDiseaseManager';
import DoctorManager from '../ExpertDoctorManager/DoctorManager/DoctorManager';
import DoctorRegisterPending from '../ExpertDoctorManager/DoctorRegisterPending/DoctorRegisterPending';
import ExpertHospitalManager from '../ExpertHospitalManager/ExpertHospitalManager';
import ExpertMedicalRecordManager from '../ExpertMedicalRecordManager/ExpertMedicalRecordManager';
import ExpertPatientManager from '../ExpertPatientManager/ExpertPatientManager';
import ExpertRuleConditionManager from '../ExpertRuleConditionManager/ExpertRuleConditionManager';
import ExpertRuleManager from '../ExpertRuleManager/ExpertRuleManager';
import './ExpertHome.scss';
import { useEffect } from 'react';
const ExpertHome = () => {
  const history = useHistory();
  const sideMenuItems = [
    {
      title: 'Dashboard',
      type: 'menu',
      icon: <FaChartPie />,
      url: '/expert/dashboard',
    },
    {
      title: 'Quản Lý Bác Sĩ',
      type: 'submenu',
      icon: <FaUserMd />,
      subMenuItems: [
        {
          title: 'Danh sách Bác Sĩ',
          type: 'menu',
          url: '/expert/doctor',
        },
        {
          title: 'Danh Sách Chờ Duyệt',
          type: 'menu',
          url: '/expert/doctor/pending',
        },
      ],
    },
    {
      title: 'Quản Lý Bệnh Nhân',
      type: 'menu',
      icon: <FaUser />,
      subMenuItems: [],
      url: '/expert/patient',
    },
    {
      title: 'Quản Lý Thiết Bị',
      type: 'menu',
      icon: <FaMicrochip />,
      subMenuItems: [],
      url: '/expert/device',
    },
    {
      title: 'Quản Lý Mầm Bệnh',
      type: 'menu',
      icon: <FaDisease />,
      subMenuItems: [],
      url: '/expert/disease',
    },
    {
      title: 'Quản Lý Tập Luật Y Tế',
      type: 'menu',
      icon: <BsFileEarmarkMedicalFill />,
      subMenuItems: [],
      url: '/expert/rule',
    },
    // {
    //   title: 'Quản Lý Luật Y Tế',
    //   type: 'menu',
    //   icon: <IoMdMedical />,
    //   subMenuItems: [
    //     // {
    //     //   title: 'Auth Log',
    //     //   type: 'menu',
    //     //   icon: <PieChartOutlined />,
    //     //   url: '/expert/logs/authlog',
    //     // },
    //   ],
    //   url: '/expert/rule-condition',
    // },
    {
      title: 'Quản Lý Bệnh Án',
      type: 'menu',
      icon: <FaNotesMedical />,
      url: '/expert/medical-record',
      subMenuItems: [],
    },
    {
      title: 'Quản Lý Bệnh Viện',
      type: 'menu',
      icon: <RiHospitalFill />,
      url: '/expert/hospital',
      subMenuItems: [],
    },
  ];

  useEffect(() => {
    let pathnameURL = history.location.pathname;
    sessionStorage.setItem('pathnameURL', pathnameURL);
  }, [history.location.pathname]);

  return (
    <Layout sideMenuItems={sideMenuItems}>
      <AntLayout.Content
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'no-repeat',
        }}
      >
        {/* <Breadcrumb /> */}
        <Switch>
          <Route exact path="/expert/dashboard" component={ExpertDashboard} />
          <Route exact path="/expert/doctor" component={DoctorManager} />
          <Route exact path="/expert/doctor/pending" component={DoctorRegisterPending} />
          {/* <Route exact path="/expert/patient/:id" component={PatientDetail} /> */}
          <Route exact path="/expert/patient" component={ExpertPatientManager} />
          <Route exact path="/expert/device" component={ExpertDeviceManager} />
          <Route exact path="/expert/disease" component={ExpertDiseaseManager} />
          <Route exact path="/expert/rule" component={ExpertRuleManager} />
          <Route exact path="/expert/rule-condition" component={ExpertRuleConditionManager} />
          <Route exact path="/expert/hospital" component={ExpertHospitalManager} />
          <Route exact path="/expert/medical-record" component={ExpertMedicalRecordManager} />
          <Route exact path="/expert/">
            <Redirect to="/expert/dashboard" />
          </Route>
          <Route path="/expert/*">
            <Redirect to="/404" />
          </Route>
        </Switch>
      </AntLayout.Content>
    </Layout>
  );
};

export default ExpertHome;
