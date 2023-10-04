import React, { useState } from 'react';

const Orders = () => {
  // Estado para armazenar as ordens de serviço
  const [orders, setOrders] = useState([
    { id: 1, description: 'Instalação de rede Wi-Fi', status: 'Pendente' },
    { id: 2, description: 'Manutenção do sistema de segurança', status: 'Concluída' },
    { id: 3, description: 'Atualização de software', status: 'Em andamento' },
  ]);

  // Função para adicionar uma nova ordem
  const addOrder = (newOrder) => {
    setOrders([...orders, newOrder]);
  };

  // Função para editar uma ordem existente
  const updateOrder = (id, updatedOrder) => {
    setOrders(prevOrders => prevOrders.map(order => (order.id === id ? updatedOrder : order)));
  };

  // Função para remover uma ordem
  const deleteOrder = (id) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
  };

  return (
    <div className="container">
      <h1>Ordens de Serviço</h1>

      {/* Exibir a lista de ordens de serviço */}
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            <strong>Descrição:</strong> {order.description} | <strong>Status:</strong> {order.status}
            <button onClick={() => updateOrder(order.id, { ...order, status: 'Concluída' })}>Concluir</button>
            <button onClick={() => deleteOrder(order.id)}>Excluir</button>
          </li>
        ))}
      </ul>

      {/* Adicionar uma nova ordem */}
      <button onClick={() => addOrder({ id: orders.length + 1, description: 'Nova Ordem', status: 'Pendente' })}>
        Adicionar Nova Ordem
      </button>
    </div>
  );
};

export default Orders;
