import { Box, Paper, Typography } from '@mui/material';

interface MessageItemProps {
  message: {
    content: string;
    createdAt: string;
    senderId: number;
  };
  currentUserId: number;
}

const MessageItem: React.FC<MessageItemProps> = ({ message, currentUserId }) => {
  const isOwnMessage = message.senderId === currentUserId;

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: isOwnMessage ? 'flex-end' : 'flex-start',
        mb: 2
      }}
    >
      <Paper
        sx={{
          p: 2,
          backgroundColor: isOwnMessage ? 'primary.main' : 'white',
          color: isOwnMessage ? 'white' : 'black',
          maxWidth: '70%',
          boxShadow: 2,
          borderRadius: 2
        }}
      >
        <Typography>{message.content}</Typography>
        <Typography 
          variant="caption" 
          sx={{ 
            display: 'block', 
            textAlign: 'right', 
            mt: 0.5, 
            opacity: 0.7 
          }}
        >
          {new Date(message.createdAt).toLocaleTimeString()}
        </Typography>
      </Paper>
    </Box>
  );
};

export default MessageItem; 