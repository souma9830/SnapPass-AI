import React from 'react';
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import ComplianceScoreGauge from '../../components/ComplianceScoreGauge';
import ComplianceBreakdownCard from '../../components/ComplianceBreakdownCard';
import { calculateComplianceMetrics } from '../../services/aiComplianceService';

describe('ComplianceScoreGauge and ComplianceBreakdownCard components', () => {
  it('renders overall score and status badge correctly', () => {
    render(<ComplianceScoreGauge score={95} status="COMPLIANT" />);

    expect(screen.getByText('95%')).toBeDefined();
    expect(screen.getByText('Official Compliant')).toBeDefined();
  });

  it('calculates correct metrics from raw photo data', () => {
    const metrics = calculateComplianceMetrics({
      headRatio: 0.75,
      backgroundUniformity: 90,
      lightingScore: 85,
    });

    expect(metrics.totalScore).toBeGreaterThanOrEqual(80);
    expect(metrics.checks.length).toBe(5);
  });

  it('renders breakdown list with check titles', () => {
    const metrics = calculateComplianceMetrics({});
    render(<ComplianceBreakdownCard metrics={metrics} />);

    expect(screen.getByText('Head Height & Framing')).toBeDefined();
    expect(screen.getByText('Background Uniformity')).toBeDefined();
  });
});
