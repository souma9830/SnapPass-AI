import React from 'react';
import { calculatePrintGridDimensions } from '../utils/pdfRenderEngine';

export default function PrintGridCustomizer({ paperSize = 'A4', spacingMm = 5, onChange }) {
  const grid = calculatePrintGridDimensions({ paperSize, spacingMm });

  return (
    <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-semibold text-gray-900 dark:text-white">Print Sheet Layout Configurator</h4>
        <span className="text-xs font-mono bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300 px-2 py-0.5 rounded">
          {grid.cols} × {grid.rows} ({grid.totalPhotos} photos)
        </span>
      </div>

      <div className="grid grid-cols-2 gap-3 text-xs">
        <div>
          <label className="block text-gray-600 dark:text-gray-400 mb-1">Paper Format</label>
          <select
            value={paperSize}
            onChange={(e) => onChange && onChange({ paperSize: e.target.value, spacingMm })}
            className="w-full p-1.5 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="A4">A4 Sheet (210×297 mm)</option>
            <option value="4x6">4×6 Photo Paper (102×152 mm)</option>
            <option value="5x7">5×7 Photo Paper (127×178 mm)</option>
          </select>
        </div>

        <div>
          <label className="block text-gray-600 dark:text-gray-400 mb-1">Photo Spacing ({spacingMm}mm)</label>
          <input
            type="range"
            min="2"
            max="15"
            value={spacingMm}
            onChange={(e) => onChange && onChange({ paperSize, spacingMm: Number(e.target.value) })}
            className="w-full cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
