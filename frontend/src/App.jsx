import React, {useState} from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import './App.css';

function App() {
  const[darkMode, setDarkMode] = useState(false); 
  const toggleTheme = () =>{
    setDarkMode(prev=> !prev)
  }
  return (
    <div className="app-shell">
      <Navbar darkMode={darkMode} toggleTheme={toggleTheme} />
      <main className="app-main">
        <AppRoutes darkMode={darkMode} toggleTheme={toggleTheme}/>
      </main>
      <Footer darkMode={darkMode} toggleTheme={toggleTheme} />
    </div>
  );
}

export default App;
