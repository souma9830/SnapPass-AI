import React from 'react';

const BackgroundRefinementControl = ({ featherRadius = 3, onFeatherChange }) => {
  return (
    <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/60 my-2">
      <div className="flex justify-between items-center mb-1 text-xs text-slate-300">
        <label className="font-semibold">Edge Hair Feathering Radius</label>
        <span className="font-mono bg-slate-900 px-2 py-0.5 rounded text-blue-400">{featherRadius}px</span>
      </div>
      <input
        type="range"
        min="0"
        max="10"
        step="1"
        value={featherRadius}
        onChange={(e) => onFeatherChange && onFeatherChange(parseInt(e.target.value, 10))}
        className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
      />
    </div>
  );
};

export default BackgroundRefinementControl;
