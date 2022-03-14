import React, { useEffect, useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { firebaseAuth } from '../../config/firebase';
import { AuthContext } from '../../contexts/AuthProvider';
const Logout = () => {
  const { setCurrentUser } = useContext(AuthContext);
  useEffect(() => {
    console.log('hehe log out ne');
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('role');
    setCurrentUser({});
    firebaseAuth.signOut();
  }, []);

  return <Redirect to={'/login'} />;
};

export default Logout;
