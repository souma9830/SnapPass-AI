import React, { useEffect } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import SkipToContent from './components/SkipToContent';
import SnapPassAssistant from './chatbot/SnapPassAssistant';
import { ToastProvider, useToast } from './context/ToastContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { ThemeCustomizerProvider } from './context/ThemeCustomizerContext';
import './App.css';
import ScrollToTopButton from './components/ScrollToTopButton';
import { scanBackendPorts } from './services/portSync';


function AppContent() {
  // Retrieve global visual and functional preferences from mounted contexts
  const { darkMode, toggleTheme } = useTheme();
  const { showToast } = useToast();

  useEffect(() => {
    if (import.meta.env.DEV) {
      scanBackendPorts().then((discoveredPort) => {
      .catch(err => console.error(err))