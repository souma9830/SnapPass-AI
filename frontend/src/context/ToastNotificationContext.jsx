import React, { createContext, useContext, useState } from 'react';

const ToastNotificationContext = createContext();

export const ToastNotificationProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = (message, type = 'info') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  };

  return (
    <ToastNotificationContext.Provider value={{ toasts, addToast }}>
      {children}
    </ToastNotificationContext.Provider>
  );
};

export const useToastNotification = () => useContext(ToastNotificationContext);
