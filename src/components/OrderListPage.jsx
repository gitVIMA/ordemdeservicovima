// src/components/OrderListPage.js
import React from 'react';
import OrderList from './OrderList';

const OrderListPage = ({ orders }) => {
  return (
    <div>
      <h2>Lista de Ordens de Serviço</h2>
      <OrderList orders={orders} />
    </div>
  );
};

export default OrderListPage;
