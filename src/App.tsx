import { AuthProvider } from './contexts/AuthProvider';
import router from './routes/AppRouter';
import { RouterProvider } from 'react-router'
import { ChatProvider } from './context/ChatContext';

function App() {
  return (
    <ChatProvider>
      <AuthProvider>
        <RouterProvider router={router} />
      </AuthProvider>
    </ChatProvider>
  );
}

export default App;
