import { BatchZipService } from '../services/batchZip.service.js';

describe('BatchZipService', () => {
  it('should throw error when filenames is not an array or empty', async () => {
    await expect(BatchZipService.streamZipArchive([], {})).rejects.toThrow(
      'Filenames array must contain at least one file.'
    );
  });

  it('should throw error when no valid files are found in batch', async () => {
    const mockArchiver = () => ({
      on: () => {},
      pipe: () => {},
      file: () => {},
      destroy: () => {},
      pointer: () => 0,
    });
    const mockStream = { on: (event, cb) => { if (event === 'close') cb(); } };

    await expect(
      BatchZipService.streamZipArchive(['non_existent_file.jpg'], mockStream, mockArchiver)
    ).rejects.toThrow('No valid existing files found in batch request.');
  });
});
