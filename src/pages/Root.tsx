import React from 'react';
import Navbar from '../components/Navbar';
import { Outlet } from 'react-router-dom';

const Root: React.FC = () => {
  return (
    <div className="main-container w-full h-full">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Root;
