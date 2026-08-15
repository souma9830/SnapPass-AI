import React, { useState } from 'react';

export const AttireManualPlacementControl = ({ onUpdate }) => {
    const [scale, setScale] = useState(1.0);
    return (
        <div className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-xs">
            <span>Scale Attire: </span>
            <input type="range" min="0.5" max="2.0" step="0.1" value={scale} onChange={(e) => setScale(parseFloat(e.target.value))} />
        </div>
    );
};