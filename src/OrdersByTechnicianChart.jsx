import React from 'react';
import { Bar } from 'react-chartjs-2';

const OrdersByTechnicianChart = ({ orders }) => {
  const technicianCounts = orders.reduce((acc, order) => {
    acc[order.tecnico] = (acc[order.tecnico] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(technicianCounts),
    datasets: [
      {
        label: 'Ordens por Técnico',
        data: Object.values(technicianCounts),
        backgroundColor: 'rgba(54, 162, 235, 0.6)',
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return <Bar data={data} options={options} />;
};

export default OrdersByTechnicianChart;
