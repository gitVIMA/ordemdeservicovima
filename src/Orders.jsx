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
import { db } from './firebase';
import { collection, addDoc } from 'firebase/firestore';

const Orders = () => {
  // Estado para armazenar as ordens de serviço
  const [orders, setOrders] = useState([]);

  // Estado para armazenar os dados do novo pedido
  const [newOrderData, setNewOrderData] = useState({ 
    cliente: '', 
    tecnico: '', 
    numeroInstalacao: '', 
    endereco: '', 
    status: 'Pendente' 
  });

  // Função para adicionar uma nova ordem
  const addOrder = async () => {
    const newOrder = {
      cliente: newOrderData.cliente,
      tecnico: newOrderData.tecnico,
      numeroInstalacao: newOrderData.numeroInstalacao,
      endereco: newOrderData.endereco,
      status: newOrderData.status,
    };

    try {
      const docRef = await addDoc(collection(db, 'orders'), newOrder);
      console.log('Document written with ID: ', docRef.id);

      setOrders([...orders, { id: docRef.id, ...newOrder }]);
      setNewOrderData({ 
        cliente: '', 
        tecnico: '', 
        numeroInstalacao: '', 
        endereco: '', 
        status: 'Pendente' 
      });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
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
              <TextField
                fullWidth
                variant="outlined"
                value={newOrderData.cliente}
                onChange={(e) => setNewOrderData({ ...newOrderData, cliente: e.target.value })}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Técnico:
              <TextField
                fullWidth
                variant="outlined"
                value={newOrderData.tecnico}
                onChange={(e) => setNewOrderData({ ...newOrderData, tecnico: e.target.value })}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Número de Instalação:
              <TextField
                fullWidth
                variant="outlined"
                value={newOrderData.numeroInstalacao}
                onChange={(e) => setNewOrderData({ ...newOrderData, numeroInstalacao: e.target.value })}
                required
              />
            </label>
          </div>
          <div>
            <label>
              Endereço:
              <TextField
                fullWidth
                variant="outlined"
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
