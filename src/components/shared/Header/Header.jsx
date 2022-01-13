import { useEffect, useContext } from 'react';
import { Layout, Menu, Dropdown, Avatar } from 'antd';
import '../Header/Header.scss';
import userApi from '../../../api/user-api';
import { MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { useHistory } from 'react-router-dom';
import { AppContext } from '../../../contexts/AppProvider';
import { AuthContext } from '../../../contexts/AuthProvider';
const Header = () => {
  const { menuToggleCollapsed, setMenuToggleCollapsed } = useContext(AppContext);
  const { currentUser } = useContext(AuthContext);
  const history = useHistory();

  const getPageTitle = () => {
    const title = history.location.pathname;
    switch (title) {
      case '/expert/dashboard':
        return 'Dashboard';
      default:
        return '';
    }
  };

  const menu = (
    <Menu>
      <Menu.Item key={0}>User Info</Menu.Item>
      <Menu.Item key={1} danger>
        <a href="/logout">Log Out</a>
      </Menu.Item>
    </Menu>
  );

  const handleClickToggleMenu = () => {
    setMenuToggleCollapsed(!menuToggleCollapsed);
  };
  // useEffect(() => {
  //   const getUserInfo = async () => {
  //     await userApi
  //       .getUser()
  //       .then((userData) => {
  //         setCurrentUser(userData);
  //       })
  //       .catch((err) => {
  //         console.log(err);
  //       });
  //   };
  //   getUserInfo();
  // }, []);

  useEffect(() => {
    if (window.innerWidth < 600) {
      setMenuToggleCollapsed(true);
    }
  }, []);

  return (
    <Layout.Header className="site-layout-background header-container">
      <div>
        {menuToggleCollapsed ? (
          <MenuUnfoldOutlined className="toggle-menu" onClick={handleClickToggleMenu} />
        ) : (
          <MenuFoldOutlined className="toggle-menu" onClick={handleClickToggleMenu} />
        )}
        <h2 style={{ display: 'inline', marginLeft: 10 }}>{getPageTitle()}</h2>
      </div>

      <div className="avatar">
        <Dropdown overlay={menu} trigger={['click']}>
          <div>
            {currentUser?.displayName}
            <Avatar size={40} src={currentUser?.photoURL} />
          </div>
        </Dropdown>
      </div>
    </Layout.Header>
  );
};

export default Header;
