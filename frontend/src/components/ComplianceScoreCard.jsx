import React from 'react';
import { calculateComplianceScore } from '../utils/complianceScoreCalculator';

export default function ComplianceScoreCard({ metrics = {} }) {
  const { score, grade, statusClass, breakdown, isCompliant } = calculateComplianceScore(metrics);

  return (
    <div className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-sm flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-base font-semibold text-gray-900 dark:text-white">Passport Compliance Score</h3>
          <p className="text-xs text-gray-500 dark:text-gray-400">AI-driven biometric & lighting analysis</p>
        </div>
        <div className={`px-3 py-1 rounded-full font-bold text-lg ${statusClass}`}>
          {score}% ({grade})
        </div>
      </div>

      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
        <div
          className={`h-2.5 rounded-full transition-all duration-500 ${
            score >= 80 ? 'bg-emerald-500' : score >= 60 ? 'bg-amber-500' : 'bg-red-500'
          }`}
          style={{ width: `${score}%` }}
        />
      </div>

      <div className="space-y-2 mt-1">
        {breakdown.map((item, idx) => (
          <div key={idx} className="flex justify-between items-center text-xs">
            <span className="text-gray-700 dark:text-gray-300 font-medium">{item.rule}</span>
            <span
              className={`font-medium ${
                item.status === 'pass'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : item.status === 'warning'
                  ? 'text-amber-600 dark:text-amber-400'
                  : 'text-red-600 dark:text-red-400'
              }`}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
