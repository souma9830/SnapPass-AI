import React from 'react';
import { PASSPORT_PRESETS } from '../utils/passportPresetLoader';

export const PassportTemplateDropdown = ({ selectedCode = 'US', onSelect }) => (
    <select 
        value={selectedCode} 
        onChange={(e) => onSelect(e.target.value)}
        className="rounded-lg border border-slate-700 bg-slate-800 px-3 py-2 text-xs font-semibold text-white focus:outline-none focus:border-indigo-500"
    >
        {Object.keys(PASSPORT_PRESETS).map(code => (
            <option key={code} value={code}>
                {PASSPORT_PRESETS[code].name} ({PASSPORT_PRESETS[code].widthMm}x{PASSPORT_PRESETS[code].heightMm}mm)
            </option>
        ))}
    </select>
);