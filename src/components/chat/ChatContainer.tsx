import { useEffect, useState } from 'react';
import { UserResponseDto } from '../../types/userTypes';
import { useChatNavigation } from '../../hooks/useChatNavigation';
import ChatLayout from './ChatLayout';
import UserList from './UserList';
import ChatArea from './ChatArea';

interface ChatContainerProps {
  users: UserResponseDto[];
  selectedUser: UserResponseDto | null;
  messages: any[];
  currentUserId: number;
  message: string;
  onUserSelect: (user: UserResponseDto) => void;
  onMessageChange: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isConnected: boolean;
}

const ChatContainer: React.FC<ChatContainerProps> = ({
  users,
  selectedUser,
  messages,
  currentUserId,
  message,
  onUserSelect,
  onMessageChange,
  onSendMessage,
  isConnected
}) => {
  const { currentView,  goToChat, goToUsers, isMobile } = useChatNavigation();
  const [mobile, setMobile] = useState(false);

  // Detectar si es móvil
  useEffect(() => {
    const checkMobile = () => {
      setMobile(isMobile());
    };

    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, [isMobile]);

  // Manejar selección de usuario
  const handleUserSelect = (user: UserResponseDto) => {
    onUserSelect(user);
    if (mobile) {
      goToChat(user.id);
    }
  };

  // Si es desktop, mostrar layout tradicional
  if (!mobile) {
    return (
      <ChatLayout>
        <UserList 
          users={users}
          selectedUser={selectedUser}
          onUserSelect={handleUserSelect}
          isMobile={false}
        />
        <ChatArea 
          selectedUser={selectedUser}
          messages={messages}
          currentUserId={currentUserId}
          message={message}
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
          isConnected={isConnected}
          isMobile={false}
        />
      </ChatLayout>
    );
  }

  // Si es móvil, mostrar vista específica según el estado
  if (currentView === 'users') {
    return (
      <UserList 
        users={users}
        selectedUser={selectedUser}
        onUserSelect={handleUserSelect}
        isMobile={true}
      />
    );
  }

  // Vista de chat en móvil
  return (
    <ChatArea 
      selectedUser={selectedUser}
      messages={messages}
      currentUserId={currentUserId}
      message={message}
      onMessageChange={onMessageChange}
      onSendMessage={onSendMessage}
      isConnected={isConnected}
      isMobile={true}
      onBack={goToUsers}
    />
  );
};

export default ChatContainer; 