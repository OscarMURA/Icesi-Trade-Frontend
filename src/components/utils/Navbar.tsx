import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/" className="text-2xl font-bold text-blue-600">Icesi Trade</Link>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/profile" className="hover:text-blue-600">Mi perfil</Link>
            <button onClick={handleLogout} className="text-red-600 hover:underline">Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/login" className="text-gray-700 hover:text-blue-600">Iniciar sesión</Link>
            <Link to="/register" className="text-gray-700 hover:text-blue-600">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}
