import React, { useState } from 'react';

const Orders = () => {
  // Estado para armazenar as ordens de serviço
  const [orders, setOrders] = useState([
    { id: 1, description: 'Instalação de rede Wi-Fi', status: 'Pendente' },
    { id: 2, description: 'Manutenção do sistema de segurança', status: 'Concluída' },
    { id: 3, description: 'Atualização de software', status: 'Em andamento' },
  ]);

  // Estado para armazenar os dados do novo pedido
  const [newOrderData, setNewOrderData] = useState({ description: '', status: '' });

  // Função para adicionar uma nova ordem
  const addOrder = () => {
    const newOrder = {
      id: orders.length + 1,
      description: newOrderData.description,
      status: newOrderData.status,
    };

    setOrders([...orders, newOrder]);
    setNewOrderData({ description: '', status: '' }); // Limpa os campos do formulário após a submissão
  };

  return (
    <div className="container">
      <h1>Ordens de Serviço</h1>

      {/* Formulário para abrir uma nova ordem */}
      <form onSubmit={(e) => { e.preventDefault(); addOrder(); }}>
        <div>
          <label>
            Descrição:
            <input 
              type="text" 
              value={newOrderData.description} 
              onChange={(e) => setNewOrderData({ ...newOrderData, description: e.target.value })} 
              required 
            />
          </label>
        </div>
        <div>
          <label>
            Status:
            <input 
              type="text" 
              value={newOrderData.status} 
              onChange={(e) => setNewOrderData({ ...newOrderData, status: e.target.value })} 
              required 
            />
          </label>
        </div>
        <button type="submit">Abrir Ordem de Serviço</button>
      </form>

      {/* Exibir a lista de ordens de serviço */}
      <ul>
        {orders.map(order => (
          <li key={order.id}>
            <strong>Descrição:</strong> {order.description} | <strong>Status:</strong> {order.status}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Orders;
