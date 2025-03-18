import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { getToken } from '../api/auth';

interface PrivateRouteProps {
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const token = getToken();

  return token ? children : <Navigate to="/" />;
};

export default PrivateRoute;
