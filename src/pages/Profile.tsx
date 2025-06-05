import { useState } from 'react';
import { UserResponseDto } from '../types/userTypes';
import UserInfo from '../components/profile/UserInfo';
import UserEditForm from '../components/profile/UserEditForm';

export default function Profile() {
  const [profile, setProfile] = useState<UserResponseDto | null>(null);
  const [editing, setEditing] = useState(false);

  const handleEdit = () => setEditing(true);
  const handleCancel = () => setEditing(false);
  const handleUpdate = (updatedUser: UserResponseDto) => {
    setProfile(updatedUser);
    setEditing(false);
  };

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