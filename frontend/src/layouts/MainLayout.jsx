import React from 'react';
import Navbar from '../components/Navbar'; // la grosse navbar

const MainLayout = ({ children }) => {
  return (
    <div>
      <Navbar />
      {children}
    </div>
  );
};

export default MainLayout;
