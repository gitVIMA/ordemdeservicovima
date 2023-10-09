import React, { useState, useEffect, useRef } from 'react';
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
  Button,
  TextField
} from '@mui/material';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';

const OrderCard = ({ order }) => {
  const handleOpenInMaps = () => {
    const address = encodeURIComponent(order.endereco);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`);
  };

 // Mapeamento de cores por status
  const statusColors = {
    Pendente: '#ffd700',  // Amarelo para status "Pendente"
    EmProgresso: '#ff8c00', // Laranja para status "Em Progresso"
    Concluída: '#d9f7d9', // Verde para status "Concluída"
    Cancelada: '#ff4500' // Vermelho para status "Cancelada"
   
  };

  const cardColor = statusColors[order.status] || 'inherit'; // Cor padrão se o status não estiver mapeado

  return (
    <Card variant="outlined" sx={{ marginBottom: '1rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', backgroundColor: cardColor }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          <strong>Cliente:</strong> {order.cliente}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Técnico:</strong> {order.tecnico}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Contato do Responsável:</strong> {order.contatoResponsavel}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Tipo de serviço:</strong> {order.tipoServico}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Número de instalação:</strong> {order.numeroInstalacao}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Endereço:</strong> <a href="#" onClick={handleOpenInMaps}>{order.endereco}</a>
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Status:</strong> {order.status}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Data de migração:</strong> {order.migrationDate}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Data prevista para atendimento:</strong> {order.dataPrevistaAcao}
        </Typography>
        {order.observacoes && (
          <Typography variant="body2" color="text.secondary">
            <strong>Observações:</strong> {order.observacoes}
          </Typography>
        )}
        {order.tipoServico === 'Instalação' && (
          <>
            <Typography variant="body2" color="text.secondary">
              <strong>IP:</strong> {order.ip}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>MÁSCARA:</strong> {order.mascara}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong>GATEWAY:</strong> {order.gateway}
            </Typography>
          </>
        )}
      </CardContent>
    </Card>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('dataPrevistaAcao');
  const [sortDirection, setSortDirection] = useState('asc');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [displayedOrderCount, setDisplayedOrderCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState({});
  const [displayedStatusCounts, setDisplayedStatusCounts] = useState({});
  const filteredOrdersRef = useRef([]);

  const countStatus = (filteredOrders) => {
    const counts = {};

    filteredOrders.forEach(order => {
      const status = order.status;
      counts[status] = (counts[status] || 0) + 1;
    });

    return counts;
  };

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
      setOrderCount(ordersData.length);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const filteredOrders = filteredOrdersRef.current.filter(order => !hideCompleted ? order.status !== 'Concluída' : true);
    setStatusCounts(countStatus(filteredOrders));
    updateOrderCount(filteredOrders);
    updateDisplayedOrderCount(filteredOrders.length);
    setDisplayedStatusCounts(countStatus(displayedOrders));
  }, [filteredOrdersRef.current, hideCompleted, orders, filter, sortBy, sortDirection]);

  const updateOrderCount = (filteredOrders) => {
    setOrderCount(filteredOrders.length);
  };

  const updateDisplayedOrderCount = (count) => {
    setDisplayedOrderCount(count);
  };

  const handleChangeFilter = (event) => {
    const selectedFilter = event.target.value;
    setFilter(selectedFilter);

    const filteredOrders = selectedFilter
      ? orders.filter(order => order.tipoServico === selectedFilter)
      : orders;

    const displayedOrders = hideCompleted
      ? filteredOrders.filter(order => order.status !== 'Concluída')
      : filteredOrders;

    setStatusCounts(countStatus(displayedOrders));

    updateOrderCount(filteredOrders);
    updateDisplayedOrderCount(displayedOrders.length);
    setDisplayedStatusCounts(countStatus(displayedOrders));
  };

  const handleSortByChange = (event) => {
    setSortBy(event.target.value);
  };

  const handleSortDirectionChange = (event) => {
    setSortDirection(event.target.value);
  };

  const handleHideCompletedToggle = () => {
    setHideCompleted(prev => !prev);
  };

  const sortedOrders = [...orders].sort((a, b) => {
    const fieldA = a[sortBy] || '';
    const fieldB = b[sortBy] || '';

    if (sortDirection === 'asc') {
      return fieldA.localeCompare(fieldB);
    } else {
      return fieldB.localeCompare(fieldA);
    }
  });

  const filteredOrders = filter
    ? sortedOrders.filter(order => order.tipoServico === filter)
    : sortedOrders;

  const displayedOrders = hideCompleted
    ? filteredOrders.filter(order => order.status !== 'Concluída')
    : filteredOrders;

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
              <InputLabel>Tipo de serviço</InputLabel>
              <Select
                value={filter}
                onChange={handleChangeFilter}
                label="Tipo de serviço"
              >
                <MenuItem value="">Todos</MenuItem>
                <MenuItem value="Instalação">Instalação</MenuItem>
                <MenuItem value="Manutenção e reparo">Manutenção e reparo</MenuItem>
                <MenuItem value="Contato ou mensagem">Contato ou mensagem</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Ordenar Por</InputLabel>
              <Select
                value={sortBy}
                onChange={handleSortByChange}
                label="Ordenar Por"
              >
                <MenuItem value="dataPrevistaAcao">Data prevista para atendimento</MenuItem>
                <MenuItem value="migrationDate">Data de migração</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Direção da Ordenação</InputLabel>
              <Select
                value={sortDirection}
                onChange={handleSortDirectionChange}
                label="Direção da Ordenação"
              >
                <MenuItem value="asc">Crescente</MenuItem>
                <MenuItem value="desc">Decrescente</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <Button variant="contained" onClick={handleHideCompletedToggle}>
              {hideCompleted ? 'Mostrar Concluídas' : 'Ocultar Concluídas'}
            </Button>
          </Grid>
          <Grid item xs={12}>
            {Object.keys(displayedStatusCounts).map(status => (
              <Typography key={status} variant="body2" color="text.secondary">
                {`Total de ${status}: ${displayedStatusCounts[status]}`}
              </Typography>
            ))}
          </Grid>
          {displayedOrders.map((order) => (
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