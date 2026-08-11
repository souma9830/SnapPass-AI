import React from 'react';

const GlareShadowIndicator = ({ glareData }) => {
  if (!glareData) return null;

  const { passed, glare_percentage, shadow_percentage, recommendation } = glareData;

  return (
    <div className={`p-3 rounded-lg border text-xs ${passed ? 'bg-emerald-950/20 border-emerald-500/30 text-emerald-300' : 'bg-rose-950/20 border-rose-500/30 text-rose-300'}`}>
      <div className="flex items-center justify-between font-semibold mb-1">
        <span>Illumination & Glare Analysis</span>
        <span>{passed ? 'PASSED' : 'ACTION REQUIRED'}</span>
      </div>
      <div className="flex gap-4 my-1 opacity-90">
        <div>Glare Area: <span className="font-mono">{glare_percentage}%</span></div>
        <div>Shadow Area: <span className="font-mono">{shadow_percentage}%</span></div>
      </div>
      <p className="opacity-80 italic mt-1">{recommendation}</p>
    </div>
  );
};

export default GlareShadowIndicator;
