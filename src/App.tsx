import { AuthProvider } from './contexts/AuthProvider';
import { ChatProvider } from './contexts/ChatContext';
import router from './routes/AppRouter';
import { RouterProvider } from 'react-router'

function App() {
  return (
    <AuthProvider>
      <ChatProvider>
        <RouterProvider router={router} />
      </ChatProvider>
    </AuthProvider>
  );
}

export default App;
