export interface OfflineDraftRecord {
  id: string;
  timestamp: string;
  presetId: string;
  filename: string;
  imageDataUrl: string;
  complianceScore: number;
  syncStatus: 'synced' | 'pending_sync' | 'draft_only';
}

export interface StorageQuotaInfo {
  usedBytes: number;
  totalBytes: number;
  usagePercentage: number;
}
