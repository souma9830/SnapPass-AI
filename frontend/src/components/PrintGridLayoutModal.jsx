import React, { useState } from 'react';
import { calculateGridCapacity } from '../utils/printGridLayoutEngine';
import '../styles/printGridLayout.css';

const PrintGridLayoutModal = ({ isOpen, onClose, photoWidthMm = 35, photoHeightMm = 45 }) => {
  const [selectedPaper, setSelectedPaper] = useState('A6_4x6in');
  const gridInfo = calculateGridCapacity(selectedPaper, photoWidthMm, photoHeightMm);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 max-w-lg w-full text-slate-100">
        <h3 className="text-xl font-bold mb-3">Custom Print Sheet Grid Calculator</h3>
        <p className="text-sm text-slate-400 mb-4">
          Select target paper size to auto-calculate photo layout capacity and cut lines.
        </p>

        <div className="mb-4">
          <label className="block text-xs font-semibold text-slate-300 mb-1">Target Paper Size:</label>
          <select
            value={selectedPaper}
            onChange={(e) => setSelectedPaper(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm text-white"
          >
            <option value="A6_4x6in">4x6 inch (A6 standard photo paper)</option>
            <option value="A4">A4 Standard Sheet (210 x 297 mm)</option>
            <option value="US_LETTER">US Letter Sheet (8.5 x 11 in)</option>
          </select>
        </div>

        <div className="p-3 bg-slate-800/80 rounded-xl mb-4 text-xs space-y-1">
          <div className="flex justify-between">
            <span className="text-slate-400">Total Photos per Sheet:</span>
            <strong className="text-emerald-400 text-sm font-mono">{gridInfo.totalPhotos}</strong>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Grid Arrangement:</span>
            <span className="font-mono">{gridInfo.cols} cols × {gridInfo.rows} rows</span>
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 rounded-lg text-sm">
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrintGridLayoutModal;
