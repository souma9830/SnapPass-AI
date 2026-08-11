import React from 'react';
import { downloadBatchJsonManifest } from '../utils/photoBatchExporter';
import '../styles/batchExport.css';

const BatchExportModal = ({ isOpen, onClose, photoItems = [] }) => {
  if (!isOpen) return null;

  const handleExportManifest = () => {
    downloadBatchJsonManifest(photoItems);
  };

  return (
    <div className="batch-export-overlay" onClick={onClose}>
      <div className="batch-export-card" onClick={(e) => e.stopPropagation()}>
        <div className="batch-export-header">
          <h3 className="text-lg font-bold text-white">Export Batch Archive Bundle</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-white">✕</button>
        </div>
        <p className="text-sm text-slate-300 mb-4">
          Export selected passport photos along with cryptographic JSON metadata manifests for submission.
        </p>
        <div className="flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-700 text-slate-200 text-sm hover:bg-slate-600">
            Cancel
          </button>
          <button onClick={handleExportManifest} className="px-4 py-2 rounded-lg bg-blue-600 text-white text-sm hover:bg-blue-500 font-medium">
            Export Manifest JSON
          </button>
        </div>
      </div>
    </div>
  );
};

export default BatchExportModal;
