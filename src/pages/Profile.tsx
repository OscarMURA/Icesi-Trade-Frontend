import { useState, useEffect } from 'react';
import { UserResponseDto } from '../types/userTypes';
import UserInfo from '../components/profile/UserInfo';
import UserEditForm from '../components/profile/UserEditForm';
import { getUserById } from '../api/userServices';
import { getIdFromToken, getToken } from '../api/userServices';

export default function Profile() {
  const [profile, setProfile] = useState<UserResponseDto | null>(null);
  const [editing, setEditing] = useState(false);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);
  const handleUpdate = (updatedUser: UserResponseDto) => {
    setProfile(updatedUser);
    setEditing(false);
  };

  useEffect(() => {
    if (getToken()) {
      getUserById(getIdFromToken())
        .then(setProfile)
        .catch((error) => {
          console.error('Error al obtener el perfil:', error);
          setProfile(null);
        });
    } else {
      console.error('No se encontró el token de autenticación');
      setProfile(null);
    }}, []);

  if (!profile) return <p>Cargando...</p>;

  return (
    <div>
      {!editing ? (
        <UserInfo user={profile} onEdit={handleEdit} />
      ) : (
        <UserEditForm user={profile} onCancel={handleCancel} onUpdate={handleUpdate} />
      )}
    </div>
  );
}