import React from 'react';
import Sidebar from '../Sidebar/Sidebar';

const MainLayout = ({ children }) => {
  return (
    <div style={{ display: 'flex', height: '100%' }}>
      <Sidebar />
      <main style={{ flexGrow: 1, padding: '20px' }}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
