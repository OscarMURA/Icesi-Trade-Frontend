import { Typography, Card, CardContent } from '@mui/joy';
import { UserResponseDto } from '../../types/userTypes';

export default function UserInfo({ user } : { user: UserResponseDto }) {
  return (
    <Card>
      <CardContent>
        <Typography level="h4">Información Personal</Typography>
        <Typography>Nombre: {user.name}</Typography>
        <Typography>Correo: {user.email}</Typography>
        <Typography>Teléfono: {user.phone}</Typography>
      </CardContent>
    </Card>
  );
}