import { Paper, Box, Typography, List, ListItem, ListItemButton, ListItemText } from '@mui/material';
import { UserResponseDto } from '../../types/userTypes';
import MobileUsersHeader from './MobileUsersHeader';
import '../chat/ChatStyles.css';

interface UserListProps {
  users: UserResponseDto[];
  selectedUser: UserResponseDto | null;
  onUserSelect: (user: UserResponseDto) => void;
  isMobile?: boolean;
}

const UserList: React.FC<UserListProps> = ({ 
  users, 
  selectedUser, 
  onUserSelect, 
  isMobile = false 
}) => {
  return (
    <Paper sx={{ 
      width: isMobile ? '100%' : 300, 
      height: isMobile ? '100vh' : 'auto',
      borderRight: isMobile ? 'none' : '1px solid #e0e0e0'
    }}>
      {isMobile && <MobileUsersHeader />}
      <Box sx={{ p: isMobile ? 0 : 2, borderBottom: isMobile ? 'none' : '1px solid #e0e0e0' }}>
        {!isMobile && <Typography variant="h6">Usuarios</Typography>}
      </Box>
      <List 
        className="chat-users-list chat-mobile-container"
        sx={{ padding: 0 }}
      >
        {users.length > 0 ? (
          users.map((user) => (
            <ListItem key={user.id} disablePadding>
              <ListItemButton 
                selected={selectedUser?.id === user.id}
                onClick={() => onUserSelect(user)}
                className="chat-user-item chat-touch-target"
                sx={{
                  borderBottom: '1px solid #f0f0f0',
                  '&:hover': {
                    backgroundColor: '#f8f9fa'
                  },
                  '&.Mui-selected': {
                    backgroundColor: '#e3f2fd',
                    '&:hover': {
                      backgroundColor: '#e3f2fd'
                    }
                  }
                }}
              >
                <ListItemText 
                  primary={user.name}
                  primaryTypographyProps={{
                    sx: { fontWeight: selectedUser?.id === user.id ? 600 : 400 }
                  }}
                />
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText 
              primary="No hay usuarios disponibles"
              sx={{ textAlign: 'center', color: 'text.secondary' }}
            />
          </ListItem>
        )}
      </List>
    </Paper>
  );
};

export default UserList; 