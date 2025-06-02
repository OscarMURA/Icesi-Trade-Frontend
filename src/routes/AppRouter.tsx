import { Typography } from '@mui/joy';
import { createBrowserRouter } from 'react-router-dom';
import AuthWrapper from '../components/AuthWrapper';
import Home from '../pages/Home';
import Login from '../pages/Login';
import ProductDetail from '../pages/ProductDetail';
import ProductList from '../pages/ProductList';
import Profile from '../pages/Profile';
import Register from '../pages/Register';
import Layout from '../components/Layout';

const router = createBrowserRouter([
  { path: '', 
    element: <Layout />, 
    children: [
      {
        path: '/',
        element: <Home />
      },
      {
        path: '/login',
        element: <Login />
      },
      {
        path: '/register',
        element: <Register />
      },
      {
        path: '',
        element: <AuthWrapper authorities={['ROLE_USER', 'ROLE_ADMIN']} />,
        children: [
          { path: 'profile', element: <Profile /> },
          { path: 'products', element: <ProductList /> },
          { path: 'products/:id', element: <ProductDetail /> }
        ]
      },
      {
        path: '*',
        element: <Typography>404 - Página no encontrada</Typography>
      }
  ] },
]);

export default router;