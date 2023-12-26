import React from 'react';
import { Bar } from 'react-chartjs-2';

const OrderStatusChart = ({ orders }) => {
  // Calcula a contagem de ordens por status
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  // Prepara os dados para o gráfico
  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Número de Ordens por Status',
        data: Object.values(statusCounts),
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          // Adicione mais cores conforme necessário
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          // Adicione mais bordas de cores conforme necessário
        ],
        borderWidth: 1,
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

export default OrderStatusChart;
