import React, { useState } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  Container,
  Typography,
  TextField,
  Button,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';

const Orders = () => {
  // Estado para armazenar as ordens de serviço
  const [orders, setOrders] = useState([
    
  ]);

  // Estado para armazenar os dados do novo pedido
  const [newOrderData, setNewOrderData] = useState({ 
    cliente: '', 
    tecnico: '', 
    numeroInstalacao: '', 
    endereco: '', 
    status: 'Pendente' 
  });

  // Função para adicionar uma nova ordem
  const addOrder = () => {
    const newOrder = {
      id: orders.length + 1,
      cliente: newOrderData.cliente,
      tecnico: newOrderData.tecnico,
      numeroInstalacao: newOrderData.numeroInstalacao,
      endereco: newOrderData.endereco,
      status: newOrderData.status,
    };

    setOrders([...orders, newOrder]);
    setNewOrderData({ 
      cliente: '', 
      tecnico: '', 
      numeroInstalacao: '', 
      endereco: '', 
      status: 'Pendente' 
    }); // Limpa os campos do formulário após a submissão
  };

  // Função para remover uma ordem
  const deleteOrder = (id) => {
    setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: '5rem' }}>
      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: '1rem',
          p: 4,
        }}
      >
        <Typography variant="h4" gutterBottom>
          Ordens de Serviço
        </Typography>
        {/* Formulário para abrir uma nova ordem */}
        <form onSubmit={(e) => { e.preventDefault(); addOrder(); }}>
          <div>
            <label>
              Cliente:
              <input 
                type="text" 
                value={newOrderData.cliente} 
                onChange={(e) => setNewOrderData({ ...newOrderData, cliente: e.target.value })} 
                required 
              />
            </label>
          </div>
          <div>
            <label>
              Técnico:
              <input 
                type="text" 
                value={newOrderData.tecnico} 
                onChange={(e) => setNewOrderData({ ...newOrderData, tecnico: e.target.value })} 
                required 
              />
            </label>
          </div>
          <div>
            <label>
              Número de Instalação:
              <input 
                type="text" 
                value={newOrderData.numeroInstalacao} 
                onChange={(e) => setNewOrderData({ ...newOrderData, numeroInstalacao: e.target.value })} 
                required 
              />
            </label>
          </div>
          <div>
            <label>
              Endereço:
              <input 
                type="text" 
                value={newOrderData.endereco} 
                onChange={(e) => setNewOrderData({ ...newOrderData, endereco: e.target.value })} 
                required 
              />
            </label>
          </div>
          <div>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newOrderData.status}
                onChange={(e) => setNewOrderData({ ...newOrderData, status: e.target.value })}
              >
                <MenuItem value="Pendente">Pendente</MenuItem>
                <MenuItem value="Em andamento">Em andamento</MenuItem>
                <MenuItem value="Concluída">Concluída</MenuItem>
              </Select>
            </FormControl>
          </div>
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
            Abrir Ordem de Serviço
          </Button>
        </form>
        {/* Exibir a lista de ordens de serviço */}
        <ul>
          {orders.map(order => (
            <li key={order.id}>
              <div>
                <strong>Status:</strong>
                <FormControl fullWidth>
                  <InputLabel>Status</InputLabel>
                  <Select
                    value={order.status}
                    onChange={(e) => {
                      const updatedStatus = e.target.value;
                      const updatedOrders = orders.map(ord => (ord.id === order.id ? { ...ord, status: updatedStatus } : ord));
                      setOrders(updatedOrders);
                    }}
                  >
                    <MenuItem value="Pendente">Pendente</MenuItem>
                    <MenuItem value="Em andamento">Em andamento</MenuItem>
                    <MenuItem value="Concluída">Concluída</MenuItem>
                  </Select>
                </FormControl>
              </div>
              <strong>Cliente:</strong> {order.cliente} | <strong>Técnico:</strong> {order.tecnico} | <strong>Número de Instalação:</strong> {order.numeroInstalacao} | <strong>Endereço:</strong> {order.endereco}
              <Button
                variant="outlined"
                onClick={() => deleteOrder(order.id)}
                startIcon={<DeleteIcon />}
              >
                Excluir
              </Button>
            </li>
          ))}
        </ul>
      </Box>
    </Container>
  );
};

export default Orders;
