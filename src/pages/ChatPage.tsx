// src/pages/ChatPage.tsx
import { useState, useEffect, useCallback } from 'react';
import WebSocketService from '../services/WebSocketService';
import { getProfile } from '../api/userServices';
import { UserResponseDto } from '../types/userTypes';
import axios from 'axios';
import { useChat } from '../contexts/ChatContext';
import { addNotification } from '../api/notificationApi';

// Importar componentes modulares
import ChatContainer from '../components/chat/ChatContainer';
import ChatError from '../components/chat/ChatError';
import ChatLoading from '../components/chat/ChatLoading';

const ChatPage: React.FC = () => {
  const { selectedUserId, inputMessage, setInputMessage } = useChat();
  const [user, setUser] = useState<UserResponseDto | null>(null);
  const [users, setUsers] = useState<UserResponseDto[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserResponseDto | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isConnected, setIsConnected] = useState(false);

  const BASE_BACKEND = import.meta.env.VITE_BASE_URL;

  const handleReceiveMessage = useCallback((msg: any) => {
    try {
      const message = JSON.parse(msg.body);
      console.log('Mensaje recibido por WebSocket:', message);
      
      if (selectedUser && 
          (message.senderId === selectedUser.id || message.receiverId === selectedUser.id)) {
        setMessages(prev => {
          // Si es un mensaje temporal (sin ID), agregarlo directamente
          if (message.id === null || message.isTemporary) {
            console.log('Agregando mensaje temporal');
            return [...prev, message];
          }
          
          // Buscar si hay un mensaje temporal que coincida con este mensaje real
          const tempMessageIndex = prev.findIndex(existingMsg => 
            existingMsg.isTemporary && 
            existingMsg.content === message.content && 
            existingMsg.senderId === message.senderId && 
            existingMsg.receiverId === message.receiverId
          );
          
          if (tempMessageIndex !== -1) {
            console.log('Reemplazando mensaje temporal con real');
            // Reemplazar el mensaje temporal con el real
            const newMessages = [...prev];
            newMessages[tempMessageIndex] = message;
            return newMessages;
          }
          
          // Verificar si el mensaje ya existe para evitar duplicados
          const messageExists = prev.some(existingMsg => 
            existingMsg.id === message.id || 
            (existingMsg.content === message.content && 
             existingMsg.senderId === message.senderId && 
             existingMsg.receiverId === message.receiverId &&
             Math.abs(new Date(existingMsg.createdAt).getTime() - new Date(message.createdAt).getTime()) < 5000) // 5 segundos de tolerancia
          );
          
          if (messageExists) {
            console.log('Mensaje duplicado, ignorando');
            return prev; // No agregar si ya existe
          }
          
          console.log('Agregando nuevo mensaje');
          return [...prev, message];
        });
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

      // Obtenemos todos los usuarios
      const usersResponse = await axios.get(`${BASE_BACKEND}/api/chat/users`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (usersResponse.data && Array.isArray(usersResponse.data)) {
        // Filtramos los usuarios que no son el usuario actual
        const filteredUsers = usersResponse.data.filter((u: UserResponseDto) => u.id !== user?.id);
        
        // Para cada usuario, verificamos si hay mensajes entre el usuario actual y ese usuario
        const usersWithMessages = await Promise.all(
          filteredUsers.map(async (otherUser: UserResponseDto) => {
            try {
              const messagesResponse = await axios.get(
                `${BASE_BACKEND}/api/chat/messages?userId=${otherUser.id}`,
                {
                  headers: {
                    'Authorization': `Bearer ${token}`
                  }
                }
              );
              
              // Verificamos si hay mensajes entre el usuario actual y el otro usuario
              const hasMessagesWithCurrentUser = messagesResponse.data.some((msg: any) => 
                (msg.senderId === user?.id && msg.receiverId === otherUser.id) || 
                (msg.senderId === otherUser.id && msg.receiverId === user?.id)
              );
              
              // Incluimos al usuario si tiene mensajes o si es el vendedor seleccionado
              return (hasMessagesWithCurrentUser || otherUser.id === selectedUserId) ? otherUser : null;
            } catch (error) {
              console.error(`Error al obtener mensajes para usuario ${otherUser.id}:`, error);
              // Si hay error pero es el vendedor seleccionado, lo incluimos de todos modos
              return otherUser.id === selectedUserId ? otherUser : null;
            }
          })
        );

        // Filtramos los usuarios que tienen mensajes con el usuario actual o son el vendedor seleccionado
        const usersWithChats = usersWithMessages.filter((user): user is UserResponseDto => user !== null);
        
        setUsers(usersWithChats);

        if (selectedUserId && !selectedUser) {
          const userToSelect = usersWithChats.find(u => u.id === selectedUserId);
          if (userToSelect) {
            setSelectedUser(userToSelect);
            loadMessages(userToSelect.id);
          }
        }
      } else {
        console.error('Respuesta inválida del servidor:', usersResponse.data);
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
  }, [user?.id, BASE_BACKEND, selectedUserId, selectedUser]);

  const initializeChat = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No estás autenticado');
        setIsLoading(false);
        return;
      }

      const userData = await getProfile();
      setUser(userData);
      
      // Conectar al WebSocket
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
        //setTimeout(scrollToBottom, 100); // Pequeño delay para asegurar que los mensajes se hayan renderizado
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
      WebSocketService.disconnect();
      setIsConnected(false);
    };
  }, [initializeChat]);

  useEffect(() => {
    if (inputMessage) {
      setMessage(inputMessage);
      setInputMessage('');
    }
  }, [inputMessage, setInputMessage]);

  // Limpiar mensajes temporales después de 10 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      setMessages(prev => prev.filter(msg => !msg.isTemporary || Date.now() - new Date(msg.createdAt).getTime() < 10000));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

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

      console.log('Enviando mensaje:', message);
      WebSocketService.sendMessage(user.id, selectedUser.id, message);
      
      // Notificar al receptor del mensaje (de forma asíncrona para no bloquear)
      addNotification({
        createdAt: new Date().toISOString(),
        typeId: 1, // 1 = MESSAGE
        read: false,
        userId: selectedUser.id,
        message: `Has recibido un mensaje de ${user.name}`,
      }).catch(err => console.error('Error enviando notificación:', err));
      
      setMessage('');
      setInputMessage('');
    } catch (err) {
      console.error('Error al enviar mensaje:', err);
      setError('Error al enviar mensaje');
      setIsConnected(false);
    }
  };

  // Estados de carga y error
  if (isLoading) {
    return <ChatLoading />;
  }

  if (error) {
    return <ChatError error={error} onRetry={handleRetry} />;
  }

  if (!user) {
    return <ChatLoading />;
  }

  return (
    <ChatContainer
      users={users}
      selectedUser={selectedUser}
      messages={messages}
      currentUserId={user.id}
      message={message}
      onUserSelect={handleUserSelect}
      onMessageChange={setMessage}
      onSendMessage={handleSendMessage}
      isConnected={isConnected}
    />
  );
};

export default ChatPage;
