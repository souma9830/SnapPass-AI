import React from 'react';
import fs from 'node:fs';
import path from 'node:path';
import { render } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';

import AttireManualAdjuster from '../../components/AttireManualAdjuster';
import GuidelinesCustomizer from '../../components/GuidelinesCustomizer';
import QuantityInput from '../../components/QuantityInput';
import SizeSelector from '../../components/SizeSelector';
import BackgroundSelector from '../../components/BackgroundSelector';
import PassportRequirementComparator from '../../components/PassportRequirementComparator';
import ThemeColorSelector from '../../components/ThemeColorSelector';
import AddTestimonialForm from '../../components/testimonials/AddTestimonialForm';
import ChatbotWindow from '../../chatbot/components/ChatbotWindow';
import DownloadPackagePanel from '../../components/DownloadPackagePanel';
import ComparisonSlider from '../../components/ComparisonSlider';
import { LanguageProvider } from '../../context/LanguageContext';
import { ThemeCustomizerProvider } from '../../context/ThemeCustomizerContext';

vi.mock('../../utils/exportHelpers', () => ({
  compressImage: vi.fn(),
  generatePdf: vi.fn(),
  createZip: vi.fn(),
  sanitizeFileName: vi.fn(),
}));

vi.mock('file-saver', () => ({ saveAs: vi.fn() }));

const CONTROL_SOURCE_FILES = [
  'src/pages/EditorPage.jsx',
  'src/pages/HistoryPage.jsx',
  'src/chatbot/components/ChatbotWindow.jsx',
  'src/pages/SignUp.jsx',
  'src/pages/PrintPreviewPage.jsx',
  'src/pages/SignIn.jsx',
  'src/pages/PhotoStudio.jsx',
  'src/pages/SettingsPage.jsx',
  'src/components/ComparisonSlider.jsx',
  'src/components/AttireManualAdjuster.jsx',
  'src/components/BackgroundSelector.jsx',
  'src/components/GuidelinesCustomizer.jsx',
  'src/components/FormField.jsx',
  'src/components/DownloadPackagePanel.jsx',
  'src/components/PassportRequirementComparator.jsx',
  'src/components/ImageAdjustments.jsx',
  'src/components/editor/PrintLayoutOptions.jsx',
  'src/components/SizeSelector.jsx',
  'src/components/QuantityInput.jsx',
  'src/components/layout/LanguageSelector.jsx',
  'src/components/layout/Navbar.jsx',
  'src/components/ThemeColorSelector.jsx',
  'src/components/UploadBox.jsx',
  'src/components/testimonials/AddTestimonialForm.jsx',
];

function extractControls(source) {
  const controls = [];
  const pattern = /<(input|select|textarea)\b/g;
  let match;
  while ((match = pattern.exec(source)) !== null) {
    let index = match.index + match[0].length;
    let depth = 0;
    while (index < source.length) {
      const char = source[index];
      if (char === '{') depth += 1;
      else if (char === '}') depth = Math.max(0, depth - 1);
      else if (char === '>' && depth === 0) break;
      index += 1;
    }
    controls.push({
      tag: match[1],
      attrs: source.slice(match.index + match[0].length, index),
    });
  }
  return controls;
}

function assertControlsLabelled(container) {
  const controls = container.querySelectorAll('input, select, textarea');
  expect(controls.length).toBeGreaterThan(0);
  controls.forEach((element) => {
    const hasIdentity = element.getAttribute('name') || element.getAttribute('id');
    expect(hasIdentity, `form control must have id or name: ${element.outerHTML}`).toBeTruthy();
  });
}

describe('Form field accessibility (issue 956)', () => {
  it('every form control in source files has an id or name attribute', () => {
    CONTROL_SOURCE_FILES.forEach((relativePath) => {
      const fullPath = path.resolve(process.cwd(), relativePath);
      const source = fs.readFileSync(fullPath, 'utf8');
      const controls = extractControls(source);
      expect(controls.length, `${relativePath} should contain form controls`).toBeGreaterThan(0);
      controls.forEach(({ tag, attrs }) => {
        expect(attrs, `<${tag} ...> in ${relativePath} missing id or name`).toMatch(
          /(\sid=|\sname=)/
        );
      });
    });
  });

  it('AttireManualAdjuster renders named range sliders', () => {
    const { container } = render(<AttireManualAdjuster />);
    assertControlsLabelled(container);
  });

  it('GuidelinesCustomizer renders a named color input', () => {
    const { container } = render(
      <GuidelinesCustomizer guideColor="#ff0000" onColorChange={() => {}} />
    );
    assertControlsLabelled(container);
  });

  it('QuantityInput renders a named number input', () => {
    const { container } = render(<QuantityInput onChange={() => {}} />);
    assertControlsLabelled(container);
  });

  it('SizeSelector renders a named select', () => {
    const { container } = render(
      <SizeSelector
        presets={[{ id: '35x45', label: '35x45 mm', dimensions: '35 x 45 mm' }]}
        selected="35x45"
        onChange={() => {}}
      />
    );
    assertControlsLabelled(container);
  });

  it('BackgroundSelector renders a named color input', () => {
    const { container } = render(<BackgroundSelector onChange={() => {}} />);
    assertControlsLabelled(container);
  });

  it('PassportRequirementComparator renders named inputs', () => {
    const { container } = render(<PassportRequirementComparator />);
    assertControlsLabelled(container);
  });

  it('ThemeColorSelector renders a named checkbox', () => {
    const { container } = render(
      <ThemeCustomizerProvider>
        <ThemeColorSelector />
      </ThemeCustomizerProvider>
    );
    assertControlsLabelled(container);
  });

  it('AddTestimonialForm renders named inputs and textarea', () => {
    const { container } = render(
      <LanguageProvider>
        <AddTestimonialForm darkMode={false} onSubmit={() => {}} onCancel={() => {}} />
      </LanguageProvider>
    );
    assertControlsLabelled(container);
  });

  it('ChatbotWindow renders a named message input', () => {
    Element.prototype.scrollIntoView = Element.prototype.scrollIntoView || vi.fn();
    const { container } = render(<ChatbotWindow isOpen onClose={() => {}} />);
    assertControlsLabelled(container);
  });

  it('DownloadPackagePanel renders named checkboxes', () => {
    const { container } = render(
      <DownloadPackagePanel processedUrl="data:image/png;base64,AA==" originalFileName="photo.png" />
    );
    assertControlsLabelled(container);
  });

  it('ComparisonSlider renders a named zoom select', () => {
    const { container } = render(
      <ComparisonSlider beforeSrc="before.png" afterSrc="after.png" />
    );
    assertControlsLabelled(container);
  });
});
