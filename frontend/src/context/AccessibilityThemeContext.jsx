import React, { createContext, useContext, useState } from 'react';

const AccessibilityThemeContext = createContext();

export const AccessibilityThemeProvider = ({ children }) => {
    const [highContrast, setHighContrast] = useState(false);
    return (
        <AccessibilityThemeContext.Provider value={{ highContrast, toggle: () => setHighContrast(p => !p) }}>
            {children}
        </AccessibilityThemeContext.Provider>
    );
};

export const useAccessibilityTheme = () => useContext(AccessibilityThemeContext);