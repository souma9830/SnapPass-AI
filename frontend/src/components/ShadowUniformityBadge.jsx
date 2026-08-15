import React from 'react';

export const ShadowUniformityBadge = ({ score = 100, hasShadows = false }) => {
    return (
        <div className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold border shadow-sm ${
            hasShadows 
                ? 'bg-amber-950/60 border-amber-800 text-amber-300' 
                : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
        }`}>
            <span className={`h-2 w-2 rounded-full ${hasShadows ? 'bg-amber-400 animate-pulse' : 'bg-emerald-400'}`} />
            <span>Background Shadow Score: {score}% {hasShadows ? '(Harsh Shadow Alert)' : '(Uniform)'}</span>
        </div>
    );
};