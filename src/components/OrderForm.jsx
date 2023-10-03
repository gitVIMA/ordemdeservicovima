import React, { useState } from 'react';

const OrderForm = ({ addOrder }) => {
  const [customerName, setCustomerName] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addOrder({ customerName, description });
    setCustomerName('');
    setDescription('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Nome do Cliente:</label>
        <input
          type="text"
          value={customerName}
          onChange={(e) => setCustomerName(e.target.value)}
        />
      </div>
      <div>
        <label>Descrição:</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>
      <button type="submit">Adicionar Ordem</button>
    </form>
  );
};

export default OrderForm;