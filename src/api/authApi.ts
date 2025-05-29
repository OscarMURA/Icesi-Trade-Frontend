import axios from './axiosConfig';
import { LogInDto, TokenDto } from '../types/authTypes';

export async function loginRequest(data: LogInDto): Promise<TokenDto> {
  try {
    console.log('Intentando login con:', { email: data.email, password: '***' });
    const response = await axios.post('/g1/losbandalos/api/auth/login', data);
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
