// src/App.js
import React, { useState, useEffect } from 'react';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';
import Login from './components/Login';

import logo from './assets/logo.png';
import './App.css';

const App = () => {
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState(() => {
    const savedOrders = JSON.parse(localStorage.getItem('orders'));
    return savedOrders || [];
  });

  const handleLogin = ({ username, password }) => {
    // Simulação simples de login - normalmente você faria uma verificação mais complexa
    if (username === 'admin' && password === 'password') {
      setUser(username);
    } else {
      alert('Credenciais inválidas');
    }
  };

  const handleLogout = () => {
    setUser(null);
  };

  const addOrder = (newOrder) => {
    setOrders([...orders, newOrder]);
  };

  useEffect(() => {
    localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  return (
    <div>
      {user ? (
        <div>
          <header className="app-header">
            <img src={logo} alt="Logo da Empresa" className="app-logo" />
            <h1>Sistema de Ordens de Serviço</h1>
            <button onClick={handleLogout}>Logout</button>
          </header>
          <OrderForm addOrder={addOrder} />
          <OrderList orders={orders} />
        </div>
      ) : (
        <Login handleLogin={handleLogin} />
      )}
    </div>
  );
};

export default App;
