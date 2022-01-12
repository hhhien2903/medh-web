import { Redirect, Route } from 'react-router-dom';
const ProtectedRoute = ({ component: Component, ...restOfProps }) => {
  const isLoggedIn = localStorage.getItem('isLoggedIn');
  return (
    <Route
      {...restOfProps}
      render={(props) => (isLoggedIn ? <Component {...props} /> : <Redirect to="/login" />)}
    />
  );
};

export default ProtectedRoute;
