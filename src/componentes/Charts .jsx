import React from 'react';
import { Bar } from 'react-chartjs-2';

const Charts = ({ statusCounts, statusColors }) => {
  const chartData = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Quantidade',
        backgroundColor: Object.values(statusColors),
        borderColor: 'rgba(0,0,0,1)',
        borderWidth: 1,
        data: Object.values(statusCounts),
      },
    ],
  };

  const chartOptions = {
    scales: {
      y: {
        beginAtZero: true,
        stepSize: 1,
      },
    },
  };

  return (
    <div>
      <Bar data={chartData} options={chartOptions} />
    </div>
  );
};

export default Charts;