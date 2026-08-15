import React, { useState } from 'react';
import { CustomPrintPaperSize, PrintGridLayoutConfig } from '../../types/printTemplate';
import { STANDARD_PAPER_PRESETS, calculateMaxFitTiles, saveCustomPrintTemplate } from '../../services/printTemplateService';
import styles from './CustomPrintTemplateModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onApplyTemplate?: (paper: CustomPrintPaperSize, layout: PrintGridLayoutConfig) => void;
}

export const CustomPrintTemplateModal: React.FC<Props> = ({ isOpen, onClose, onApplyTemplate }) => {
  const [selectedPaper, setSelectedPaper] = useState<CustomPrintPaperSize>(STANDARD_PAPER_PRESETS[0]);
  const [columns, setColumns] = useState<number>(2);
  const [rows, setRows] = useState<number>(3);
  const [gapMm, setGapMm] = useState<number>(3);
  const [templateName, setTemplateName] = useState<string>('');

  if (!isOpen) return null;

  const handleAutoFit = () => {
    const fit = calculateMaxFitTiles(selectedPaper, 35, 45, gapMm);
    setColumns(fit.columns);
    setRows(fit.rows);
  };

  const handleSave = () => {
    const layout: PrintGridLayoutConfig = {
      columns,
      rows,
      marginTopMm: 5,
      marginBottomMm: 5,
      marginLeftMm: 5,
      marginRightMm: 5,
      gapMm,
      showCutGuides: true,
    };

    saveCustomPrintTemplate({
      id: `tpl_${Date.now()}`,
      templateName: templateName || `${selectedPaper.name} (${columns}x${rows})`,
      paperSize: selectedPaper,
      layout,
      createdAt: new Date().toISOString(),
    });

    if (onApplyTemplate) onApplyTemplate(selectedPaper, layout);
    onClose();
  };

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="custom-print-title">
      <div className={styles.modalContent}>
        <header className={styles.modalHeader}>
          <div>
            <h2 id="custom-print-title" className={styles.modalTitle}>Custom Print Layout Sheet Builder</h2>
            <p className={styles.modalSubtitle}>Configure custom paper dimensions, grid tiling, and cut margin guidelines.</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} type="button" aria-label="Close modal">
            ✕
          </button>
        </header>

        <main className={styles.modalBody}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Select Paper Preset</label>
            <select
              className={styles.select}
              value={selectedPaper.id}
              onChange={(e) => {
                const found = STANDARD_PAPER_PRESETS.find((p) => p.id === e.target.value);
                if (found) setSelectedPaper(found);
              }}
            >
              {STANDARD_PAPER_PRESETS.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.gridRow}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Grid Columns</label>
              <input
                type="number"
                min="1"
                max="10"
                className={styles.input}
                value={columns}
                onChange={(e) => setColumns(Number(e.target.value))}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Grid Rows</label>
              <input
                type="number"
                min="1"
                max="10"
                className={styles.input}
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
              />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Tile Gap (mm)</label>
              <input
                type="number"
                min="0"
                max="20"
                className={styles.input}
                value={gapMm}
                onChange={(e) => setGapMm(Number(e.target.value))}
              />
            </div>
          </div>

          <button className={styles.autoFitBtn} onClick={handleAutoFit} type="button">
            ⚡ Calculate Optimal Auto-Fit ({columns * rows} tiles max)
          </button>

          {/* Visual Grid Sheet Canvas Preview */}
          <div className={styles.sheetPreview}>
            <div className={styles.sheetHeader}>Visual Sheet Preview ({selectedPaper.name})</div>
            <div className={styles.tileCanvasGrid} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
              {Array.from({ length: columns * rows }).map((_, idx) => (
                <div key={idx} className={styles.tileSlot}>
                  Photo #{idx + 1}
                </div>
              ))}
            </div>
          </div>
        </main>

        <footer className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose} type="button">
            Cancel
          </button>
          <button className={styles.saveBtn} onClick={handleSave} type="button">
            Save & Apply Layout Template
          </button>
        </footer>
      </div>
    </div>
  );
};
