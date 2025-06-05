import React, { createContext, useContext, useState, ReactNode } from 'react';

interface ChatContextType {
  selectedUserId: number | null;
  setSelectedUser: (userId: number) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const setSelectedUser = (userId: number) => {
    setSelectedUserId(userId);
  };

  return (
    <ChatContext.Provider value={{ selectedUserId, setSelectedUser }}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat debe ser usado dentro de un ChatProvider');
  }
  return context;
}; 