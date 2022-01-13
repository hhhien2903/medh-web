import React from 'react';
import { Layout as AntLayout } from 'antd';
import Header from '../Header/Header';
import SideMenu from '../SideMenu/SideMenu';
const Layout = (props) => {
  const { sideMenuItems } = props;
  return (
    <AntLayout style={{ minHeight: '100vh' }}>
      <SideMenu sideMenuItems={sideMenuItems} />

      <AntLayout className="site-layout">
        <Header />
        {props.children}
      </AntLayout>
    </AntLayout>
  );
};

export default Layout;
