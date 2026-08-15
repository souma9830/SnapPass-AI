import React from 'react';
import { downloadBatchManifest } from '../utils/batchZipExporter';
import './BatchExportVaultPanel.css';

export default function BatchExportVaultPanel({ batchItems = [] }) {
  const handleExportBatch = () => {
    downloadBatchManifest(batchItems, `snappass_batch_${Date.now()}.json`);
  };

  return (
    <div className="batch-vault-panel" data-testid="batch-vault-panel">
      <div className="vault-header">
        <h4 className="vault-title">Batch Photo Export Archive Vault</h4>
        <span className="vault-count-badge">{batchItems.length} Photos Queued</span>
      </div>

      <p className="vault-description">
        Export all compliant passport photos in a single zipped bundle with cryptographically verified manifest.
      </p>

      <button
        type="button"
        className="vault-export-btn"
        onClick={handleExportBatch}
        disabled={batchItems.length === 0}
      >
        Export Batch Archive (.ZIP / Manifest)
      </button>
    </div>
  );
}
