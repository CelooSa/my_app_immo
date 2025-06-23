import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  const token = localStorage.getItem('token');
  console.log('PrivateRoute token:', token); // Pour debug

  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
