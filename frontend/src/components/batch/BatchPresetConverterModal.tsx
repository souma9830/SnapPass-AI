import React, { useState } from 'react';
import { PresetTargetOption, BatchItemResult } from '../../types/batchPreset';
import { DEFAULT_PRESET_TARGETS, processBatchPresetConversions } from '../../services/batchPresetConverterService';
import styles from './BatchPresetConverterModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  sourceImageUrl: string;
}

export const BatchPresetConverterModal: React.FC<Props> = ({ isOpen, onClose, sourceImageUrl }) => {
  const [presets, setPresets] = useState<PresetTargetOption[]>(DEFAULT_PRESET_TARGETS);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [batchResults, setBatchResults] = useState<BatchItemResult[]>([]);

  if (!isOpen) return null;

  const togglePreset = (id: string) => {
    setPresets((prev) =>
      prev.map((p) => (p.id === id ? { ...p, selected: !p.selected } : p))
    );
  };

  const selectedCount = presets.filter((p) => p.selected).length;

  const handleStartBatch = async () => {
    const selectedIds = presets.filter((p) => p.selected).map((p) => p.id);
    if (selectedIds.length === 0) return;

    setIsProcessing(true);
    await processBatchPresetConversions(
      {
        sourceImageUrl,
        selectedPresetIds: selectedIds,
        maintainAspectCrop: true,
        highQualityExport: true,
      },
      (progress) => {
        setBatchResults(progress);
      }
    );
    setIsProcessing(false);
  };

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="batch-title">
      <div className={styles.modalContent}>
        <header className={styles.modalHeader}>
          <div>
            <h2 id="batch-title" className={styles.modalTitle}>Multi-Target Batch Preset Converter</h2>
            <p className={styles.modalSubtitle}>Transform your portrait photo into multiple country visa specifications at once.</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} type="button" aria-label="Close modal">
            ✕
          </button>
        </header>

        <main className={styles.modalBody}>
          <div className={styles.presetGrid}>
            {presets.map((preset) => (
              <label key={preset.id} className={`${styles.presetCard} ${preset.selected ? styles.selectedCard : ''}`}>
                <input
                  type="checkbox"
                  checked={preset.selected}
                  onChange={() => togglePreset(preset.id)}
                  disabled={isProcessing}
                  className={styles.checkbox}
                />
                <div className={styles.presetMeta}>
                  <div className={styles.presetTitle}>
                    <span>{preset.flagEmoji}</span>
                    <span>{preset.countryName}</span>
                  </div>
                  <div className={styles.presetDesc}>{preset.dimensionsMm}</div>
                </div>
              </label>
            ))}
          </div>

          {batchResults.length > 0 && (
            <div className={styles.resultsContainer}>
              <h3 className={styles.resultsTitle}>Batch Conversion Queue</h3>
              <div className={styles.resultsList}>
                {batchResults.map((item) => (
                  <div key={item.presetId} className={styles.resultRow}>
                    <span>{item.countryName}</span>
                    <span className={`${styles.badge} ${styles[item.status]}`}>{item.status}</span>
                    {item.status === 'completed' && item.downloadUrl && (
                      <a href={item.downloadUrl} download={`${item.presetId}_passport.jpg`} className={styles.downloadLink}>
                        Download
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </main>

        <footer className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose} disabled={isProcessing} type="button">
            Cancel
          </button>
          <button
            className={styles.submitBtn}
            onClick={handleStartBatch}
            disabled={isProcessing || selectedCount === 0}
            type="button"
          >
            {isProcessing ? 'Converting Presets...' : `Batch Convert (${selectedCount} selected)`}
          </button>
        </footer>
      </div>
    </div>
  );
};
