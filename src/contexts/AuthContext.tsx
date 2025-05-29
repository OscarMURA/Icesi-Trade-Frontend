import { createContext, useState, useEffect, ReactNode } from 'react';

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

type AuthContextType = {
  user: User | null;
  login: (tokenDto: TokenDto) => void;
  logout: () => void;
  isAuthenticated: boolean;
};

export const AuthContext = createContext<AuthContextType>({} as AuthContextType);

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
      } catch (error) {
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
