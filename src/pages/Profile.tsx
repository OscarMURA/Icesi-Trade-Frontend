import { useEffect, useState } from 'react';
import { getUserById } from '../api/userServices';
import { getIdFromToken } from '../api/userServices';
import { UserResponseDto } from '../types/userTypes';
import UserInfo from '../components/profile/UserInfo';
import UserEditForm from '../components/profile/UserEditForm';

export default function Profile() {
  const [profile, setProfile] = useState<UserResponseDto | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      getUserById(getIdFromToken(), token)
        .then(setProfile)
        .catch(err => setError(err.message));
    } else {
      setError('No estás autenticado');
    }
  }, []);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);
  const handleUpdate = (updatedUser: UserResponseDto) => {
    setProfile(updatedUser);
    setEditing(false);
  };

  if (error) return <p>Error: {error}</p>;
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