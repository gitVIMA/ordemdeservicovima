import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import Login from './Login';
import Orders from './Orders';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<Login />} />
          <Route path="/orders" element={<Orders />} />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
