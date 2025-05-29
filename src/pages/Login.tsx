import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginRequest } from '../api/authApi';
import { LogInDto } from '../types/authTypes';
import useAuth from '../hooks/useAuth';
import MessageToast from '../components/MessageToast';
import LoadingSpinner from '../components/LoadingSpinner';

export default function Login() {
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState<LogInDto>({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redirigir si ya está autenticado
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/profile');
    }
  }, [isAuthenticated, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (!form.email || !form.password) {
        throw new Error('Por favor complete todos los campos');
      }

      console.log('Intentando login con:', { email: form.email, password: '***' });
      const response = await loginRequest(form);
      console.log('Respuesta del login:', response);

      if (!response || !response.token) {
        throw new Error('No se recibió un token válido del servidor');
      }

      login(response);
      navigate('/profile');
    } catch (err: any) {
      console.error('Error en login:', err);
      if (err.response) {
        // Error del servidor
        setError(err.response.data?.error || 'Error del servidor. Por favor intente nuevamente.');
      } else if (err.message) {
        // Error de validación o otro error
        setError(err.message);
      } else {
        setError('Error al iniciar sesión. Por favor intente nuevamente.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold text-center mb-4">Iniciar sesión</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium">Correo electrónico</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
            disabled={loading}
            placeholder="ejemplo@correo.com"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Contraseña</label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full border p-2 rounded"
            required
            disabled={loading}
            placeholder="••••••••"
          />
        </div>

        <button 
          type="submit" 
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:bg-blue-300"
          disabled={loading}
        >
          {loading ? 'Iniciando sesión...' : 'Ingresar'}
        </button>
      </form>

      {loading && <LoadingSpinner />}
      {error && <MessageToast message={error} type="error" />}
    </div>
  );
}
