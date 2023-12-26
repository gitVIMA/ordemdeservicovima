        import React, { useState, useEffect, useRef } from 'react';
        import {Container, Typography, Box, Card, CardContent, Grid, FormControl, InputLabel, Select, MenuItem, Button, FormGroup, FormControlLabel, Checkbox, IconButton } from '@mui/material';
        import { db } from './firebase';
        import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
        import * as XLSX from 'xlsx';
        import VimaLogo from '/src/assets/logo-vima.png';
        import CemigLogo from '/src/assets/logo-cemig.png';
        import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
        import MapIcon from '@mui/icons-material/Map';
        import OrderStatusChart from './OrderStatusChart';
        import ServiceTypeChart from './ServiceTypeChart';
        import OrdersOverTimeChart from './OrdersOverTimeChart';
        import OrdersByTechnicianChart from './OrdersByTechnicianChart';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

        


        const OrderCard = ({ order, onEditFormulario }) => {
          
          const handleOpenInMaps = () => {
  const address = encodeURIComponent(order.endereco);
  window.open(`https://www.google.com/maps/search/?api=1&query=${address}`);

  // Adiciona ou remove o ID do card ao array de cards selecionados
  setSelectedOrders(prevSelectedOrders => {
    if (prevSelectedOrders.includes(order.id)) {
      return prevSelectedOrders.filter(id => id !== order.id);
    } else {
      return [...prevSelectedOrders, order.id];
    }
  });
};

          const statusColors = {
            Pendente: '#ffd700',
            EmProgresso: '#ffffff',
            EmAberto: '#ff4500',
            Concluída: '#d9f7d9',
            Retorno: '#87ceeb',
            Cancelada: '#808080'
          };

          const cardColor = statusColors[order.status] || 'inherit';
          const confirmChangeStatus = () => {
            const isConfirmed = window.confirm("Tem certeza de que deseja alterar o status do formulário em campo preenchido?");
            if (isConfirmed) {
              // Se confirmado, chame a função para editar o formulário
              onEditFormulario(order.id, order.formularioEmCampoPreenchido);
            }
          };

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
        {order.numeroEquipamento && (
          <Typography variant="body2" color="text.secondary">
            <strong>Número do equipamento:</strong> {order.numeroEquipamento}
          </Typography>
        )}
        {order.endereco && (
          <Typography variant="body2" color="text.secondary">
            <strong>Endereço:</strong> <a href="#" onClick={handleOpenInMaps}>{order.endereco}</a>
          </Typography>
      )}
      {order.coordenadas && (
        <Typography variant="body2" color="text.secondary">
          <strong>Coordenadas:</strong> {order.coordenadas}
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
                {order.formularioEmCampoPreenchido !== undefined && (
                  <Typography paragraph>
                    <strong>Formulário em campo preenchido até o momento?:</strong> {order.formularioEmCampoPreenchido === 'SIM' ? 'SIM' : 'NÃO'}
                    <Button color="primary" onClick={confirmChangeStatus} startIcon={<CheckCircleOutlineIcon />}>
                      {/* Adicione um ícone no lugar do texto */}
                    </Button>

                    {/* Adicione o botão "Gerar Rotas" com o ícone de mapa */}
                    <IconButton color="primary" onClick={handleOpenInMaps}>
                      <MapIcon />
                    </IconButton>
                  </Typography>
                )}



      {order.numeroOrdem && (
        <Typography paragraph>
          <strong>ID Ordem de Serviço:</strong> {order.numeroOrdem }
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
 <Box display="flex" justifyContent="space-between" alignItems="center">
          <img src={VimaLogo} alt="Logo Vima" style={{ height: '30px', marginRight: '10px' }} />
          <img src={CemigLogo} alt="Logo Cemig" style={{ height: '20px' }} />
        </Box>
      </CardContent>
    </Card>
  );
};



const Orders = () => {
  const handleEditFormulario = async (orderId, formularioEmCampoPreenchido) => {
    // Encontre a ordem no estado e atualize o valor para 'SIM' localmente
    const updatedOrders = orders.map(order => {
      if (order.id === orderId) {
        return {
          ...order,
          formularioEmCampoPreenchido: 'SIM',
        };
      }
      return order;
    });

    // Atualize o estado com as ordens atualizadas localmente
    setOrders(updatedOrders);

    // Agora, atualize os dados no Firestore
    const orderRef = doc(db, 'orders', orderId);
    await updateDoc(orderRef, { formularioEmCampoPreenchido: 'SIM' });
  };

  
  
  const [orders, setOrders] = useState([]);
  const [filter, setFilter] = useState('');
  const [sortBy, setSortBy] = useState('migrationDate');
  const [sortDirection, setSortDirection] = useState('asc');
  const [hideCompleted, setHideCompleted] = useState(false);
  const [orderCount, setOrderCount] = useState(0);
  const [displayedOrderCount, setDisplayedOrderCount] = useState(0);
  const [statusCounts, setStatusCounts] = useState({});
  const [displayedStatusCounts, setDisplayedStatusCounts] = useState({});
  const [selectedStatus, setSelectedStatus] = useState({Pendente: true, EmProgresso: true, EmAberto: true, Retorno: true, Concluída: true, Cancelada: true,});
  const [selectedFilters, setSelectedFilters] = useState({Instalação: true, "Manutenção e reparo": true, "Contato ou mensagem": true,});
  const [selectedFormulario, setSelectedFormulario] = useState({ SIM: false, NÃO: true });


  const filteredOrdersRef = useRef([]);
  const [searchTerm, setSearchTerm] = useState('');

  const filterOrders = (orders, searchTerm) => {
    return orders.filter(order => {
      const values = Object.values(order).join(' ').toLowerCase();
      const includesSearchTerm = values.includes(searchTerm.toLowerCase());
      const includesFormularioFilter = selectedFormulario[order.formularioEmCampoPreenchido];
      const includesStatusFilter = selectedStatus[order.status];

      console.log('Order:', order);
      console.log('Selected Formulario:', selectedFormulario);
      console.log('Includes Formulario Filter:', includesFormularioFilter);

      return includesSearchTerm && includesFormularioFilter && includesStatusFilter;
    });
  };

  const [showOnlyOrdersWithTechnician, setShowOnlyOrdersWithTechnician] = useState(true);

  const countStatus = (filteredOrders) => {
    const counts = {};

    filteredOrders.forEach(order => {
      const status = order.status;
      const formulario = order.formularioEmCampoPreenchido;
      counts[status] = (counts[status] || 0) + 1;

      // Adicione a contagem para o formulário
      counts[`Formulário ${formulario}`] = (counts[`Formulário ${formulario}`] || 0) + 1;
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

  const handleStatusChange = (event) => {
    const status = event.target.name;
    setSelectedStatus(prevStatus => ({
      ...prevStatus,
      [status]: !prevStatus[status],
    }));
  };


  const handleFilterChange = (filter) => {
    setSelectedFilters((prevFilters) => ({
      ...prevFilters,
      [filter]: !prevFilters[filter],
    }));
  };
  const handleFormularioFilterChange = (formulario) => {
    setSelectedFormulario((prevFormulario) => ({
      ...prevFormulario,
      [formulario]: !prevFormulario[formulario],
    }));
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

  const searchedOrders = searchTerm
    ? filterOrders(filteredOrders, searchTerm)
    : filteredOrders;

  const displayedOrders = hideCompleted
  ? searchedOrders.filter(
      (order) =>
        order.status !== 'Concluída' &&
        selectedStatus[order.status] &&
        selectedFilters[order.tipoServico] &&
        selectedFormulario[order.formularioEmCampoPreenchido] &&
        (!showOnlyOrdersWithTechnician || (showOnlyOrdersWithTechnician && order.tecnico))
    )
  : searchedOrders.filter(
      (order) =>
        selectedStatus[order.status] &&
        selectedFilters[order.tipoServico] &&
        selectedFormulario[order.formularioEmCampoPreenchido] &&
        (!showOnlyOrdersWithTechnician || (showOnlyOrdersWithTechnician && order.tecnico))
    );



  const exportToExcel = () => {
    const ws = XLSX.utils.json_to_sheet(displayedOrders);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");
    const fileName = "ordens_de_servico.xlsx";
    XLSX.writeFile(wb, fileName);
  };
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      mt="3rem"
      px={2}
      py={2}  // Adicionando preenchimento na parte superior e inferior para criar um espaço entre o conteúdo e o fundo
      style={{ background: 'rgba(32,178,170, 0.1)' }}  // Cor de fundo suave com transparência
      fontFamily="-apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif"
    >
      <Box display="flex" alignItems="center" mb={2}>
        <img src="src/assets/logo-vima.png" alt="Logo Vima" style={{ height: '60px', marginRight: '20px' }} />
        <img src="src/assets/logo-cemig.png" alt="Logo Cemig" style={{ height: '40px' }} />
      </Box>

      <Container maxWidth="lg">
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <Typography variant="h5" gutterBottom align="center" color="primary">
              Ordens de Serviço
            </Typography>
          </Grid>

          {/*Filtro previsão de atendimento e datas*/}
          
         
          <Grid item xs={12}>
            <FormControlLabel
              control={
                <Checkbox
                  checked={showOnlyOrdersWithTechnician}
                  onChange={() => setShowOnlyOrdersWithTechnician(!showOnlyOrdersWithTechnician)}
                  size="small"
                />
              }
              label="Exibir apenas ordens com técnico atribuído"
            />
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
            <FormControl fullWidth size="small" component="fieldset">
              <FormGroup row>
                {Object.keys(selectedStatus).map(status => (
                  <FormControlLabel
                    key={status}
                    control={<Checkbox checked={selectedStatus[status]} onChange={handleStatusChange} name={status} size="small" />}
                    label={status}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small" component="fieldset">
              <FormGroup row>
                {Object.keys(selectedFilters).map(filter => (
                  <FormControlLabel
                    key={filter}
                    control={<Checkbox checked={selectedFilters[filter]} onChange={() => handleFilterChange(filter)} name={filter} size="small" />}
                    label={filter}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small" component="fieldset">
              <Typography variant="body2" color="text.secondary">
                Exibir ORDENS com "Formulário em campo preenchido"
              </Typography>
              <FormGroup row>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFormulario['SIM']}
                      onChange={() => handleFormularioFilterChange('SIM')}
                      name="SIM"
                      size="small"
                    />
                  }
                  label="SIM"
                />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedFormulario['NÃO']}
                      onChange={() => handleFormularioFilterChange('NÃO')}
                      name="NÃO"
                      size="small"
                    />
                  }
                  label="NÃO"
                />
              </FormGroup>
            </FormControl>

          </Grid>



          {/*
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <FormGroup>
                {Object.keys(selectedStatus).map(status => (
                  <FormControlLabel
                    key={status}
                    control={<Checkbox checked={selectedStatus[status]} onChange={handleStatusChange} name={status} />}
                    label={status}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>
          <Grid item xs={12}>
            <FormControl fullWidth size="small">
              <FormGroup>
                {Object.keys(selectedFilters).map(filter => (
                  <FormControlLabel
                    key={filter}
                    control={<Checkbox checked={selectedFilters[filter]} onChange={() => handleFilterChange(filter)} name={filter} />}
                    label={filter}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Grid>
          */}

          <Grid item xs={12}>
            {Object.keys(displayedStatusCounts).map(status => (
              <Typography key={status} variant="body2" color="text.secondary">
                {`Total de ${status}: ${displayedStatusCounts[status]}`}
              </Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Pesquisar..."
              style={{ width: '100%', padding: '8px', fontSize: '1rem' }}
            />
          </Grid>
          {displayedOrders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.id}>
              <OrderCard
                order={order}
                onEditFormulario={handleEditFormulario}
              />
            </Grid>
          ))}
                </Grid>
              </Container>
              <Button variant="contained" color="primary" onClick={exportToExcel}>
                Exportar para Excel
              </Button>
            
       <OrderStatusChart orders={orders} />
      <ServiceTypeChart orders={orders} />
      <OrdersOverTimeChart orders={orders} />
      <OrdersByTechnicianChart orders={orders} />

      </Box>
          );
        };

        export default Orders;
