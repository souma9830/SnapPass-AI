import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  return (
    <div className="app-shell">
      <Navbar />
      <main className="app-main">
        <AppRoutes />
      </main>
      <Footer />
    </div>
  );
}

export default App;
