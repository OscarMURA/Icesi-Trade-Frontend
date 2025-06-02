import { useEffect, useState } from 'react';
import { getProfile } from '../api/userServices';
import { UserResponseDto } from '../types/userTypes';

export default function Profile() {
  const [profile, setProfile] = useState<UserResponseDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token'); // O desde tu contexto
    if (token) {
      getProfile(token)
        .then(setProfile)
        .catch(err => setError(err.message));
    } else {
      setError('No estás autenticado');
    }
  }, []);

  if (error) return <p>Error: {error}</p>;
  if (!profile) return <p>Cargando...</p>;

  return (
    <div>
      <h2>Perfil de Usuario</h2>
      <p><strong>Nombre:</strong> {profile.name}</p>
      <p><strong>Email:</strong> {profile.email}</p>
      <p><strong>Teléfono:</strong> {profile.phone}</p>
    </div>
  );
}