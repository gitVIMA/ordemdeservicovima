import React, { useState, useEffect } from 'react';
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
  Card,
  CardContent,
  CardActions,
} from '@mui/material';
import { db } from './firebase';
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from 'firebase/firestore';

const OrderCard = ({ order, handleStatusChange, handleDelete }) => {
  return (
    <Card variant="outlined" sx={{ marginBottom: '1rem' }}>
      <CardContent>
        <Typography variant="h6" component="div">
          Cliente: {order.cliente}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Técnico: {order.tecnico}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Tipo de Serviço: {order.tipoServico}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Número de Instalação: {order.numeroInstalacao}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Endereço: {order.endereco}
        </Typography>
        <FormControl fullWidth>
          <InputLabel>Status</InputLabel>
          <Select
            value={order.status}
            onChange={(e) => handleStatusChange(e, order.id)}
          >
            <MenuItem value="Pendente">Pendente</MenuItem>
            <MenuItem value="Em andamento">Em andamento</MenuItem>
            <MenuItem value="Concluída">Concluída</MenuItem>
          </Select>
        </FormControl>
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => handleDelete(order.id)}
        >
          Excluir
        </Button>
      </CardActions>
    </Card>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [newOrderData, setNewOrderData] = useState({
    cliente: '',
    tecnico: '',
    tipoServico: 'Instalação',
    numeroInstalacao: '',
    endereco: '',
    status: 'Pendente',
  });

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    };

    fetchOrders();
  }, []);

  const addOrder = async () => {
    const newOrder = {
      cliente: newOrderData.cliente,
      tecnico: newOrderData.tecnico,
      tipoServico: newOrderData.tipoServico,
      numeroInstalacao: newOrderData.numeroInstalacao,
      endereco: newOrderData.endereco,
      status: newOrderData.status,
    };

    try {
      const ordersRef = collection(db, 'orders');
      const docRef = await addDoc(ordersRef, newOrder);

      setOrders([...orders, { id: docRef.id, ...newOrder }]);
      setNewOrderData({ 
        cliente: '', 
        tecnico: '', 
        tipoServico: 'Instalação', 
        numeroInstalacao: '', 
        endereco: '', 
        status: 'Pendente' 
      });
    } catch (error) {
      console.error('Error adding document: ', error);
    }
  };

  const deleteOrder = async (id) => {
    try {
      // Remove do Firestore
      await deleteDoc(doc(db, 'orders', id));
      
      // Remove do estado local
      setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const handleStatusChange = async (e, id) => {
    const updatedStatus = e.target.value;
    try {
      const ordersRef = doc(db, 'orders', id);
      await updateDoc(ordersRef, { status: updatedStatus });

      const updatedOrders = orders.map(ord => (ord.id === id ? { ...ord, status: updatedStatus } : ord));
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ marginTop: '5rem' }}>
      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: '1rem',
          p: 4,
          '& .form-container': {
            marginBottom: '1rem',
          },
          '& .form-container label': {
            display: 'block',
            marginBottom: '0.5rem',
          },
          '& .form-container .MuiTextField-root': {
            marginBottom: '1rem',
          },
          '& .form-container .MuiButton-root': {
            marginTop: '1rem',
          },
          '& .order-list': {
            listStyleType: 'none',
            padding: 0,
            marginTop: '2rem',
          },
          '& .order-list li': {
            marginBottom: '1rem',
          },
          '& .delete-button': {
            marginTop: '1rem',
          },
        }}
      >
        <Typography variant="h4" gutterBottom>
          O.S - VIMA Telecom / CEMIG (setor de medição)
        </Typography>
        {/* Formulário para abrir uma nova ordem */}
        <form onSubmit={(e) => { e.preventDefault(); addOrder(); }} className="form-container">
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
              Tipo de Serviço:
              <FormControl fullWidth>
                <InputLabel>Tipo de Serviço</InputLabel>
                <Select
                  value={newOrderData.tipoServico}
                  onChange={(e) => setNewOrderData({ ...newOrderData, tipoServico: e.target.value })}
                >
                  <MenuItem value="Instalação">Instalação</MenuItem>
                  <MenuItem value="Manutenção">Manutenção e reparo</MenuItem>
                   <MenuItem value="Contato">Contato</MenuItem>
                </Select>
              </FormControl>
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
          <Button variant="contained" type="submit" fullWidth>
            Abrir Ordem de Serviço
          </Button>
        </form>
        {/* Exibir a lista de ordens de serviço */}
        <div className="order-list">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              handleStatusChange={handleStatusChange}
              handleDelete={deleteOrder}
            />
          ))}
        </div>
      </Box>
    </Container>
  );
};

export default Orders;
