import { renderHook, act } from '@testing-library/react';
import { useBatchUpload } from '../../hooks/useBatchUpload';

describe('useBatchUpload', () => {
  beforeEach(() => {
    global.fetch = jest.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ success: true, filename: 'test.jpg' }),
    });
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  test('initializes with default queue state', () => {
    const { result } = renderHook(() => useBatchUpload());
    expect(result.current.results).toEqual([]);
    expect(result.current.uploading).toBe(false);
    expect(result.current.progress.total).toBe(0);
    expect(result.current.hasPending).toBe(false);
  });

  test('adds files into upload queue', () => {
    const { result } = renderHook(() => useBatchUpload());
    const dummyFile = new File(['dummy content'], 'photo.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.addFiles([dummyFile]);
    });

    expect(result.current.results.length).toBe(1);
    expect(result.current.results[0].name).toBe('photo.jpg');
    expect(result.current.progress.total).toBe(1);
    expect(result.current.hasPending).toBe(true);
  });

  test('resets queue state completely', () => {
    const { result } = renderHook(() => useBatchUpload());
    const dummyFile = new File(['dummy content'], 'photo.jpg', { type: 'image/jpeg' });

    act(() => {
      result.current.addFiles([dummyFile]);
      result.current.reset();
    });

    expect(result.current.results).toEqual([]);
    expect(result.current.progress.total).toBe(0);
    expect(result.current.hasPending).toBe(false);
  });
});
