# Offline Sync IndexedDB Vault Architecture

The **Offline Sync IndexedDB Vault** enables offline photo staging and automatic background queue synchronization when connectivity is restored.

## Core Files
- `frontend/src/utils/offlineIndexedDbVault.js`: IndexedDB schema and object store transaction wrappers.
- `frontend/src/hooks/useOfflineSyncQueue.js`: Custom React hook tracking network event listeners.
- `<OfflineSyncIndicator />`: Visual indicator banner.
