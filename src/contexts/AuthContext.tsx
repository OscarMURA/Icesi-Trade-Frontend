import { createContext } from 'react';
import { AuthResponseDto } from '../types/authTypes';

export interface AuthContextType {
  user: AuthResponseDto | null;
  isAuthenticated: boolean;
  login: (user: AuthResponseDto) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});
