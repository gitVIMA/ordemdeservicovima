import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

const OrderCard = ({ order }) => {
  return (
    <Card variant="outlined" sx={{ marginBottom: '1rem' }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          <strong>Cliente:</strong> {order.cliente}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Técnico:</strong> {order.tecnico}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Tipo de Serviço:</strong> {order.tipoServico}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Número de Instalação:</strong> {order.numeroInstalacao}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Endereço:</strong> {order.endereco}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Status:</strong> {order.status}
        </Typography>
      </CardContent>
    </Card>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    };

    fetchOrders();
  }, []);

  const handleChangeFilter = (event) => {
    setFilter(event.target.value);
  };

  const filteredOrders = filter ? orders.filter(order => order.tipoServico === filter) : orders;

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mt="5rem"
      px={2}
    >
      <Box display="flex" alignItems="center" mb={2}>
        <img src="src/assets/logo-vima.png" alt="Logo Vima" style={{ height: '120px', marginRight: '20px' }} />
        <img src="src/assets/logo-cemig.png" alt="Logo Cemig" style={{ height: '85px' }} />
      </Box>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom align="center">
              Ordens de Serviço
            </Typography>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Tipo de Serviço</InputLabel>
              <Select
                value={filter}
                onChange={handleChangeFilter}
                label="Tipo de Serviço"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Instalação">Instalação</MenuItem>
                <MenuItem value="Manutenção e reparo">Manutenção e reparo</MenuItem>
                <MenuItem value="Contato ou mensagem">Contato ou mensagem</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          {filteredOrders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.id}>
              <OrderCard
                order={order}
              />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Orders;
