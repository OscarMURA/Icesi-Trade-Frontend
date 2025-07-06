import axios from './axiosConfig';
import { LogInDto, TokenDto, RegisterDto } from '../types/authTypes';

export async function loginRequest(data: LogInDto): Promise<TokenDto> {
  try {
    console.log('Intentando login con:', { email: data.email, password: '***' });
    const response = await axios.post('/api/auth/login', data);
    console.log('Respuesta del servidor:', response.data);
    
    if (!response.data || !response.data.token) {
      throw new Error('La respuesta del servidor no contiene un token válido');
    }
    
    return response.data;
  } catch (error: any) {
    console.error('Error en loginRequest:', error);
    if (error.response) {
      // El servidor respondió con un código de estado fuera del rango 2xx
      throw new Error(error.response.data?.error || 'Error en el servidor');
    } else if (error.request) {
      // La petición fue hecha pero no se recibió respuesta
      throw new Error('No se pudo conectar con el servidor. Por favor, verifica tu conexión.');
    } else {
      // Algo ocurrió al configurar la petición
      throw new Error('Error al procesar la petición: ' + error.message);
    }
  }
}

export async function registerRequest(data: RegisterDto): Promise<void> {
  try {
    const response = await axios.post('/api/users', data);
    if (response.status !== 201 && response.status !== 200) {
      throw new Error(response.data.message || 'Error al registrar usuario');
    }
  } catch (error: any) {
    console.error('Error en registerRequest:', error);
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('No se pudo completar el registro. Intenta más tarde.');
  }
}

export async function verifyEmail(token: string): Promise<any> {
  try {
    const response = await axios.post(`/api/auth/verify-email?token=${token}`);
    return response.data;
  } catch (error: any) {
    console.error('Error en verifyEmail:', error);
    if (error.response) {
      throw new Error(error.response.data?.error || 'Error verificando email');
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor');
    } else {
      throw new Error('Error al procesar la verificación: ' + error.message);
    }
  }
}

export async function resendVerification(email: string): Promise<any> {
  try {
    const response = await axios.post(`/api/auth/resend-verification?email=${email}`);
    return response.data;
  } catch (error: any) {
    console.error('Error en resendVerification:', error);
    if (error.response) {
      throw new Error(error.response.data?.error || 'Error reenviando verificación');
    } else if (error.request) {
      throw new Error('No se pudo conectar con el servidor');
    } else {
      throw new Error('Error al procesar la solicitud: ' + error.message);
    }
  }
}