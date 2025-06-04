import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/g1/losbandalos/Icesi-Trade/login');
  };

  return (
    <nav className="bg-white shadow px-6 py-4 flex justify-between items-center">
      <Link to="/g1/losbandalos/Icesi-Trade" className="text-2xl font-bold text-blue-600">Icesi Trade</Link>

      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link to="/g1/losbandalos/Icesi-Trade/profile" className="hover:text-blue-600">Mi perfil</Link>
            <Link to="/g1/losbandalos/Icesi-Trade/chat" className="hover:text-blue-600">
              <div className="flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                </svg>
                Chat
              </div>
            </Link>
            <button onClick={handleLogout} className="text-red-600 hover:underline">Cerrar sesión</button>
          </>
        ) : (
          <>
            <Link to="/g1/losbandalos/Icesi-Trade/login" className="text-gray-700 hover:text-blue-600">Iniciar sesión</Link>
            <Link to="/g1/losbandalos/Icesi-Trade/register" className="text-gray-700 hover:text-blue-600">Registrarse</Link>
          </>
        )}
      </div>
    </nav>
  );
}
