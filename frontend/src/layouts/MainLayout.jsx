import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';

const MainLayout = () => {
  return (
    <div className="App"> 
      <Navbar />
      <Outlet />
    </div>
  );
};

export default MainLayout;
