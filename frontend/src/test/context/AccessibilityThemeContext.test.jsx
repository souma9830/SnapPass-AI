import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { AccessibilityThemeProvider, useAccessibilityTheme } from '../../context/AccessibilityThemeContext';

describe('AccessibilityThemeContext', () => {
    it('toggles theme', () => {
        const wrapper = ({ children }) => <AccessibilityThemeProvider>{children}</AccessibilityThemeProvider>;
        const { result } = renderHook(() => useAccessibilityTheme(), { wrapper });
        act(() => result.current.toggle());
        expect(result.current.highContrast).toBe(true);
    });
});