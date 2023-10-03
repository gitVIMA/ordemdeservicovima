// src/components/OrderDashboard.js
import React from 'react';
import { Link } from 'react-router-dom';

const OrderDashboard = () => {
  return (
    <div>
      <h2>Dashboard de Ordens de Serviço</h2>
      <Link to="/order/1">Ver Detalhes da Ordem 1</Link>
    </div>
  );
};

export default OrderDashboard;
