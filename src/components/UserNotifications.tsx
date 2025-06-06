import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Stack,
  Box,
  Switch,
  Button,
} from '@mui/material';
import { Notification } from '../types/notificationTypes';
import { getNotifications, markNotificationAsRead } from '../api/notificationApi';

export default function UserNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showRead, setShowRead] = useState(false);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const data: Notification[] = await getNotifications();
  
        const sorted = data.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
  
        setNotifications(sorted);
      } catch (err) {
        console.error(err);
        setError('No se pudieron cargar las notificaciones');
      } finally {
        setLoading(false);
      }
    };
  
    fetchNotifications(); // no olvides llamar la función
  }, []);  

  const handleMarkAsRead = async (id: number) => {
    try {
      await markNotificationAsRead(id);
      setNotifications((prev) =>
        prev.map((notif) =>
          notif.id === id ? { ...notif, read: true } : notif
        )
      );
    } catch  {
      alert('Error al marcar como leída');
    }
  };

  const filteredNotifications = notifications.filter((notif) => notif.read === showRead);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Tus notificaciones</Typography>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Switch
          checked={showRead}
          onChange={() => setShowRead((prev) => !prev)}
          color="primary"
        />
        <Typography>{showRead ? 'Leídas' : 'No leídas'}</Typography>
      </Box>
      {filteredNotifications.length === 0 ? (
        <Typography>No tienes notificaciones {showRead ? 'leídas' : 'no leídas'}.</Typography>
      ) : (
        filteredNotifications.map((notif) => (
          <Card
            key={notif.id}
            variant="outlined"
            sx={{
              backgroundColor: notif.read ? 'white' : '#f5f5f5',
              borderLeft: notif.read ? '4px solid #ccc' : '4px solid #1976d2',
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between" alignItems="center">
                <Typography variant="body1">{notif.message}</Typography>
                {!notif.read && (
                  <Button
                    size="small"
                    variant="contained"
                    color="primary"
                    onClick={() => handleMarkAsRead(notif.id!)}
                  >
                    Marcar como leída
                  </Button>
                )}
              </Box>
              <Typography variant="caption" color="text.secondary">
                {new Date(notif.createdAt).toLocaleString()}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Stack>
  );
}