import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar/Navbar';

const Root: React.FC = () => {
  return (
    <div className="main-container w-full h-full">
      <Navbar />
      <Outlet />
    </div>
  );
};

export default Root;
