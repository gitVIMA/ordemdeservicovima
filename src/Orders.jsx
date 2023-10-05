import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
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

  useEffect(() => {
    const fetchOrders = async () => {
      const ordersCollection = collection(db, 'orders');
      const ordersSnapshot = await getDocs(ordersCollection);
      const ordersData = ordersSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setOrders(ordersData);
    };

    fetchOrders();
  }, []);

  // Agrupar pedidos por tipo de serviço
  const groupedOrders = orders.reduce((acc, order) => {
    if (!acc[order.tipoServico]) {
      acc[order.tipoServico] = [];
    }
    acc[order.tipoServico].push(order);
    return acc;
  }, {});

  return (
    <Container maxWidth="lg" sx={{ marginTop: '5rem' }}>
      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: '1rem',
          p: 4,
        }}
      >
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom>
              Ordens de Serviço
            </Typography>
          </Grid>
          {/* Renderizar cada tipo de serviço em uma coluna */}
          {Object.keys(groupedOrders).map((tipoServico) => (
            <Grid item xs={12} sm={6} md={4} key={tipoServico}>
              <Typography variant="h6" gutterBottom>
                {tipoServico}
              </Typography>
              <div className="order-list">
                {groupedOrders[tipoServico].map((order) => (
                  <OrderCard
                    key={order.id}
                    order={order}
                  />
                ))}
              </div>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default Orders;
