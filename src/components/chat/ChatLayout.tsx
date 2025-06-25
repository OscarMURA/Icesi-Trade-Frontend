import { Box } from '@mui/material';
import { ReactNode } from 'react';

interface ChatLayoutProps {
  children: ReactNode;
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {children}
    </Box>
  );
};

export default ChatLayout; 