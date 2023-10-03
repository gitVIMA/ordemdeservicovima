// src/App.js
import React, { useState } from 'react';
import OrderForm from './components/OrderForm';
import OrderList from './components/OrderList';

import logo from './assets/logo.png';
import './App.css'; // Importe o arquivo CSS

const App = () => {
  const [orders, setOrders] = useState([]);

  const addOrder = (newOrder) => {
    setOrders([...orders, newOrder]);
  };

  return (
    <div>
      <header className="app-header"> {/* Adicione a classe "app-header" */}
        <img src={logo} alt="Logo da Empresa" className="app-logo" /> {/* Adicione a classe "app-logo" */}
        <h1>Sistema de Ordens de Serviço</h1>
      </header>
      <OrderForm addOrder={addOrder} />
      <OrderList orders={orders} />
    </div>
  );
};

export default App;