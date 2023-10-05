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
        {/* ... (outros campos) ... */}
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

  return (
    <Container maxWidth="sm" sx={{ marginTop: '5rem' }}>
      <Box
        sx={{
          border: 1,
          borderColor: 'divider',
          borderRadius: '1rem',
          p: 4,
          '& .order-list': {
            listStyleType: 'none',
            padding: 0,
            marginTop: '2rem',
          },
          '& .order-list li': {
            marginBottom: '1rem',
          },
          '& .order-list strong': {
            marginRight: '0.5rem',
          },
        }}
      >
        <Grid container justifyContent="center" spacing={2}>
          <Grid item xs={12} textAlign="center">
            <img src="src/assets/logo-vima.png" alt="Logo Vima" style={{ height: '120px' }} />
            <img src="src/assets/logo-cemig.png" alt="Logo Cemig" style={{ height: '120px' }} />
          </Grid>
          <Grid item xs={12}>
            <Typography variant="h4" gutterBottom align="center">
              Ordens de Serviço
            </Typography>
          </Grid>
        </Grid>

        {/* Exibir a lista de ordens de serviço */}
        <div className="order-list">
          {orders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
            />
          ))}
        </div>
      </Box>
    </Container>
  );
};

export default Orders;
