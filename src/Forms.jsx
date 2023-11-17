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

const OrderCard = ({ order, handleStatusChange, handleEdit, handleDelete }) => {//dados retornados do banco firebase
  return (
    <Card variant="outlined" sx={{ marginBottom: '1rem' }}>
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          <strong>Cliente:</strong> {order.cliente}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Especialista Técnico:</strong> {order.tecnico}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Contato do Responsável:</strong> {order.contatoResponsavel}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Agente Responsável:</strong> {order.agenteResponsavel}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Tipo de serviço:</strong> {order.tipoServico}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Número de instalação:</strong> {order.numeroInstalacao}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Número do Equipamento:</strong> {order.numeroEquipamento}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Endereço:</strong> {order.endereco}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Coordenadas:</strong> {order.coordenadas}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          <strong>Status:</strong> {order.status}
        </Typography>
        {order.tipoServico === 'Instalação' && (
          <Typography variant="body2" color="text.secondary">
            <strong>Data de migração:</strong> {order.migrationDate}
          </Typography>
        )}
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
    contatoResponsavel: '', 
    agenteResponsavel: '', 
    tipoServico: '', 
    numeroInstalacao: '', 
    numeroEquipamento: '',
    endereco: '', 
    status: 'Pendente', 
    migrationDate: '', 
    dataPrevistaAcao: '', 
    observacoes: '',
    ip: '172.25.35.',
    mascara: '255.255.255.0',
    gateway: '172.25.35.1',
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
      contatoResponsavel: newOrderData.contatoResponsavel,
      agenteResponsavel: newOrderData.agenteResponsavel,
      tipoServico: newOrderData.tipoServico,
      numeroInstalacao: newOrderData.numeroInstalacao,
      numeroEquipamento: newOrderData.numeroEquipamento,
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
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
          <img src="src/assets/logo-vima.png" alt="Logo Vima" style={{ height: '120px' }} />
          <img src="src/assets/logo-cemig.png" alt="Logo Cemig" style={{ height: '85px' }} />
        </div>
        <Typography variant="h4" gutterBottom align="center">
          Ordens de Serviço
        </Typography>
        {/* Formulário para abrir uma nova ordem */}
        <form onSubmit={(e) => { e.preventDefault(); editingOrderId ? saveEdit() : addOrder(); }} className="form-container">
          <div>
            <TextField
              fullWidth
              variant="outlined"
              label="Cliente"
              size="small"
              sx={{ marginBottom: '0.5rem' }}
              value={newOrderData.cliente}
              onChange={(e) => setNewOrderData({ ...newOrderData, cliente: e.target.value })}
              required
            />
          </div>
          <div>
            <TextField
              fullWidth
              variant="outlined"
              label="Especialista Técnico"
              size="small"
              sx={{ marginBottom: '0.5rem' }}
              value={newOrderData.tecnico}
              onChange={(e) => setNewOrderData({ ...newOrderData, tecnico: e.target.value })}
              //required
            />
          </div>
          <div>
            <TextField
              fullWidth
              variant="outlined"
              label="Contato do Responsável"
              size="small"
              sx={{ marginBottom: '0.5rem' }}
              value={newOrderData.contatoResponsavel}
              onChange={(e) => setNewOrderData({ ...newOrderData, contatoResponsavel: e.target.value })}
            />
          </div>
          <div>
            <TextField
              fullWidth
              variant="outlined"
              label="Agente Responsável"
              size="small"
              sx={{ marginBottom: '0.5rem' }}
              value={newOrderData.agenteResponsavel}
              onChange={(e) => setNewOrderData({ ...newOrderData, agenteResponsavel: e.target.value })}
            />
          </div>
          <div>
            <FormControl fullWidth variant="outlined" size="small" sx={{ marginBottom: '0.5rem' }}>
              <InputLabel>Tipo de serviço</InputLabel>
              <Select
                value={newOrderData.tipoServico}
                onChange={(e) => setNewOrderData({ ...newOrderData, tipoServico: e.target.value })}
                label="Tipo de serviço"
              >
                <MenuItem value="Instalação">Instalação</MenuItem>
                <MenuItem value="Manutenção e reparo">Manutenção e reparo</MenuItem>
                <MenuItem value="Contato ou mensagem">Contato ou mensagem</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>
            <TextField
              fullWidth
              variant="outlined"
              label="Número de instalação"
              size="small"
              sx={{ marginBottom: '0.5rem' }}
              value={newOrderData.numeroInstalacao}
              onChange={(e) => setNewOrderData({ ...newOrderData, numeroInstalacao: e.target.value })}
              //required
            />
          </div>
          <div>
            <TextField
              fullWidth
              variant="outlined"
              label="Número do equipamento"
              size="small"
              sx={{ marginBottom: '0.5rem' }}
              value={newOrderData.numeroEquipamento || ''}
              onChange={(e) => setNewOrderData({ ...newOrderData, numeroEquipamento: e.target.value })}
              //required
            />
          </div>
          <div>
            <TextField
              fullWidth
              variant="outlined"
              label="Endereço"
              size="small"
              sx={{ marginBottom: '0.5rem' }}
              value={newOrderData.endereco}
              onChange={(e) => setNewOrderData({ ...newOrderData, endereco: e.target.value })}
              required
            />
          </div>
          <div>
            <TextField
              fullWidth
              variant="outlined"
              label="Coordenadas"
              size="small"
              sx={{ marginBottom: '0.5rem' }}
              value={newOrderData.coordenadas || ''}
              onChange={(e) => setNewOrderData({ ...newOrderData, coordenadas: e.target.value })}
              //required
            />
          </div>
          {newOrderData.tipoServico === 'Instalação' && (
            <>
              <div>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="IP"
                  size="small"
                  sx={{ marginBottom: '0.5rem' }}
                  value={newOrderData.ip}
                  onChange={(e) => setNewOrderData({ ...newOrderData, ip: e.target.value })}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="MÁSCARA"
                  size="small"
                  sx={{ marginBottom: '0.5rem' }}
                  value={newOrderData.mascara}
                  onChange={(e) => setNewOrderData({ ...newOrderData, mascara: e.target.value })}
                />
              </div>
              <div>
                <TextField
                  fullWidth
                  variant="outlined"
                  label="GATEWAY"
                  size="small"
                  sx={{ marginBottom: '0.5rem' }}
                  value={newOrderData.gateway}
                  onChange={(e) => setNewOrderData({ ...newOrderData, gateway: e.target.value })}
                />
              </div>
            </>
          )}
          {newOrderData.tipoServico === 'Instalação' && (
            <div>
              <TextField
                fullWidth
                variant="outlined"
                label="Data de migração"
                size="small"
                sx={{ marginBottom: '0.5rem' }}
                value={newOrderData.migrationDate}
                onChange={(e) => setNewOrderData({ ...newOrderData, migrationDate: e.target.value })}
                //required 
                type="date"
              />
            </div>
          )}
          <div>
            <TextField
              fullWidth
              variant="outlined"
              label="Data prevista para atendimento"
              size="small"
              sx={{ marginBottom: '0.5rem' }}
              value={newOrderData.dataPrevistaAcao}
              onChange={(e) => setNewOrderData({ ...newOrderData, dataPrevistaAcao: e.target.value })}
              //required 
              type="date"
            />
          </div>
          <div>
            <FormControl fullWidth>
              <InputLabel>Status</InputLabel>
              <Select
                value={newOrderData.status}
                onChange={(e) => setNewOrderData({ ...newOrderData, status: e.target.value })}
              >
                <MenuItem value="Pendente">Pendente</MenuItem>
                <MenuItem value="EmProgresso">Em Progresso</MenuItem>
                <MenuItem value="Concluída">Concluída</MenuItem>
                <MenuItem value="Retorno">Retorno</MenuItem>
                <MenuItem value="Cancelada">Cancelada</MenuItem>
                <MenuItem value="EmAberto">Em Aberto</MenuItem>
              </Select>
            </FormControl>
          </div>
          <div>
            <TextField
              fullWidth
              variant="outlined"
              label="Observações"
              size="small"
              sx={{ marginBottom: '0.5rem' }}
              value={newOrderData.observacoes}
              onChange={(e) => setNewOrderData({ ...newOrderData, observacoes: e.target.value })}
            />
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