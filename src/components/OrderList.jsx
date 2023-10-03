import React from 'react';

const OrderList = ({ orders }) => {
  return (
    <div>
      <h2>Ordens de Serviço</h2>
      <ul>
        {orders.map((order, index) => (
          <li key={index}>
            <strong>{order.customerName}:</strong> {order.description}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderList;