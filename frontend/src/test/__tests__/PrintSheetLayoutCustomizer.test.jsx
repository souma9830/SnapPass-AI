import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { PrintSheetLayoutCustomizer } from '../../components/PrintSheetLayoutCustomizer';
import { loadCustomPrintTemplates, saveCustomPrintTemplate } from '../../services/printTemplateService';

describe('PrintSheetLayoutCustomizer & printTemplateService', () => {
  it('renders customizer component with options', () => {
    render(
      <PrintSheetLayoutCustomizer
        selectedPreset="a4_sheet"
        onSelectPreset={vi.fn()}
        showCropGuides={true}
        onToggleCropGuides={vi.fn()}
        onDownloadPDF={vi.fn()}
      />
    );

    expect(screen.getByText(/Print Sheet Customizer/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Show Trim \/ Cut Guides/i)).toBeInTheDocument();
  });

  it('saves and loads custom print template in service', () => {
    const mockTemplate = {
      id: 'tpl_123',
      templateName: 'Custom 4x6 Passport',
      paperSize: { id: '4x6_in', name: '4x6', widthMm: 101.6, heightMm: 152.4, unit: 'in' },
      layout: { columns: 2, rows: 3, marginTopMm: 5, marginBottomMm: 5, marginLeftMm: 5, marginRightMm: 5, gapMm: 3, showCutGuides: true },
      createdAt: '2026-08-10T19:00:00Z',
    };

    saveCustomPrintTemplate(mockTemplate);
    const templates = loadCustomPrintTemplates();
    expect(templates.some((t) => t.id === 'tpl_123')).toBe(true);
  });
});
