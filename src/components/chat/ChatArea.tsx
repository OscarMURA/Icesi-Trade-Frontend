import { Box } from '@mui/material';
import { UserResponseDto } from '../../types/userTypes';
import ChatHeader from './ChatHeader';
import MobileChatHeader from './MobileChatHeader';
import MessageList from './MessageList';
import MessageInput from './MessageInput';
import EmptyChat from './EmptyChat';
import '../chat/ChatStyles.css';

interface ChatAreaProps {
  selectedUser: UserResponseDto | null;
  messages: any[];
  currentUserId: number;
  message: string;
  onMessageChange: (message: string) => void;
  onSendMessage: (e: React.FormEvent) => void;
  isConnected: boolean;
  isMobile?: boolean;
  onBack?: () => void;
}

const HEADER_MOBILE_HEIGHT = 70;

const ChatArea: React.FC<ChatAreaProps> = ({
  selectedUser,
  messages,
  currentUserId,
  message,
  onMessageChange,
  onSendMessage,
  isConnected,
  isMobile = false,
  onBack
}) => {
  if (!selectedUser) return <EmptyChat />;

  return (
    <Box
      sx={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        height: isMobile ? '100vh' : 'auto',
        minHeight: 0, // Para que flex funcione bien
        backgroundColor: '#fafafa',
        position: 'relative',
      }}
    >
      {/* Header sticky arriba */}
      {isMobile ? (
        <MobileChatHeader selectedUser={selectedUser} onBack={onBack!} />
      ) : (
        <ChatHeader selectedUser={selectedUser} />
      )}
      {/* Mensajes con scroll solo en esta área */}
      <Box
        sx={{
          flex: 1,
          overflowY: 'auto',
          minHeight: 0,
          display: 'flex',
          flexDirection: 'column',
          pt: isMobile ? `${HEADER_MOBILE_HEIGHT}px` : 0,
        }}
        className="chat-messages-container chat-mobile-container"
      >
        <MessageList messages={messages} currentUserId={currentUserId} />
      </Box>
      {/* Input sticky abajo */}
      <Box
        sx={{
          position: isMobile ? 'sticky' : 'static',
          bottom: 0,
          zIndex: 101,
          backgroundColor: 'white',
        }}
      >
        <MessageInput
          message={message}
          onMessageChange={onMessageChange}
          onSendMessage={onSendMessage}
          isConnected={isConnected}
        />
      </Box>
    </Box>
  );
};

export default ChatArea; 