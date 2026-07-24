import { StorageJanitorService } from '../services/storageJanitor.service.js';

describe('StorageJanitorService', () => {
  it('handles non-existent directory safely', () => {
    const res = StorageJanitorService.purgeStaleFiles('/non_existent_dir_xyz');
    expect(res).toEqual({ purged: 0, freedBytes: 0 });
  });
});
