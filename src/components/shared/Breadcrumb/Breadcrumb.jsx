import { Breadcrumb as AntBreadcrumb } from 'antd';
import React from 'react';
import { AiOutlineHome, AiOutlineSetting, AiOutlineSetting } from 'react-icons/ai';
import { FaRegUser } from 'react-icons/fa';
import { Link, useLocation } from 'react-router-dom';
const Breadcrumb = () => {
  const location = useLocation();

  const breadCrumbView = () => {
    const { pathname } = location;
    const pathNames = pathname.split('/').filter((item) => item);
    const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1);

    const renderIconBreadCrumb = (url) => {
      switch (url) {
        case 'expert':
          return <AiOutlineHome style={{ verticalAlign: 'middle' }} />;
        case 'patient':
          return <FaRegUser style={{ verticalAlign: 'middle' }} />;
        default:
          return '';
      }
    };
    return (
      <div className="breadcrumb-navigation">
        <AntBreadcrumb>
          {/* {pathNames.length > 0 ? (
            <AntBreadcrumb.Item>
              <Link to="/expert">Home</Link>
            </AntBreadcrumb.Item>
          ) : (
            <AntBreadcrumb.Item>Home</AntBreadcrumb.Item>
          )} */}
          {pathNames.map((name, index) => {
            const routeTo = `/${pathNames.slice(0, index + 1).join('/')}`;
            const isLast = index === pathNames.length - 1;
            console.log(name);
            return isLast ? (
              <AntBreadcrumb.Item key={index}>
                {renderIconBreadCrumb(name)}
                {' ' + capitalize(name)}
              </AntBreadcrumb.Item>
            ) : (
              <AntBreadcrumb.Item key={index}>
                <Link to={`${routeTo}`}>
                  {renderIconBreadCrumb(name)}
                  {' ' + capitalize(name)}
                </Link>
              </AntBreadcrumb.Item>
            );
          })}
        </AntBreadcrumb>
      </div>
    );
  };
  //   useEffect(() => {
  //     breadCrumbView();
  //   }, []);

  return <>{breadCrumbView()}</>;
};

export default Breadcrumb;
