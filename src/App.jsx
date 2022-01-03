import './App.css';
import Login from './pages/Login/Login';
import { Route, BrowserRouter as Router, Switch } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/login" component={Login} />
      </Switch>
    </Router>
  );
}

export default App;
