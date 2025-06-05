import { AuthProvider } from './contexts/AuthProvider';
import router from './routes/AppRouter';
import { RouterProvider } from 'react-router'

function App() {
  return (
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  );
}

export default App;
