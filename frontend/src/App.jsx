import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import SnapPassAssistant from './chatbot/SnapPassAssistant';
import './App.css';

// bug-> when toggle is clicked , to change html over browser we need to alter dom
// documnet.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
// in a way we are telling the browser that the html element has a data attribute of theme with value dark or light
function App() {
  const [darkMode, setDarkMode] = useState(false);
  const toggleTheme = () => {
    setDarkMode(prev => !prev);
    const next = !darkMode;
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    return next; // this line was missing in the early code 
  }

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
