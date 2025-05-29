import { BrowserRouter } from 'react-router-dom';
import Navbar from './components/Navbar';
import AppRouter from './routes/AppRouter';
import { AuthProvider } from './contexts/AuthContext';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="min-h-screen bg-gray-100">
          <Navbar />
          <main className="p-6">
            <AppRouter />
          </main>
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
