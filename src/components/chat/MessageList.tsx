import { Box } from '@mui/material';
import { useRef, useEffect } from 'react';
import MessageItem from './MessageItem';
import '../chat/ChatStyles.css';

interface MessageListProps {
  messages: any[];
  currentUserId: number;
}

const MessageList: React.FC<MessageListProps> = ({ messages, currentUserId }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <Box 
      className="chat-messages-container chat-mobile-container"
      sx={{ 
        flex: 1, 
        overflow: 'auto', 
        p: 2, 
        backgroundColor: '#f5f5f5' 
      }}
    >
      {messages.map((message, index) => (
        <MessageItem 
          key={index} 
          message={message} 
          currentUserId={currentUserId} 
        />
      ))}
      <div ref={messagesEndRef} />
    </Box>
  );
};

export default MessageList; 