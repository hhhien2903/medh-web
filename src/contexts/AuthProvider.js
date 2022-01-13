import React, { useEffect, useState } from 'react';
import { firebaseAuth } from '../config/firebase';
import { useHistory } from 'react-router-dom';
import { Spin, Row, notification } from 'antd';

export const AuthContext = React.createContext();

export default function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState({});
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribed = firebaseAuth.onAuthStateChanged(async (firebaseUser) => {
      if (!firebaseUser) {
        setCurrentUser({});
        setIsLoading(false);
        history.push('/logout');
        return;
      }
      setCurrentUser({ role: 'expert' });
      console.log(firebaseUser);
      setIsLoading(false);
      localStorage.setItem('isLoggedIn', true);
      history.push('/expert');
    });
    return () => {
      unsubscribed();
    };
    // setIsLoading(false);
    // history.push('/register');
  }, [history]);

  return (
    <AuthContext.Provider value={{ currentUser, setCurrentUser }}>
      {isLoading ? (
        <Row justify="center" align="middle" style={{ height: '100vh' }}>
          <Spin size="large" />
        </Row>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
}
