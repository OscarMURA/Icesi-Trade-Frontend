import { useState } from 'react';
import { Input, Button, Card, CardContent, Stack } from '@mui/material';
import { UserResponseDto } from '../../types/userTypes';
import { updateUser } from '../../api/userServices';

export default function UserEditForm({
  user,
  onCancel,
  onUpdate,
}: {
  user: UserResponseDto;
  onCancel: () => void;
  onUpdate: (updatedUser: UserResponseDto) => void;
}) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
    password: '', 
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No autenticado');

      const dataToSend = {
        id: user.id,
        name: form.name,
        email: form.email,
        phone: form.phone,
        password: form.password.trim() === '' ? null : form.password.trim(),
      };

      const updated = await updateUser(user.id, dataToSend, token);
      onUpdate({ ...updated, password: '' }); 
    } catch (err) {
      console.error('Error actualizando usuario', err);
    }
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" />
          <Input name="email" value={form.email} onChange={handleChange} placeholder="Correo" />
          <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Teléfono" />
          <Input
            name="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Nueva contraseña (opcional)"
            type="password"
          />
          <Stack direction="row" spacing={2}>
            <Button onClick={handleSave}>Guardar</Button>
            <Button variant="outlined" onClick={onCancel}>Cancelar</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}