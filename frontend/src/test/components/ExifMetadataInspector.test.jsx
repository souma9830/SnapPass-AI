import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ExifMetadataInspector from '../../components/ExifMetadataInspector';

jest.mock('../../utils/imageCompression', () => ({
  stripExifMetadata: jest.fn().mockImplementation((file) => Promise.resolve(file)),
}));

describe('ExifMetadataInspector Component', () => {
  const mockFile = new File(['dummy content'], 'passport.jpg', { type: 'image/jpeg' });

  it('renders EXIF technical metadata inspector title', () => {
    render(<ExifMetadataInspector file={mockFile} />);
    expect(screen.getByText(/photo exif & privacy metadata/i)).toBeInTheDocument();
  });

  it('triggers EXIF scrubbing handler when button clicked', async () => {
    const handleCleaned = jest.fn();
    render(<ExifMetadataInspector file={mockFile} onFileCleaned={handleCleaned} />);

    const scrubBtn = screen.getByRole('button', { name: /scrub exif metadata/i });
    fireEvent.click(scrubBtn);

    await waitFor(() => {
      expect(screen.getByText(/exif privacy cleaned/i)).toBeInTheDocument();
    });
    expect(handleCleaned).toHaveBeenCalled();
  });
});
