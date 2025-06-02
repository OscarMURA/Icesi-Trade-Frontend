import { useContext, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Typography } from '@mui/joy';
import { AuthContext } from '../../contexts/AuthContext';

type Props = {
  authorities?: string[];
  redirect?: string;
};

export default function AuthWrapper({
  authorities = [],
  redirect = '/login',
}: Props) {
  const { user, isAuthenticated } = useContext(AuthContext);
  const [isAuthorized, setIsAuthorized] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(redirect, { state: { from: location } });
      return;
    }

    if (
      authorities.length === 0 ||
      (user && authorities.includes(user.role))
    ) {
      setIsAuthorized(true);
    } else {
      setIsAuthorized(false);
    }
  }, [isAuthenticated, user, authorities, navigate, location, redirect]);

  if (!isAuthenticated) return null;

  if (!isAuthorized) {
    return <Typography>No estás autorizado para acceder a esta página.</Typography>;
  }

  return <Outlet />;
}