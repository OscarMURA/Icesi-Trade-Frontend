import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import { Container, Box } from '@mui/material';

export default function Layout() {
  return (
    <>
      <Navbar />
      <Box component="main" sx={{ py: 4, backgroundColor: '#f9f9f9', minHeight: '100vh' }}>
        <Container maxWidth="lg">
          <Outlet />
        </Container>
      </Box>
    </>
  );
}