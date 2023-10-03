// src/components/OrderDetails.js
import React from 'react';
import { useParams } from 'react-router-dom';

const OrderDetails = () => {
  let { id } = useParams();

  return (
    <div>
      <h2>Detalhes da Ordem de Serviço</h2>
      <p>ID da Ordem: {id}</p>
      {/* Coloque o código para exibir os detalhes da ordem aqui */}
    </div>
  );
};

export default OrderDetails;
