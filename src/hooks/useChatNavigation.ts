import { useState } from 'react';

export type ChatView = 'users' | 'chat';

export const useChatNavigation = () => {
  const [currentView, setCurrentView] = useState<ChatView>('users');
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null);

  const goToChat = (userId: number) => {
    setSelectedUserId(userId);
    setCurrentView('chat');
  };

  const goToUsers = () => {
    setCurrentView('users');
    setSelectedUserId(null);
  };

  const isMobile = () => {
    return window.innerWidth <= 650;
  };

  return {
    currentView,
    selectedUserId,
    goToChat,
    goToUsers,
    isMobile
  };
}; 