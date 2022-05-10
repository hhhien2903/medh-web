import { Row, Spin } from 'antd';
import React, { useEffect, useState, useContext } from 'react';
import { useHistory } from 'react-router-dom';
import expertAPI from '../api/expertAPI';
import { firebaseAuth } from '../config/firebase';
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

      try {
        let { phoneNumber, email } = firebaseUser;
        if (phoneNumber) {
          phoneNumber = '0' + phoneNumber.substring(3);
        }

        const expertData = await expertAPI.checkAccountRegistered(phoneNumber, email);
        setCurrentUser(expertData);
        console.log(expertData);
        console.log(firebaseUser);
        // localStorage.setItem('isLoggedIn', true);
        console.log(sessionStorage.getItem('pathnameURL'));
        if (sessionStorage.getItem('pathnameURL') !== null) {
          history.push(sessionStorage.getItem('pathnameURL'));
        } else {
          history.push('/expert');
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        history.push('/register');
        //when server down
        // setIsLoading(false);
        // setCurrentUser({});
        // history.push('/expert');
      }

      // setCurrentUser({ role: 'expert' });
      // console.log(firebaseUser);

      // localStorage.setItem('isLoggedIn', true);
      // history.push('/expert');
    });
    return () => {
      unsubscribed();
    };
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
