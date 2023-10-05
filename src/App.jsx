import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import Login from './Login';
import Orders from './Orders'; // Mantenha o componente Orders como está
import Forms from './Forms'; // Renomeie o componente para Forms

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<Login />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/forms" element={<Forms />} /> {/* Use o componente Forms aqui */}
        </Route>
      </Routes>
    </Router>
  );
};

export default App;