import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Header from './components/Header/Header';
import Sidebar from './components/Sidebar/Sidebar';
import routes from './routes';
import './App.css';

function App() {
  return (
    <div className="d-flex flex-column vh-100">
    <Header />
    <div className="d-flex flex-grow-1 overflow-hidden">
      <Sidebar />
      <main className="flex-grow-1 p-3 overflow-auto">
        <Routes>
          {routes.map((route, idx) => (
            <Route key={idx} path={route.path} element={<route.component />} />
          ))}
        </Routes>
      </main>
    </div>
  </div>
  );
}

export default App;
