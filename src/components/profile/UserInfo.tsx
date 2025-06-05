import { Typography, Card, CardContent, Button } from '@mui/material';
import { UserResponseDto } from '../../types/userTypes';

export default function UserInfo({
  user,
  onEdit,
}: {
  user: UserResponseDto;
  onEdit: () => void;
}) {
  return (
    <Card>
      <CardContent>
        <Typography>Información Personal</Typography>
        <Typography>Nombre: {user.name}</Typography>
        <Typography>Correo: {user.email}</Typography>
        <Typography>Teléfono: {user.phone}</Typography>
        <Button sx={{ mt: 2 }} onClick={onEdit}>Editar</Button>
      </CardContent>
    </Card>
  );
}