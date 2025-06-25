import { Box, TextField, Button } from '@mui/material';
import { FormEvent } from 'react';
import '../chat/ChatStyles.css';

interface MessageInputProps {
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: (e: FormEvent) => void;
  isConnected: boolean;
}

const MessageInput: React.FC<MessageInputProps> = ({ 
  message, 
  onMessageChange, 
  onSendMessage, 
  isConnected 
}) => {
  return (
    <Box 
      component="form" 
      onSubmit={onSendMessage} 
      className="chat-input-container"
      sx={{ 
        p: 2, 
        borderTop: '1px solid #e0e0e0',
        backgroundColor: 'white',
        position: 'sticky',
        bottom: 0,
        boxShadow: '0px -2px 4px rgba(0,0,0,0.1)'
      }}
    >
      <Box sx={{ display: 'flex', gap: 1, maxWidth: '800px', margin: '0 auto' }}>
        <TextField
          fullWidth
          value={message}
          onChange={(e) => onMessageChange(e.target.value)}
          placeholder="Escribe un mensaje..."
          variant="outlined"
          size="small"
          className="chat-input-field"
          sx={{
            backgroundColor: '#f8f9fa',
            '& .MuiOutlinedInput-root': {
              '& fieldset': {
                borderColor: '#e0e0e0',
              },
              '&:hover fieldset': {
                borderColor: '#bdbdbd',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
        <Button 
          type="submit" 
          variant="contained" 
          disabled={!message.trim() || !isConnected}
          className="chat-button"
          sx={{
            minWidth: '100px',
            backgroundColor: 'primary.main',
            '&:hover': {
              backgroundColor: 'primary.dark',
            },
          }}
        >
          Enviar
        </Button>
      </Box>
    </Box>
  );
};

export default MessageInput; 