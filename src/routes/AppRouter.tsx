import { Typography } from '@mui/material';
import { createBrowserRouter } from 'react-router-dom';
import AuthWrapper from '../components/auth/AuthWrapper';
import Layout from '../components/utils/Layout';
import ChatPage from '../pages/ChatPage';
import CreateProduct from '../pages/CreateProduct';
import Home from '../pages/Home';
import Login from '../pages/Login';
import MyProducts from '../pages/MyProducts';
import ProductDetail from '../pages/ProductDetail';
import ProductList from '../pages/ProductsManager';
import Profile from '../pages/Profile';
import Register from '../pages/Register';
import ProductSearch from '../pages/ProductSearch';
import MyFavoriteProducts from '../pages/MyFavoriteProducts';
import MyPurchases from '../pages/MyPurchases';
import UserNotifications from '../components/UserNotifications';
import AdminUserPanel from '../pages/AdminUserPanel';
import EmailVerification from '../pages/EmailVerification';
import VerificationPending from '../pages/VerificationPending';
import UserProfile from '../pages/UserProfile';

const router = createBrowserRouter([
  { 
    path: '/', 
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
        path: 'search',
        element: <ProductSearch />
      },
      {
        path: 'verify-email',
        element: <EmailVerification />
      },
      {
        path: 'verification-pending',
        element: <VerificationPending />
      },
      {
        path: '',
        element: <AuthWrapper authorities={['ROLE_USER', 'ROLE_ADMIN']} />,
        children: [
          { path: 'profile', element: <Profile /> },
          { path: 'user/:userId', element: <UserProfile /> },
          { path: 'products', element: <ProductList /> },
          { path: 'products/:id', element: <ProductDetail /> },
          { path: 'my-favorites', element: <MyFavoriteProducts /> },
          { path: 'create-product', element: <CreateProduct /> },
          { path: 'chat', element: <ChatPage /> },
          { path: 'my-products', element: <MyProducts /> },
          { path: 'my-purchases', element: <MyPurchases /> },
          { path: 'notifications', element: <UserNotifications /> },
          { path: 'admin-panel', element: <AdminUserPanel /> }
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