import React, { useState, useEffect } from 'react';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
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

const OrderCard = ({ order, handleStatusChange, handleEdit, handleDelete }) => {
  return (
    <Card variant="outlined" sx={{ marginBottom: '1rem' }}>
      <CardContent>
        <div>
          <strong>Status:</strong>
          <FormControl fullWidth>
            <InputLabel>Status</InputLabel>
            <Select
              value={order.status}
              onChange={(e) => handleStatusChange(order.id, e.target.value)}
            >
              <MenuItem value="Pendente">Pendente</MenuItem>
              <MenuItem value="Em andamento">Em andamento</MenuItem>
              <MenuItem value="Concluída">Concluída</MenuItem>
            </Select>
          </FormControl>
        </div>
        <strong>Cliente:</strong> {order.cliente} | <strong>Técnico:</strong> {order.tecnico} | <strong>Tipo de Serviço:</strong> {order.tipoServico} | <strong>Número de Instalação:</strong> {order.numeroInstalacao} | <strong>Endereço:</strong> {order.endereco}
      </CardContent>
      <CardActions>
        <Button
          size="small"
          startIcon={<EditIcon />}
          onClick={() => handleEdit(order.id)}
        >
          Editar
        </Button>
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
    status: 'Pendente' 
  });
  const [editingOrderId, setEditingOrderId] = useState(null);

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
      await deleteDoc(doc(db, 'orders', id));
      setOrders(prevOrders => prevOrders.filter(order => order.id !== id));
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', id);
      await updateDoc(orderRef, { status: newStatus });
      setOrders(prevOrders => prevOrders.map(order => (
        order.id === id ? { ...order, status: newStatus } : order
      )));
    } catch (error) {
      console.error('Error updating status: ', error);
    }
  };

  const handleEdit = (id) => {
    setEditingOrderId(id);
    const orderToEdit = orders.find(order => order.id === id);
    setNewOrderData({ ...orderToEdit });
  };

  const saveEdit = async () => {
    try {
      const orderRef = doc(db, 'orders', editingOrderId);
      await updateDoc(orderRef, newOrderData);
      setOrders(prevOrders => prevOrders.map(order => (
        order.id === editingOrderId ? { ...newOrderData, id: editingOrderId } : order
      )));
      setEditingOrderId(null);
      setNewOrderData({ 
        cliente: '', 
        tecnico: '', 
        tipoServico: 'Instalação', 
        numeroInstalacao: '', 
        endereco: '', 
        status: 'Pendente' 
      });
    } catch (error) {
      console.error('Error updating order: ', error);
    }
  };

  const cancelEdit = () => {
    setEditingOrderId(null);
    setNewOrderData({ 
      cliente: '', 
      tecnico: '', 
      tipoServico: 'Instalação', 
      numeroInstalacao: '', 
      endereco: '', 
      status: 'Pendente' 
    });
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
            padding: '1rem',
            border: '1px solid #ddd',
            borderRadius: '0.5rem',
          },
          '& .order-list strong': {
            marginRight: '0.5rem',
          },
          '& .order-list .MuiFormControl-root': {
            minWidth: '100%',
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
        <form onSubmit={(e) => { e.preventDefault(); editingOrderId ? saveEdit() : addOrder(); }} className="form-container">
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
                  <MenuItem value="Contato">Contato ou mensagem</MenuItem>
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
            {editingOrderId ? 'Salvar Alterações' : 'Abrir Ordem de Serviço'}
          </Button>
          {editingOrderId && (
            <Button 
              variant="outlined"
              onClick={cancelEdit}
              fullWidth
              sx={{ mt: 2 }}
            >
              Cancelar Edição
            </Button>
          )}
        </form>
        {/* Exibir a lista de ordens de serviço */}
        <div className="order-list">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              handleStatusChange={handleStatusChange}
              handleEdit={handleEdit}
              handleDelete={deleteOrder}
            />
          ))}
        </div>
      </Box>
    </Container>
  );
};

export default Orders;
