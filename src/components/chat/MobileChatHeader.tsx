import { Box, Typography, IconButton } from '@mui/material';
import { ArrowBack } from '@mui/icons-material';
import { UserResponseDto } from '../../types/userTypes';
import '../chat/ChatStyles.css';

interface MobileChatHeaderProps {
  selectedUser: UserResponseDto;
  onBack: () => void;
}

const MobileChatHeader: React.FC<MobileChatHeaderProps> = ({ selectedUser, onBack }) => {
  return (
    <Box 
      className="chat-mobile-header"
      sx={{ 
        p: 2, 
        borderBottom: '1px solid #e0e0e0',
        backgroundColor: 'white',
        display: 'flex',
        alignItems: 'center',
        gap: 2,
        position: 'fixed',
        top: 70,
        left: 0,
        right: 0,
        width: '100vw',
        zIndex: 1202,
        maxWidth: '100vw',
      }}
    >
      <IconButton 
        onClick={onBack}
        sx={{ 
          color: 'primary.main',
          '&:hover': {
            backgroundColor: 'rgba(25, 118, 210, 0.04)'
          }
        }}
      >
        <ArrowBack />
      </IconButton>
      <Typography variant="h6" sx={{ flex: 1 }}>
        {selectedUser.name}
      </Typography>
    </Box>
  );
};

export default MobileChatHeader; 