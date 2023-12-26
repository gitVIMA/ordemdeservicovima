import React from 'react';
import { Line } from 'react-chartjs-2';

const OrdersOverTimeChart = ({ orders }) => {
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
  };

  const orderCountsByDate = orders.reduce((acc, order) => {
    const date = formatDate(order.dataPrevistaAcao);
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(orderCountsByDate).sort(),
    datasets: [
      {
        label: 'Ordens por Data',
        data: Object.values(orderCountsByDate),
        fill: false,
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
    ],
  };

  return <Line data={data} />;
};

export default OrdersOverTimeChart;
