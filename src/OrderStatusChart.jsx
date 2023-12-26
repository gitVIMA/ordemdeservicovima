import React from 'react';
import { Bar } from 'react-chartjs-2';

const OrderStatusChart = ({ orders }) => {
  // Mapeamento de cores para cada status
  const statusColors = {
    Pendente: 'rgba(255, 206, 86, 0.6)',
    EmProgresso: 'rgba(54, 162, 235, 0.6)',
    EmAberto: '#ff4500',
    Concluída: 'rgba(75, 192, 192, 0.6)',
    Retorno: 'rgba(153, 102, 255, 0.6)',
    Cancelada: 'rgba(201, 203, 207, 0.6)'
    // Adicione mais cores e status conforme necessário
  };

  // Calcula a contagem de ordens por status
  const statusCounts = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  // Cria arrays de cores baseados na ordem dos status
  const backgroundColors = Object.keys(statusCounts).map(status => statusColors[status] || 'grey');
  const borderColors = backgroundColors.map(color => color.replace('0.6', '1'));

  // Prepara os dados para o gráfico
  const data = {
    labels: Object.keys(statusCounts),
    datasets: [
      {
        label: 'Número de Ordens por Status',
        data: Object.values(statusCounts),
        backgroundColor: backgroundColors,
        borderColor: borderColors,
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
