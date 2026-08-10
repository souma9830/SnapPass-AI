import React from 'react';
import { useThemeCustomizer } from '../context/ThemeCustomizerContext';

export default function AccessibilityToolbar() {
  const { highContrast, setHighContrast, fontSizeScale, setFontSizeScale, resetTheme } = useThemeCustomizer();

  return (
    <div
      role="region"
      aria-label="Accessibility Preferences Toolbar"
      className="p-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex items-center justify-between gap-4 text-xs shadow-sm"
    >
      <div className="flex items-center gap-3">
        <span className="font-semibold text-gray-700 dark:text-gray-200" id="acc-label">
          ♿ Accessibility & Focus Controls:
        </span>
        <button
          onClick={() => setHighContrast(!highContrast)}
          aria-pressed={highContrast}
          aria-labelledby="acc-label"
          className={`px-3 py-1.5 rounded font-semibold border transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
            highContrast
              ? 'bg-black text-yellow-300 border-yellow-400 font-bold'
              : 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
          }`}
        >
          {highContrast ? 'High Contrast ON' : 'High Contrast OFF'}
        </button>
      </div>

      <div className="flex items-center gap-2">
        <span className="text-gray-600 dark:text-gray-400">Text Scaling:</span>
        <button
          onClick={() => setFontSizeScale(Math.max(0.9, parseFloat((fontSizeScale - 0.1).toFixed(1))))}
          aria-label="Decrease text size"
          className="px-2.5 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500"
        >
          A-
        </button>
        <span className="font-mono font-bold text-gray-700 dark:text-gray-300 px-1">
          {Math.round(fontSizeScale * 100)}%
        </span>
        <button
          onClick={() => setFontSizeScale(Math.min(1.4, parseFloat((fontSizeScale + 0.1).toFixed(1))))}
          aria-label="Increase text size"
          className="px-2.5 py-1 rounded bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold hover:bg-gray-300 dark:hover:bg-gray-600 focus:ring-2 focus:ring-blue-500"
        >
          A+
        </button>
        <button
          onClick={resetTheme}
          aria-label="Reset accessibility settings to default"
          className="ml-2 text-xs text-blue-600 dark:text-blue-400 underline hover:text-blue-800 focus:ring-1 focus:ring-blue-500"
        >
          Reset
        </button>
      </div>
    </div>
  );
}
