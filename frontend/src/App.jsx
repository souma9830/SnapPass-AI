import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import { ToastProvider } from './contexts/ToastContext';
import ToastContainer from './components/Toast/ToastContainer';
import './App.css';

function App() {
  return (
    <ToastProvider>
      <div className="app-shell">
        <Navbar />
        <main className="app-main">
          <AppRoutes />
        </main>
        <Footer />
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}

export default App;
