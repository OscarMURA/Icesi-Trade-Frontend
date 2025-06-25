import { Box, Typography } from '@mui/material';

const MobileUsersHeader: React.FC = () => {
  return (
    <Box 
      sx={{ 
        p: 2, 
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'white',
        position: 'sticky',
        top: 0,
        zIndex: 10
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600 }}>
        Chats
      </Typography>
    </Box>
  );
};

export default MobileUsersHeader; 