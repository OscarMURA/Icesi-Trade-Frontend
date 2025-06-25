import { Box, Typography } from '@mui/material';

const ChatLoading: React.FC = () => {
  return (
    <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <Typography>Cargando...</Typography>
    </Box>
  );
};

export default ChatLoading; 