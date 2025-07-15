import React from 'react';
import Navbar from '../components/Navbar'; // grosse navbar
import MinimalNavbar from '../components/MinimalNavbar';

const MainLayout = ({ children }) => {
  const token = localStorage.getItem('token');

  return (
    <div>
      {token ? <Navbar /> : <MinimalNavbar />}
      {children}
    </div>
  );
};

export default MainLayout;
