import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Image, Layout, Menu } from 'antd';
import './SideMenu.scss';
import fullLogo from '../../../assets/images/full-logo-1.png';
import onlyLogo from '../../../assets/images/med-h-only-logo.png';
import { AppContext } from '../../../contexts/AppProvider';
const SideMenu = (props) => {
  const { sideMenuItems } = props;
  const { menuToggleCollapsed } = useContext(AppContext);
  return (
    <Layout.Sider
      trigger={null}
      collapsed={menuToggleCollapsed}
      className="expert-sidemenu-container"
      width={230}
    >
      <div className="logo">
        <Image
          src={menuToggleCollapsed ? onlyLogo : fullLogo}
          preview={false}
          height={menuToggleCollapsed ? 45 : 50}
        />
      </div>
      <Menu theme="dark" mode="inline" defaultSelectedKeys={sideMenuItems[0].title}>
        {sideMenuItems.map((sideMenuItem) => {
          if (sideMenuItem.type === 'submenu') {
            return (
              <Menu.SubMenu
                key={sideMenuItem.title}
                icon={sideMenuItem.icon}
                title={sideMenuItem.title}
              >
                {sideMenuItem.subMenuItems.map((subMenuItem) => {
                  return (
                    <Menu.Item key={subMenuItem.title} icon={subMenuItem.icon}>
                      <Link to={subMenuItem?.url}>{subMenuItem.title}</Link>
                    </Menu.Item>
                  );
                })}
              </Menu.SubMenu>
            );
          } else {
            return (
              <Menu.Item key={sideMenuItem.title} icon={sideMenuItem.icon}>
                <Link to={sideMenuItem?.url}>{sideMenuItem.title}</Link>
              </Menu.Item>
            );
          }
        })}
      </Menu>
    </Layout.Sider>
  );
};

export default SideMenu;
