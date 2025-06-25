import { Box, Typography } from '@mui/material';
import { UserResponseDto } from '../../types/userTypes';

interface ChatHeaderProps {
  selectedUser: UserResponseDto;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ selectedUser }) => {
  return (
    <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
      <Typography variant="h6">Chat con {selectedUser.name}</Typography>
    </Box>
  );
};

export default ChatHeader; 