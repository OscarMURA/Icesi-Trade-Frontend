import { Box, Typography, Button } from '@mui/material';

interface ChatErrorProps {
  error: string;
  onRetry: () => void;
}

const ChatError: React.FC<ChatErrorProps> = ({ error, onRetry }) => {
  return (
    <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
      <Typography color="error">{error}</Typography>
      <Button onClick={onRetry} variant="contained">
        Reintentar
      </Button>
    </Box>
  );
};

export default ChatError; 