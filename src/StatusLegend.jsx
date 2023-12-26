import React from 'react';
import { Box, Typography } from '@mui/material';


const StatusLegend = () => {
  return (
    <Box mt={2} width="100%" textAlign="left">
      <Typography variant="h6" gutterBottom>
        Legenda de Status:
      </Typography>
      {/* Pendente */}
      <Box display="flex" alignItems="center">
        <Box
          width={20}
          height={20}
          bgcolor="#ffd700"
          marginRight={1}
          border="1px solid #000"
        />
        <Typography variant="body2">
          Pendente - Aguardando ação ou resposta.
        </Typography>
      </Box>
      {/* Em Progresso */}
      <Box display="flex" alignItems="center">
        <Box
          width={20}
          height={20}
          bgcolor="#ffffff"
          marginRight={1}
          border="1px solid #000"
        />
        <Typography variant="body2">
          Em Progresso - Em andamento ou em execução.
        </Typography>
      </Box>
      {/* Em Aberto */}
      <Box display="flex" alignItems="center">
        <Box
          width={20}
          height={20}
          bgcolor="#ff4500"
          marginRight={1}
          border="1px solid #000"
        />
        <Typography variant="body2">
          Em Aberto - Aguardando abertura ou início.
        </Typography>
      </Box>
      {/* Concluída */}
      <Box display="flex" alignItems="center">
        <Box
          width={20}
          height={20}
          bgcolor="#d9f7d9"
          marginRight={1}
          border="1px solid #000"
          border="1px solid #000"
        />
        <Typography variant="body2">
          Concluída - Ação ou trabalho concluído com sucesso.
        </Typography>
      </Box>
      {/* Retorno */}
      <Box display="flex" alignItems="center">
        <Box
          width={20}
          height={20}
          bgcolor="#87ceeb"
          marginRight={1}
          border="1px solid #000"
        />
        <Typography variant="body2">
          Retorno - Requer revisão ou retorno para nova ação.
        </Typography>
      </Box>
      {/* Cancelada */}
      <Box display="flex" alignItems="center">
        <Box
          width={20}
          height={20}
          bgcolor="#808080"
          marginRight={1}
          border="1px solid #000"
        />
        <Typography variant="body2">
          Cancelada - Ação ou solicitação cancelada.
        </Typography>
      </Box>
    </Box>
  );
};

export default StatusLegend;