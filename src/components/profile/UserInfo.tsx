import { Typography, Card, CardContent, Button } from '@mui/joy';
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
        <Typography level="h4">Información Personal</Typography>
        <Typography>Nombre: {user.name}</Typography>
        <Typography>Correo: {user.email}</Typography>
        <Typography>Teléfono: {user.phone}</Typography>
        <Button sx={{ mt: 2 }} onClick={onEdit}>Editar</Button>
      </CardContent>
    </Card>
  );
}