import React from 'react';
import { ComplianceAnalyticsDashboard } from '../components/analytics/ComplianceAnalyticsDashboard';

export const AnalyticsPage: React.FC = () => {
  return (
    <main style={{ minHeight: '80vh', padding: '1rem 0' }}>
      <ComplianceAnalyticsDashboard />
    </main>
  );
};
