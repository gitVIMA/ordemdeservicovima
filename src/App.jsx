import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from 'react-router-dom';
import Login from './Login';
import Orders from './Orders';
import Forms from './Forms';
import Forms2 from './Forms2';
import Forms3 from './Forms3';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Outlet />}>
          <Route index element={<Login />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/forms" element={<Forms />} /> {/* Use o componente Forms aqui */}
          <Route path="/forms2" element={<Forms2 />} />
          <Route path="/forms3" element={<Forms3 />} />

        </Route>
      </Routes>
    </Router>
  );
};

export default App;