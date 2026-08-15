import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import WatermarkOverlayManager, { applyWatermarkToCanvas } from '../../components/WatermarkOverlayManager';

describe('WatermarkOverlayManager Component', () => {
  it('renders watermark checkbox and options when enabled', () => {
    const handleToggle = vi.fn();
    render(
      <WatermarkOverlayManager
        watermarkText="SAMPLE PROOF"
        onWatermarkChange={vi.fn()}
        isEnabled={true}
        onToggleEnable={handleToggle}
        darkMode={false}
      />
    );

    expect(screen.getByText(/Proof Watermark Protection/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/e.g. DRAFT PROOF - SAMPLE ONLY/i)).toBeInTheDocument();
  });

  it('draws watermark text onto HTML5 canvas safely', () => {
    const canvas = document.createElement('canvas');
    canvas.width = 200;
    canvas.height = 200;
    expect(() => applyWatermarkToCanvas(canvas, 'CONFIDENTIAL PROOF', 0.5, 'diagonal')).not.toThrow();
  });
});
