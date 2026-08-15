import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import ExifMetadataInspector from '../../components/ExifMetadataInspector';

describe('ExifMetadataInspector Component', () => {
  it('renders technical metadata fields when file prop is passed', async () => {
    // Mock Image natural dimensions loading
    global.Image = class {
      constructor() {
        setTimeout(() => {
          this.naturalWidth = 800;
          this.naturalHeight = 800;
          if (this.onload) this.onload();
        }, 10);
      }
    };
    global.URL.createObjectURL = vi.fn().mockReturnValue('blob:http://localhost/dummy');
    global.URL.revokeObjectURL = vi.fn();

    const mockFile = new File(['dummy content'], 'passport_photo.jpg', { type: 'image/jpeg' });
    render(<ExifMetadataInspector file={mockFile} darkMode={false} />);

    expect(await screen.findByText(/Photo Technical Metadata \(EXIF\)/i)).toBeInTheDocument();
    expect(screen.getByText(/passport_photo.jpg/i)).toBeInTheDocument();
    expect(screen.getByText(/ICAO Print Grade/i)).toBeInTheDocument();
  });
});
