import React, { useState } from 'react';
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
  const [orders, setOrders] = useState([
    {
      id: 1,
      cliente: 'João Silva',
      tecnico: 'Maria Oliveira',
      numeroInstalacao: '12345',
      endereco: 'Rua A, 123',
      status: 'Pendente',
    },
    // ... Adicione mais ordens conforme necessário
  ]);

  const [newOrderData, setNewOrderData] = useState({
    cliente: '',
    tecnico: '',
    numeroInstalacao: '',
    endereco: '',
    status: 'Pendente',
  });

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
      status: 'Pendente',
    });
  };

  const deleteOrder = (id) => {
    setOrders((prevOrders) => prevOrders.filter((order) => order.id !== id));
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
        <form onSubmit={(e) => { e.preventDefault(); addOrder(); }}>
          <TextField
            label="Cliente"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newOrderData.cliente}
            onChange={(e) => setNewOrderData({ ...newOrderData, cliente: e.target.value })}
            required
          />
          <TextField
            label="Técnico"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newOrderData.tecnico}
            onChange={(e) => setNewOrderData({ ...newOrderData, tecnico: e.target.value })}
            required
          />
          <TextField
            label="Número de Instalação"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newOrderData.numeroInstalacao}
            onChange={(e) => setNewOrderData({ ...newOrderData, numeroInstalacao: e.target.value })}
            required
          />
          <TextField
            label="Endereço"
            variant="outlined"
            fullWidth
            margin="normal"
            value={newOrderData.endereco}
            onChange={(e) => setNewOrderData({ ...newOrderData, endereco: e.target.value })}
            required
          />
          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={newOrderData.status}
              onChange={(e) => setNewOrderData({ ...newOrderData, status: e.target.value })}
            >
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Em andamento">Em andamento</MenuItem>
              <MenuItem value="Concluída">Concluída</MenuItem>
            </Select>
          </FormControl>
          <Button variant="contained" type="submit" fullWidth sx={{ mt: 2 }}>
            Abrir Ordem de Serviço
          </Button>
        </form>
        <ul>
          {orders.map((order) => (
            <li key={order.id}>
              <strong>Cliente:</strong> {order.cliente} | <strong>Técnico:</strong> {order.tecnico} | <strong>Número de Instalação:</strong>{' '}
              {order.numeroInstalacao} | <strong>Endereço:</strong> {order.endereco} | <strong>Status:</strong> {order.status}
              <Button variant="outlined" onClick={() => deleteOrder(order.id)}>
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
