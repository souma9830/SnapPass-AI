/**
 * storageJanitor.test.js — Storage Janitor Service Tests
 * Built for ELUSoC 2026 / GSSOC 2026.
 */
import { StorageJanitorService } from '../services/storageJanitor.service.js';

describe('StorageJanitorService Tests', () => {
  it('should return initial zero counts for empty folder prune', async () => {
    const result = await StorageJanitorService.pruneStaleFiles('./non_existent_folder_xyz', 3600000);
    expect(result.deletedCount).toBe(0);
    expect(result.reclaimedBytes).toBe(0);
  });
});
