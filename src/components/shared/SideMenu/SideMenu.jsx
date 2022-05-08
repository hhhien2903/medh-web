import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Image, Layout, Menu } from 'antd';
import './SideMenu.scss';
import fullLogo from '../../../assets/images/full-logo-1.png';
import onlyLogo from '../../../assets/images/med-h-only-logo.png';
import { AppContext } from '../../../contexts/AppProvider';
import { useHistory } from 'react-router-dom';
const SideMenu = (props) => {
  const { sideMenuItems } = props;
  const { menuToggleCollapsed } = useContext(AppContext);
  const history = useHistory();
  const [subMenuOpenKey, setSubMenuOpenKey] = useState([]);

  useEffect(() => {
    if (history.location.pathname.slice(8, 15) === 'doctor') {
      setSubMenuOpenKey([...subMenuOpenKey, 'tmp_key-1']);
    }
  }, [history.location.pathname]);

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
      <Menu
        defaultOpenKeys={['tmp_key-1']}
        selectedKeys={[history.location.pathname]}
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[history.location.pathname]}
      >
        {sideMenuItems.map((sideMenuItem) => {
          if (sideMenuItem.type === 'submenu') {
            return (
              <Menu.SubMenu
                key={sideMenuItem.url}
                icon={sideMenuItem.icon}
                title={sideMenuItem.title}
              >
                {sideMenuItem.subMenuItems.map((subMenuItem) => {
                  return (
                    <Menu.Item key={subMenuItem.url} icon={subMenuItem.icon}>
                      <Link to={subMenuItem?.url}>{subMenuItem.title}</Link>
                    </Menu.Item>
                  );
                })}
              </Menu.SubMenu>
            );
          } else {
            return (
              <Menu.Item key={sideMenuItem.url} icon={sideMenuItem.icon}>
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
