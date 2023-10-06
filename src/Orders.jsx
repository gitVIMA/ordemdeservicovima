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
    <Card variant="outlined" sx={{ marginBottom: '1rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
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
        <Typography variant="body2" color="text.secondary">
          <strong>Data de Migração:</strong> {order.dataMigracao}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Data prevista para Ação:</strong> {order.dataPrevistaAcao}
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
      const ordersData = ordersSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          dataMigracao: data.dataMigracao,
          dataPrevistaAcao: data.dataPrevistaAcao,
        };
      });
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
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
    >
      <Box display="flex" alignItems="center" mb={2}>
        <img src="src/assets/logo-vima.png" alt="Logo Vima" style={{ height: '80px', marginRight: '20px' }} />
        <img src="src/assets/logo-cemig.png" alt="Logo Cemig" style={{ height: '60px' }} />
      </Box>
      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom align="center" color="primary">
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