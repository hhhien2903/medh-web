import Layout from '../../../components/shared/Layout/Layout';
import { Button, Layout as AntLayout } from 'antd';
import { DesktopOutlined, PieChartOutlined } from '@ant-design/icons/lib/icons';
import userApi from '../../../api/user-api';
import { Redirect, Route, Switch } from 'react-router-dom';
import ExpertDashboard from '../ExpertDashboard/ExpertDashboard';
import backgroundImage from '../../../assets/images/background-1.jpg';
const ExpertHome = () => {
  const sideMenuItems = [
    {
      title: 'Dashboard',
      type: 'menu',
      icon: <PieChartOutlined />,
      url: '/expert/dashboard',
    },
    {
      title: 'Log',
      type: 'submenu',
      icon: <DesktopOutlined />,
      subMenuItems: [
        {
          title: 'Auth Log',
          type: 'menu',
          icon: <PieChartOutlined />,
          url: '/expert/logs/authlog',
        },
      ],
    },
  ];

  const check = async () => {
    await userApi
      .getUser()
      .then((rs) => {
        console.log(rs);
      })
      .catch((er) => {
        console.log(er);
      });
  };
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
          <Route exact path="/expert/">
            <Redirect to="/expert/dashboard" />
          </Route>
          <Route path="/expert/*">
            <Redirect to="/404" />
          </Route>
        </Switch>
        {/* <Button onClick={check}> Check</Button> */}
      </AntLayout.Content>
    </Layout>
  );
};

export default ExpertHome;
