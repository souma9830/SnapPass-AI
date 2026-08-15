import React from 'react';
import { checkAttireBackgroundContrast } from '../utils/attireContrastChecker';

export const AttireContrastIndicator = ({ attireHex = '#ffffff', backgroundHex = '#ffffff' }) => {
    const result = checkAttireBackgroundContrast(attireHex, backgroundHex);

    return (
        <div className={`p-3 rounded-xl border text-xs font-medium space-y-1 ${
            result.isCompliant 
                ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300' 
                : 'bg-rose-950/40 border-rose-800 text-rose-300'
        }`}>
            <div className="flex items-center justify-between">
                <span>Attire vs Background Contrast</span>
                <span className="font-bold font-mono">{result.ratio}:1</span>
            </div>
            <p className="text-[11px] opacity-80">{result.recommendation}</p>
        </div>
    );
};