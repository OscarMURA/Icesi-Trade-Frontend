import { useState } from 'react';
import { Input, Button, Card, CardContent, Stack } from '@mui/joy';
import { UserResponseDto } from '../../types/userTypes';

export default function UserEditForm({ user, onCancel }: { user: UserResponseDto ; onCancel: () => void }) {
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    phone: user.phone,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    alert('Actualizar usuario aquí con PUT');
    onCancel();
  };

  return (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Input name="name" value={form.name} onChange={handleChange} placeholder="Nombre" />
          <Input name="email" value={form.email} onChange={handleChange} placeholder="Correo" />
          <Input name="phone" value={form.phone} onChange={handleChange} placeholder="Teléfono" />
          <Stack direction="row" spacing={2}>
            <Button onClick={handleSave}>Guardar</Button>
            <Button variant="outlined" onClick={onCancel}>Cancelar</Button>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
}
