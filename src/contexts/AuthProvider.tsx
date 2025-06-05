import { useState, useEffect, ReactNode } from 'react';
import { AuthContext } from './AuthContext';

type User = {
    
  name: string;
  email: string;
  role: string;
};

type TokenDto = {
  name: string;
  email: string;
  roles: string[];
  token: string;
  creationDate: number;
  expirationDate: number;
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Verificar si hay un token válido al cargar la aplicación
    const token = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (token && storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setIsAuthenticated(true);
      } catch {
        // Si hay un error al parsear el usuario almacenado, limpiar el estado
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        setIsAuthenticated(false);
      }
    }
  }, []);

  const login = (data: TokenDto) => {
    const userData: User = {
      name: data.name,
      email: data.email,
      role: data.roles[0] || 'USER'
    };

    setUser(userData);
    setIsAuthenticated(true);
    
    // Guardar en localStorage
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('token', data.token);

    console.log('Usuario guardado en localStorage:', userData); 
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
} 