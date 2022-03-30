import Layout from '../../../components/shared/Layout/Layout';
import { Button, Layout as AntLayout } from 'antd';
import { Redirect, Route, Switch } from 'react-router-dom';
import ExpertDashboard from '../ExpertDashboard/ExpertDashboard';
import backgroundImage from '../../../assets/images/background-1.jpg';
import DoctorRegisterPending from '../ExpertDoctorManager/DoctorRegisterPending/DoctorRegisterPending';
import DoctorManager from '../ExpertDoctorManager/DoctorManager/DoctorManager';
import { FaDisease, FaUserMd, FaUser, FaChartPie, FaMicrochip } from 'react-icons/fa';
import { RiHospitalFill } from 'react-icons/ri';
import { BsFillFileEarmarkRuledFill, BsFileEarmarkMedicalFill } from 'react-icons/bs';
import { IoMdMedical } from 'react-icons/io';
import ExpertPatientManager from '../ExpertPatientManager/ExpertPatientManager';
import ExpertDeviceManager from '../ExpertDeviceManager/ExpertDeviceManager';
import ExpertDiseaseManager from '../ExpertDiseaseManager/ExpertDiseaseManager';
import ExpertRuleManager from '../ExpertRuleManager/ExpertRuleManager';
import ExpertHospitalManager from '../ExpertHospitalManager/ExpertHospitalManager';
import ExpertRuleConditionManager from '../ExpertRuleConditionManager/ExpertRuleConditionManager';

const ExpertHome = () => {
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
      subMenuItems: [
        // {
        //   title: 'Auth Log',
        //   type: 'menu',
        //   icon: <PieChartOutlined />,
        //   url: '/expert/logs/authlog',
        // },
      ],
      url: '/expert/patient',
    },
    {
      title: 'Quản Lý Thiết Bị',
      type: 'menu',
      icon: <FaMicrochip />,
      subMenuItems: [
        // {
        //   title: 'Auth Log',
        //   type: 'menu',
        //   icon: <PieChartOutlined />,
        //   url: '/expert/logs/authlog',
        // },
      ],
      url: '/expert/device',
    },
    {
      title: 'Quản Lý Mầm Bệnh',
      type: 'menu',
      icon: <FaDisease />,
      subMenuItems: [
        // {
        //   title: 'Auth Log',
        //   type: 'menu',
        //   icon: <PieChartOutlined />,
        //   url: '/expert/logs/authlog',
        // },
      ],
      url: '/expert/disease',
    },
    {
      title: 'Quản Lý Tập Luật Y Tế',
      type: 'menu',
      icon: <BsFileEarmarkMedicalFill />,
      subMenuItems: [
        // {
        //   title: 'Auth Log',
        //   type: 'menu',
        //   icon: <PieChartOutlined />,
        //   url: '/expert/logs/authlog',
        // },
      ],
      url: '/expert/rule',
    },
    {
      title: 'Quản Lý Luật Y Tế',
      type: 'menu',
      icon: <IoMdMedical />,
      subMenuItems: [
        // {
        //   title: 'Auth Log',
        //   type: 'menu',
        //   icon: <PieChartOutlined />,
        //   url: '/expert/logs/authlog',
        // },
      ],
      url: '/expert/rule-condition',
    },
    {
      title: 'Quản Lý Bệnh Viện',
      type: 'menu',
      icon: <RiHospitalFill />,
      subMenuItems: [
        // {
        //   title: 'Auth Log',
        //   type: 'menu',
        //   icon: <PieChartOutlined />,
        //   url: '/expert/logs/authlog',
        // },
      ],
      url: '/expert/hospital',
    },
  ];

  return (
    <Layout sideMenuItems={sideMenuItems}>
      <AntLayout.Content
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundRepeat: 'no-repeat',
        }}
      >
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
