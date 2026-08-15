import React, { useState } from 'react';
import { calculatePrintSheetCost, LAYOUT_CAPACITIES } from '../utils/printCostCalculator';

export const PrintCostWidget = ({ paperSize = 'A4', photoCount = 6 }) => {
    const [costPerPage, setCostPerPage] = useState(0.25);
    const summary = calculatePrintSheetCost({ paperSize, copies: photoCount, costPerPage });

    return (
        <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 text-slate-100 shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <h3 className="text-sm font-bold tracking-wide text-indigo-400 uppercase">Commercial Print Estimator</h3>
                <span className="rounded-md bg-slate-800 px-2.5 py-1 text-xs font-mono text-slate-300">{paperSize} Layout</span>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                    <span className="text-slate-400">Total Sheets Required</span>
                    <p className="text-lg font-bold text-white">{summary.totalSheets} Sheet(s)</p>
                </div>
                <div>
                    <span className="text-slate-400">Estimated Total Cost</span>
                    <p className="text-lg font-bold text-emerald-400">${summary.totalCost}</p>
                </div>
            </div>

            <div className="flex items-center gap-3 pt-2 text-xs text-slate-400">
                <span>Unit Cost/Sheet:</span>
                <input 
                    type="number" 
                    step="0.05" 
                    min="0.01" 
                    value={costPerPage} 
                    onChange={(e) => setCostPerPage(parseFloat(e.target.value) || 0)} 
                    className="w-20 rounded bg-slate-800 px-2 py-1 text-white border border-slate-700 focus:outline-none focus:border-indigo-500"
                />
            </div>
        </div>
    );
};