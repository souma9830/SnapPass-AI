import React from 'react';

const FacialAsymmetryCard = ({ asymmetryData, isLoading }) => {
  if (isLoading) {
    return (
      <div className="p-4 rounded-xl bg-slate-800/60 border border-slate-700 animate-pulse">
        <div className="h-4 bg-slate-700 rounded w-1/3 mb-2"></div>
        <div className="h-3 bg-slate-700 rounded w-2/3"></div>
      </div>
    );
  }

  if (!asymmetryData) return null;

  const { passed, tilt_angle_deg, asymmetry_score, recommendation } = asymmetryData;

  return (
    <div className={`p-4 rounded-xl border ${passed ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-200' : 'bg-amber-950/30 border-amber-500/40 text-amber-200'}`}>
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-semibold text-sm flex items-center gap-2">
          <span>{passed ? '✓' : '⚠️'}</span> Biometric Alignment & Symmetry
        </h4>
        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${passed ? 'bg-emerald-500/20 text-emerald-300' : 'bg-amber-500/20 text-amber-300'}`}>
          {passed ? 'ICAO Compliant' : 'Adjustment Needed'}
        </span>
      </div>
      <div className="grid grid-cols-2 gap-2 text-xs mb-2">
        <div>
          <span className="opacity-70">Head Tilt:</span> <strong className="font-mono">{tilt_angle_deg}°</strong>
        </div>
        <div>
          <span className="opacity-70">Asymmetry Metric:</span> <strong className="font-mono">{(asymmetry_score * 100).toFixed(1)}%</strong>
        </div>
      </div>
      <p className="text-xs opacity-90 leading-relaxed italic">{recommendation}</p>
    </div>
  );
};

export default FacialAsymmetryCard;
