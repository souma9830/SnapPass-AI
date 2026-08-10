import React, { useState } from 'react';
import { ExifAnalysisResult } from '../../types/exifScrubber';
import { analyzeMockExifMetadata } from '../../utils/exifScrubberUtils';
import styles from './ExifScrubberModal.module.css';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  filename?: string;
  onScrubSuccess?: () => void;
}

export const ExifScrubberModal: React.FC<Props> = ({ isOpen, onClose, filename, onScrubSuccess }) => {
  const [analysis] = useState<ExifAnalysisResult>(() => analyzeMockExifMetadata(filename));
  const [isScrubbed, setIsScrubbed] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleScrub = () => {
    setIsScrubbed(true);
    if (onScrubSuccess) onScrubSuccess();
  };

  return (
    <div className={styles.modalOverlay} role="dialog" aria-modal="true" aria-labelledby="exif-title">
      <div className={styles.modalContent}>
        <header className={styles.modalHeader}>
          <div>
            <h2 id="exif-title" className={styles.modalTitle}>Photo EXIF Privacy Inspector</h2>
            <p className={styles.modalSubtitle}>Inspect and sanitize sensitive location & device metadata prior to export.</p>
          </div>
          <button className={styles.closeBtn} onClick={onClose} type="button" aria-label="Close modal">
            ✕
          </button>
        </header>

        <main className={styles.modalBody}>
          <div className={`${styles.riskBanner} ${styles[analysis.privacyRiskRating]}`}>
            <span className={styles.riskIcon}>⚠️</span>
            <div>
              <strong>Privacy Risk Assessment: {analysis.privacyRiskRating.toUpperCase().replace('_', ' ')}</strong>
              <p>Detected {analysis.sensitiveTagCount} sensitive metadata tags embedded in photo binary headers.</p>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.tagTable}>
              <thead>
                <tr>
                  <th>Metadata Property</th>
                  <th>Value</th>
                  <th>Category</th>
                  <th>Privacy Status</th>
                </tr>
              </thead>
              <tbody>
                {analysis.tags.map((tag) => (
                  <tr key={tag.key}>
                    <td className={styles.propName}>{tag.label}</td>
                    <td className={styles.propValue}>{isScrubbed && tag.isSensitive ? '[STRIPPED & REMOVED]' : tag.value}</td>
                    <td>{tag.category}</td>
                    <td>
                      <span className={tag.isSensitive ? styles.sensitivePill : styles.safePill}>
                        {tag.isSensitive ? 'Sensitive' : 'Standard'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>

        <footer className={styles.modalFooter}>
          <button className={styles.cancelBtn} onClick={onClose} type="button">
            Close
          </button>
          <button
            className={styles.scrubBtn}
            onClick={handleScrub}
            disabled={isScrubbed}
            type="button"
          >
            {isScrubbed ? '✅ Metadata Sanitized' : '🧹 Scrub Sensitive Metadata'}
          </button>
        </footer>
      </div>
    </div>
  );
};
