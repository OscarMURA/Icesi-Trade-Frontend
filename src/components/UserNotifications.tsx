import { useEffect, useState } from 'react';
import {
  Card,
  CardContent,
  Typography,
  CircularProgress,
  Stack,
  Badge,
  Box,
} from '@mui/material';
import { Notification } from '../types/notificationTypes';
import { getNotifications } from '../api/notificationApi';

export default function UserNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Stack spacing={2}>
      <Typography variant="h5">Tus notificaciones</Typography>
      {notifications.length === 0 ? (
        <Typography>No tienes notificaciones.</Typography>
      ) : (
        notifications.map((notif) => (
          <Card
            key={notif.id}
            variant="outlined"
            sx={{
              backgroundColor: notif.read ? 'white' : '#f5f5f5',
              borderLeft: notif.read ? '4px solid #ccc' : '4px solid #1976d2',
            }}
          >
            <CardContent>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body1">{notif.message}</Typography>
                {!notif.read && (
                  <Badge
                    color="primary"
                    variant="dot"
                    sx={{ mt: 0.5 }}
                    title="No leída"
                  />
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