import { Typography } from '@mui/joy';
import { createBrowserRouter } from 'react-router-dom';
import AuthWrapper from '../components/auth/AuthWrapper';
import Home from '../pages/Home';
import Login from '../pages/Login';
import ProductDetail from '../pages/ProductDetail';
import ProductList from '../pages/ProductsManager';
import Profile from '../pages/Profile';
import Register from '../pages/Register';
import Layout from '../components/utils/Layout';
import CreateProduct from '../pages/CreateProduct';
import ChatPage from '../pages/ChatPage';

const router = createBrowserRouter([
  { 
    path: '/g1/losbandalos/Icesi-Trade', 
    element: <Layout />, 
    children: [
      {
        path: '',
        element: <Home />
      },
      {
        path: 'login',
        element: <Login />
      },
      {
        path: 'register',
        element: <Register />
      },
      {
        path: '',
        element: <AuthWrapper authorities={['ROLE_USER', 'ROLE_ADMIN']} />,
        children: [
          { path: 'profile', element: <Profile /> },
          { path: 'products', element: <ProductList /> },
          { path: 'products/:id', element: <ProductDetail /> },
          { path: 'create-product', element: <CreateProduct /> },
          { path: 'chat', element: <ChatPage /> }
        ]
      },
      {
        path: '*',
        element: <Typography>404 - Página no encontrada</Typography>
      }
    ] 
  },
]);

export default router;