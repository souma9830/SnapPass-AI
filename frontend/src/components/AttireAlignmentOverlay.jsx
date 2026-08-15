import React from 'react';

export default function AttireAlignmentOverlay({ visible = true, opacity = 0.5 }) {
  if (!visible) return null;

  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
      <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none" style={{ opacity }}>
        {/* Eye level guide */}
        <line x1="10" y1="35" x2="90" y2="35" stroke="#3b82f6" strokeWidth="0.5" strokeDasharray="2,2" />
        {/* Chin line guide */}
        <line x1="20" y1="65" x2="80" y2="65" stroke="#10b981" strokeWidth="0.5" strokeDasharray="2,2" />
        {/* Vertical center axis */}
        <line x1="50" y1="5" x2="50" y2="95" stroke="#ef4444" strokeWidth="0.5" strokeDasharray="2,2" />
        {/* Head oval outline */}
        <ellipse cx="50" cy="45" rx="25" ry="32" fill="none" stroke="#60a5fa" strokeWidth="0.5" strokeDasharray="3,3" />
      </svg>
    </div>
  );
}
