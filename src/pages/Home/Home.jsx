import React, { useContext, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider';
const Home = () => {
  const history = useHistory();
  const { currentUser } = useContext(AuthContext);
  useEffect(() => {
    if (currentUser.role === 'expert') {
      history.push('/expert');
    } else {
      history.push('/register');
    }
  }, []);
  return <></>;
};

export default Home;
