import { Box, Button, TextField, Typography, List, ListItem, ListItemButton, ListItemText, Paper } from '@mui/material';
import { useState, useEffect, useCallback, useRef } from 'react';
import WebSocketService from '../services/WebSocketService';
import { getIdFromToken, getUserById } from '../api/userServices';
import { UserResponseDto } from '../types/userTypes';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';

const ChatPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResponseDto | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const BASE_BACKEND = import.meta.env.VITE_BASE_URL;

  const handleReceiveMessage = useCallback((msg: any) => {
    try {
      const message = JSON.parse(msg.body);
      console.log('Mensaje recibido:', message);
      if (selectedUser && 
          (message.senderId === selectedUser.id || message.receiverId === selectedUser.id)) {
        setMessages(prev => [...prev, message]);
      }
    } catch (err) {
      console.error('Error al procesar mensaje:', err);
    }
  }, [selectedUser]);

  const loadUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.get(`${BASE_BACKEND}/api/chat/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && Array.isArray(response.data)) {
        const filteredUsers = response.data.filter((u: UserResponseDto) => u.id !== user?.id);
        setUsers(filteredUsers);
        console.log('Usuarios cargados:', filteredUsers);

        // Manejar la redirección desde productos
        const userIdFromUrl = searchParams.get('userId');
        if (userIdFromUrl) {
          const userToSelect = filteredUsers.find(u => u.id === parseInt(userIdFromUrl));
          if (userToSelect) {
            handleUserSelect(userToSelect);
          }
        }
      } else {
        console.error('Respuesta inválida del servidor:', response.data);
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error: any) {
      console.error('Error al cargar usuarios:', error);
      if (error.response) {
        console.error('Respuesta del servidor:', error.response.data);
        console.error('Estado:', error.response.status);
      }
      throw new Error('Error al cargar usuarios');
    }
  }, [user?.id, BASE_BACKEND, searchParams]);

  const initializeChat = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No estás autenticado');
        setIsLoading(false);
        return;
      }

      const userData = await getUserById(getIdFromToken());
      setUser(userData);
      
      // Conectar al WebSocket
      console.log('Conectando al WebSocket con usuario:', userData.name);
      WebSocketService.connect(userData.name, userData.id, handleReceiveMessage);
      setIsConnected(true);
      
      // Cargar lista de usuarios
      await loadUsers();
      
      setIsLoading(false);
    } catch (err) {
      console.error('Error al inicializar el chat:', err);
      setError('Error al inicializar el chat');
      setIsLoading(false);
    }
  }, [handleReceiveMessage, loadUsers]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async (userId: number) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No hay token de autenticación');
      }

      const response = await axios.get(`${BASE_BACKEND}/api/chat/messages?userId=${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.data && Array.isArray(response.data)) {
        const filteredMessages = response.data.filter((msg: any) => 
          (msg.senderId === userId || msg.receiverId === userId) &&
          (msg.senderId === user?.id || msg.receiverId === user?.id)
        );
        setMessages(filteredMessages);
        console.log('Mensajes cargados:', filteredMessages);
        setTimeout(scrollToBottom, 100); // Pequeño delay para asegurar que los mensajes se hayan renderizado
      }
    } catch (error) {
      console.error('Error al cargar mensajes:', error);
      setError('Error al cargar mensajes');
    }
  };

  const handleUserSelect = async (selectedUser: UserResponseDto) => {
    setSelectedUser(selectedUser);
    setMessages([]);
    
    await loadMessages(selectedUser.id);
    
  };

  useEffect(() => {
    initializeChat();

    return () => {
      console.log('Desconectando WebSocket...');
      WebSocketService.disconnect();
      setIsConnected(false);
    };
  }, [initializeChat]);

  const handleRetry = async () => {
    setError(null);
    setIsLoading(true);
    try {
      await loadUsers();
      setIsLoading(false);
    } catch {
      setError('Error al cargar usuarios');
      setIsLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim() || !selectedUser || !user) return;

    try {
      if (!isConnected) {
        console.log('Reconectando WebSocket...');
        WebSocketService.connect(user.name, user.id, handleReceiveMessage);
        setIsConnected(true);
      }

      console.log('Enviando mensaje a:', selectedUser.name);
      WebSocketService.sendMessage(user.id, selectedUser.id, message);
      setMessage('');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      setError('Error al enviar mensaje');
      setIsConnected(false);
    }
  };

  if (isLoading) {
    return (
      <Box sx={{ p: 2, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
        <Typography color="error">{error}</Typography>
        <Button onClick={handleRetry} variant="contained">
          Reintentar
        </Button>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box sx={{ p: 2 }}>
        <Typography>Cargando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Lista de usuarios */}
      <Paper sx={{ width: 300, borderRight: '1px solid #e0e0e0' }}>
        <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
          <Typography variant="h6">Usuarios</Typography>
        </Box>
        <List>
          {users.length > 0 ? (
            users.map((u) => (
              <ListItem key={u.id} disablePadding>
                <ListItemButton 
                  selected={selectedUser?.id === u.id}
                  onClick={() => handleUserSelect(u)}
                >
                  <ListItemText primary={u.name} />
                </ListItemButton>
              </ListItem>
            ))
          ) : (
            <ListItem>
              <ListItemText primary="No hay usuarios disponibles" />
            </ListItem>
          )}
        </List>
      </Paper>

      {/* Área de chat */}
      <Box sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {selectedUser ? (
          <>
            <Box sx={{ p: 2, borderBottom: '1px solid #e0e0e0' }}>
              <Typography variant="h6">Chat con {selectedUser.name}</Typography>
            </Box>
            <Box sx={{ flex: 1, overflow: 'auto', p: 2, backgroundColor: '#f5f5f5' }}>
              {messages.map((msg, index) => (
                <Box
                  key={index}
                  sx={{
                    display: 'flex',
                    justifyContent: msg.senderId === user?.id ? 'flex-end' : 'flex-start',
                    mb: 2
                  }}
                >
                  <Paper
                    sx={{
                      p: 2,
                      backgroundColor: msg.senderId === user?.id ? 'primary.main' : 'white',
                      color: msg.senderId === user?.id ? 'white' : 'black',
                      maxWidth: '70%',
                      boxShadow: 2,
                      borderRadius: 2
                    }}
                  >
                    <Typography>{msg.content}</Typography>
                    <Typography variant="caption" sx={{ display: 'block', textAlign: 'right', mt: 0.5, opacity: 0.7 }}>
                      {new Date(msg.createdAt).toLocaleTimeString()}
                    </Typography>
                  </Paper>
                </Box>
              ))}
              <div ref={messagesEndRef} />
            </Box>
            <Box 
              component="form" 
              onSubmit={handleSendMessage} 
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
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Escribe un mensaje..."
                  variant="outlined"
                  size="small"
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
          </>
        ) : (
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
            <Typography variant="h6" color="text.secondary">
              Selecciona un usuario para comenzar a chatear
            </Typography>
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default ChatPage;
