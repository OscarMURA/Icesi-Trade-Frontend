import { Box, Typography } from '@mui/material';
import '../chat/ChatStyles.css';

const EmptyChat: React.FC = () => {
  return (
    <Box className="chat-empty-state">
      <Typography variant="h6" color="text.secondary">
        Selecciona un usuario para comenzar a chatear
      </Typography>
    </Box>
  );
};

export default EmptyChat; 