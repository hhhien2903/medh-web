import './App.css';
import Login from './pages/Login/Login';
import { Route, BrowserRouter as Router, Switch, Redirect } from 'react-router-dom';
import ExpertHome from './pages/expert/ExpertHome/ExpertHome';
import NotFound from './components/shared/NotFound/NotFound';
import Register from './pages/Register/Register';
import ProtectedRoute from './components/shared/ProtectedRoute/ProtectedRoute';
import Logout from './pages/Logout/Logout';
import AuthProvider from './contexts/AuthProvider';
import AppProvider from './contexts/AppProvider';
import Home from './pages/Home/Home';
function App() {
  return (
    <Router>
      <AuthProvider>
        <AppProvider>
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/logout" component={Logout} />
            <Route path="/expert" component={ExpertHome} />
            {/* <ProtectedRoute exact path="/" component={Home} /> */}
            <Route exact path="/register" component={Register} />
            <Route exact path="/404" component={NotFound} />
            <Route path="*" component={NotFound} />
          </Switch>
        </AppProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
