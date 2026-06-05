import React from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import SnapPassAssistant from './chatbot/SnapPassAssistant';
import { useTheme } from './context/ThemeContext';
import './App.css';

function App() {
  const { darkMode, toggleTheme } = useTheme();

  return (
    <div className="app-shell">
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <main className="app-main">
        <AppRoutes darkMode={darkMode} toggleTheme={toggleTheme} />
      </main>
      <Footer darkMode={darkMode} toggleTheme={toggleTheme} />
      <SnapPassAssistant />
    </div>
  );
}
export default App;