import React from 'react';
import { Pie } from 'react-chartjs-2';

const ServiceTypeChart = ({ orders }) => {
  const serviceCounts = orders.reduce((acc, order) => {
    acc[order.tipoServico] = (acc[order.tipoServico] || 0) + 1;
    return acc;
  }, {});

  const data = {
    labels: Object.keys(serviceCounts),
    datasets: [
      {
        data: Object.values(serviceCounts),
        backgroundColor: [
          '#FF6384',
          '#36A2EB',
          '#FFCE56',
          // Adicione mais cores conforme necessário
        ],
      },
    ],
  };

  return <Pie data={data} />;
};

export default ServiceTypeChart;
