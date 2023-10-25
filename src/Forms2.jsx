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
  FormGroup,
  FormControlLabel,
  Checkbox
} from '@mui/material';
import { db } from './firebase';
import { collection, getDocs } from 'firebase/firestore';
//import * as XLSX from 'xlsx';
import TextField from '@mui/material/TextField';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';



const OrderCard = ({ order }) => {
  const handleOpenInMaps = () => {
    const address = encodeURIComponent(order.endereco);
    window.open(`https://www.google.com/maps/search/?api=1&query=${address}`);
  };

  const statusColors = {
    Pendente: '#ffd700',
    EmProgresso: '#ffffff',
    EmAberto: '#ff4500',
    Concluída: '#d9f7d9',
    Retorno: '#87ceeb',
    Cancelada: '#808080',
  };

  const cardColor = statusColors[order.status] || 'inherit';

  return (
    <Card variant="outlined" sx={{ marginBottom: '1rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', backgroundColor: cardColor }}>
      <CardContent>
        {order.cliente && (
          <Typography variant="body2" color="text.secondary">
            <strong>Cliente:</strong> {order.cliente}
          </Typography>
        )}
        {order.tecnico && (
          <Typography variant="body2" color="text.secondary">
            <strong>Especialista Técnico:</strong> {order.tecnico}
          </Typography>
        )}
        {order.contatoResponsavel && (
          <Typography variant="body2" color="text.secondary">
            <strong>Contato do Responsável:</strong> {order.contatoResponsavel}
          </Typography>
        )}
        {order.tipoServico && (
          <Typography variant="body2" color="text.secondary">
            <strong>Tipo de serviço:</strong> {order.tipoServico}
          </Typography>
        )}
        {order.numeroInstalacao && (
          <Typography variant="body2" color="text.secondary">
            <strong>Número de instalação:</strong> {order.numeroInstalacao}
          </Typography>
        )}
        {order.endereco && (
          <Typography variant="body2" color="text.secondary">
            <strong>Endereço:</strong> <a href="#" onClick={handleOpenInMaps}>{order.endereco}</a>
          </Typography>
        )}
        {order.status && (
          <Typography variant="body2" color="text.secondary">
            <strong>Status:</strong> {order.status}
          </Typography>
        )}
        {order.migrationDate && (
          <Typography variant="body2" color="text.secondary">
            <strong>Data de migração:</strong> {order.migrationDate}
          </Typography>
        )}
        {order.dataPrevistaAcao && (
          <Typography variant="body2" color="text.secondary">
            <strong>Data prevista para atendimento:</strong> {order.dataPrevistaAcao}
          </Typography>
        )}
        {order.observacoes && (
          <Typography variant="body2" color="text.secondary">
            <strong>Observações:</strong> {order.observacoes}
          </Typography>
        )}
        {order.tipoServico === 'Instalação' && (
          <>
            {order.ip && (
              <Typography variant="body2" color="text.secondary">
                <strong>IP:</strong> {order.ip}
              </Typography>
            )}
            {order.mascara && (
              <Typography variant="body2" color="text.secondary">
                <strong>MÁSCARA:</strong> {order.mascara}
              </Typography>
            )}
            {order.gateway && (
              <Typography variant="body2" color="text.secondary">
                <strong>GATEWAY:</strong> {order.gateway}
              </Typography>
            )}
          </>
        )}
        {order.agenteResponsavel && (
          <Typography variant="body2" color="text.secondary">
            <strong>Agente Responsável:</strong> {order.agenteResponsavel}
          </Typography>
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
  const [selectedStatus, setSelectedStatus] = useState({
    Pendente: true,
    EmProgresso: true,
    EmAberto: true,
    Retorno: true,
    Concluída: false,
    Cancelada: false,
  });
  const [selectedFilters, setSelectedFilters] = useState({
    Instalação: true,
    "Manutenção e reparo": true,
    "Contato ou mensagem": true,
  });
  const filteredOrdersRef = useRef([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filterOrders = (orders, searchTerm) => {
    return orders.filter(order => {
      const values = Object.values(order).join(' ').toLowerCase();
      return values.includes(searchTerm.toLowerCase());
    });
  };

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
          agenteResponsavel: data.agenteResponsavel,
        };
      });
      setOrders(ordersData);
      setOrderCount(ordersData.length);
    };

    fetchOrders();
  }, []);

  useEffect(() => {
    const filteredOrders = orders.filter(order => {
      const isSelectedStatus = selectedStatus[order.status];
      const isSelectedFilter = selectedFilters[order.tipoServico];
      const matchesSearchTerm = order.cliente.toLowerCase().includes(searchTerm.toLowerCase());
      return isSelectedStatus && isSelectedFilter && matchesSearchTerm;
    });

    filteredOrdersRef.current = filteredOrders;

    setDisplayedOrderCount(filteredOrders.length);

    const statusCounts = countStatus(filteredOrders);
    setStatusCounts(statusCounts);

    const displayedStatusCounts = countStatus(filteredOrders.slice(0, 10));
    setDisplayedStatusCounts(displayedStatusCounts);
  }, [selectedStatus, selectedFilters, searchTerm, orders]);

  useEffect(() => {
    const sortedOrders = [...filteredOrdersRef.current].sort((a, b) => {
      const keyA = a[sortBy];
      const keyB = b[sortBy];

      if (keyA < keyB) return sortDirection === 'asc' ? -1 : 1;
      if (keyA > keyB) return sortDirection === 'asc' ? 1 : -1;

      return 0;
    });

    setOrders(sortedOrders);
  }, [sortBy, sortDirection]);

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, 'orders', id));
      const updatedOrders = orders.filter(order => order.id !== id);
      setOrders(updatedOrders);
    } catch (error) {
      console.error('Error deleting document: ', error);
    }
  };

  const addOrder = async () => {
    const newOrder = {
      cliente: newOrderData.cliente,
      tecnico: newOrderData.tecnico,
      contatoResponsavel: newOrderData.contatoResponsavel,
      agenteResponsavel: newOrderData.agenteResponsavel,
      tipoServico: newOrderData.tipoServico,
      numeroInstalacao: newOrderData.numeroInstalacao,
      endereco: newOrderData.endereco,
      status: newOrderData.status,
      migrationDate: newOrderData.migrationDate,
      dataPrevistaAcao: newOrderData.dataPrevistaAcao,
      observacoes: newOrderData.observacoes,
      ip: newOrderData.ip,
      mascara: newOrderData.mascara,
      gateway: newOrderData.gateway,
    };

    try {
      const ordersRef = collection(db, 'orders');
      const docRef = await addDoc(ordersRef, newOrder);

      setOrders([...orders, { id: docRef.id, ...newOrder }]);
      setNewOrderData({
        cliente: '',
        tecnico: '',
        contatoResponsavel: '',
        agenteResponsavel: '',
        tipoServico: 'Instalação',
        numeroInstalacao: '',
        endereco: '',
        status: 'Pendente',
        migrationDate: '',
        dataPrevistaAcao: '',
        observacoes: '',
        ip: '',
        mascara: '',
        gateway: '',
      });
    } catch (error) {
      console.error('Error adding document: ', error);
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
        contatoResponsavel: '',
        agenteResponsavel: '',
        tipoServico: 'Instalação',
        numeroInstalacao: '',
        endereco: '',
        status: 'Pendente',
        migrationDate: '',
        dataPrevistaAcao: '',
        observacoes: '',
        ip: '',
        mascara: '',
        gateway: '',
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
      contatoResponsavel: '',
      agenteResponsavel: '',
      tipoServico: 'Instalação',
      numeroInstalacao: '',
      endereco: '',
      status: 'Pendente',
      migrationDate: '',
      dataPrevistaAcao: '',
      observacoes: '',
      ip: '',
      mascara: '',
      gateway: '',
    });
  };

  return (
    <Container maxWidth="lg">
      <Box mt={5}>
        <Typography variant="h4" component="div" gutterBottom>
          Ordens de Serviço
        </Typography>
        <Box mb={2} display="flex" justifyContent="space-between">
          <Button variant="contained" color="primary" onClick={addOrder}>
            Adicionar Ordem
          </Button>
          <Box>
            <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel>Filtrar por Status</InputLabel>
              <Select
                label="Filtrar por Status"
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
              >
                <MenuItem value="">Todos</MenuItem>
                {Object.keys(statusCounts).map((status) => (
                  <MenuItem key={status} value={status}>
                    {status} ({statusCounts[status]})
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel>Ordenar por</InputLabel>
              <Select
                label="Ordenar por"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <MenuItem value="dataPrevistaAcao">Data Prevista</MenuItem>
                <MenuItem value="status">Status</MenuItem>
              </Select>
            </FormControl>
            <FormControl variant="outlined" sx={{ m: 1, minWidth: 120 }}>
              <InputLabel>Direção</InputLabel>
              <Select
                label="Direção"
                value={sortDirection}
                onChange={(e) => setSortDirection(e.target.value)}
              >
                <MenuItem value="asc">Ascendente</MenuItem>
                <MenuItem value="desc">Descendente</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Box>
        <FormGroup row>
          {Object.keys(statusCounts).map((status) => (
            <FormControlLabel
              key={status}
              control={
                <Checkbox
                  checked={selectedStatus[status]}
                  onChange={(e) =>
                    setSelectedStatus({
                      ...selectedStatus,
                      [status]: e.target.checked,
                    })
                  }
                />
              }
              label={`${status} (${displayedStatusCounts[status] || 0})`}
            />
          ))}
        </FormGroup>
        <FormGroup row>
          {Object.keys(selectedFilters).map((filter) => (
            <FormControlLabel
              key={filter}
              control={
                <Checkbox
                  checked={selectedFilters[filter]}
                  onChange={(e) =>
                    setSelectedFilters({
                      ...selectedFilters,
                      [filter]: e.target.checked,
                    })
                  }
                />
              }
              label={filter}
            />
          ))}
        </FormGroup>
<TextField
  label="Pesquisar por Cliente"
  variant="outlined"
  fullWidth
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  sx={{ my: 2 }}
/>
<Grid container spacing={2}>
  {orders.map((order) => (
    <Grid item xs={12} sm={6} md={4} lg={3} key={order.id}>
      <OrderCard order={order} />
      <Box display="flex" justifyContent="space-between" mt={1}>
        <Button variant="contained" color="primary" onClick={() => handleEdit(order.id)}>
          Editar
        </Button>
        <Button onClick={() => handleDelete(order.id)}>
          Excluir
        </Button>
      </Box>
    </Grid>
  ))}
</Grid>
</Box>
</Container>
);
};

export default Orders;
