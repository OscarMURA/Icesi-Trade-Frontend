// src/components/ChatLeftNavBar.tsx
import { Box, Button, List, ListItem, ListItemButton, ListItemText, Dialog, DialogTitle, DialogContent, DialogActions, TextField, Typography } from "@mui/material";
import { useState } from "react";

interface ChatLeftNavBarProps {
  username: string;
  setCurrentChat: (chat: string) => void;
  chats: string[];
  setChats: (chats: string[]) => void;
}

const ChatLeftNavBar: React.FC<ChatLeftNavBarProps> = ({
  username,
  setCurrentChat,
  chats,
  setChats
}) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [newChatUser, setNewChatUser] = useState("");

  const handleNewChat = () => {
    if (newChatUser && !chats.includes(newChatUser)) {
      setChats((prev) => [...prev, newChatUser]);
      setCurrentChat(newChatUser);
    }
    setOpenDialog(false);
    setNewChatUser("");
  };

  const handleChatSelect = (chat: string) => {
    setCurrentChat(chat);
  };

  return (
    <Box
      sx={{
        width: 250,
        height: '100vh',
        backgroundColor: '#f5f5f5',
        borderRight: '1px solid #e0e0e0',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
        <Typography variant="h6">Chats</Typography>
        <Typography variant="body2" color="text.secondary">
          Conectado como: {username}
        </Typography>
      </Box>

      <Button variant="contained" color="primary" sx={{ m: 2 }} onClick={() => setOpenDialog(true)}>
        Nuevo Chat
      </Button>

      <List sx={{ flex: 1, overflow: 'auto' }}>
        {chats.length > 0 ? (
          chats.map((chat) => (
            <ListItem key={chat} disablePadding>
              <ListItemButton onClick={() => handleChatSelect(chat)}>
                <ListItemText primary={chat} />
              </ListItemButton>
            </ListItem>
          ))
        ) : (
          <ListItem>
            <ListItemText primary="No hay chats disponibles" />
          </ListItem>
        )}
      </List>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Nuevo Chat</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Nombre del usuario"
            fullWidth
            variant="standard"
            value={newChatUser}
            onChange={(e) => setNewChatUser(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancelar</Button>
          <Button onClick={handleNewChat}>Confirmar</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default ChatLeftNavBar;
