import { StorageJanitorService } from '../services/storageJanitor.service.js';
import { CleanupTask } from '../services/cleanupTask.js';
import fs from 'fs';
import os from 'os';
import path from 'path';

describe('StorageJanitorService', () => {
  it('handles non-existent directory safely', () => {
    const res = StorageJanitorService.purgeStaleFiles('/non_existent_dir_xyz');
    expect(res).toEqual({ purged: 0, freedBytes: 0 });
  });
});

describe('CleanupTask', () => {
  it('removes expired files and keeps fresh ones', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'snappass-cleanup-'));
    try {
      const stale = path.join(dir, 'stale.jpg');
      const fresh = path.join(dir, 'fresh.jpg');
      fs.writeFileSync(stale, 'stale');
      fs.writeFileSync(fresh, 'fresh');

      const old = new Date(Date.now() - 60 * 60 * 1000);
      fs.utimesSync(stale, old, old);

      const result = await CleanupTask.execute(dir, 10 * 60 * 1000);

      expect(fs.existsSync(stale)).toBe(false);
      expect(fs.existsSync(fresh)).toBe(true);
      expect(result).toEqual({ removed: 1, skipped: 0 });
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });

  it('skips subdirectories while cleaning', async () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'snappass-cleanup-'));
    try {
      const sub = path.join(dir, 'processed');
      fs.mkdirSync(sub);
      const old = new Date(Date.now() - 60 * 60 * 1000);
      fs.utimesSync(dir, old, old);

      await CleanupTask.execute(dir, 10 * 60 * 1000);

      expect(fs.existsSync(sub)).toBe(true);
    } finally {
      fs.rmSync(dir, { recursive: true, force: true });
    }
  });
});
