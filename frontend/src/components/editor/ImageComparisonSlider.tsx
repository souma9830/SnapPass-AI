import React, { useState, useRef, useCallback, useEffect } from 'react';
import { ComparisonMode } from '../../types/comparison';
import { clampSplitPosition } from '../../utils/imageDiffUtils';
import styles from './ImageComparisonSlider.module.css';

interface Props {
  originalImage: string;
  editedImage: string;
  onClose?: () => void;
}

export const ImageComparisonSlider: React.FC<Props> = ({ originalImage, editedImage, onClose }) => {
  const [splitPos, setSplitPos] = useState<number>(50);
  const [mode, setMode] = useState<ComparisonMode>('split');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = useCallback(
    (clientX: number) => {
      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const percentage = (x / rect.width) * 100;
      setSplitPos(clampSplitPosition(percentage));
    },
    []
  );

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (isDragging) handleMove(e.clientX);
    },
    [isDragging, handleMove]
  );

  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (e.touches.length > 0) handleMove(e.touches[0].clientX);
    },
    [handleMove]
  );

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowLeft') setSplitPos((prev) => clampSplitPosition(prev - 2));
    if (e.key === 'ArrowRight') setSplitPos((prev) => clampSplitPosition(prev + 2));
  };

  return (
    <div className={styles.comparisonWrapper}>
      <header className={styles.comparisonHeader}>
        <div className={styles.modeToggle}>
          <button
            type="button"
            className={mode === 'split' ? styles.activeMode : styles.modeBtn}
            onClick={() => setMode('split')}
          >
            Split Slider
          </button>
          <button
            type="button"
            className={mode === 'sideBySide' ? styles.activeMode : styles.modeBtn}
            onClick={() => setMode('sideBySide')}
          >
            Side-by-Side
          </button>
        </div>
        {onClose && (
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close comparison view">
            ✕ Close
          </button>
        )}
      </header>

      {mode === 'split' ? (
        <div
          ref={containerRef}
          className={styles.sliderContainer}
          onMouseMove={handleMouseMove}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onTouchMove={handleTouchMove}
          tabIndex={0}
          onKeyDown={handleKeyDown}
          role="slider"
          aria-valuenow={Math.round(splitPos)}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Before and after photo comparison slider"
        >
          {/* Edited (After) Image - Background */}
          <img src={editedImage} alt="Edited result" className={styles.imageLayer} />

          {/* Original (Before) Image - Clipped Foreground */}
          <div className={styles.clippedLayer} style={{ clipPath: `inset(0 ${100 - splitPos}% 0 0)` }}>
            <img src={originalImage} alt="Original source" className={styles.imageLayer} />
            <span className={`${styles.labelBadge} ${styles.beforeBadge}`}>Original</span>
          </div>

          <span className={`${styles.labelBadge} ${styles.afterBadge}`}>Edited</span>

          {/* Draggable Divider Handle */}
          <div className={styles.dividerHandle} style={{ left: `${splitPos}%` }}>
            <div className={styles.handleKnob}>↔</div>
          </div>
        </div>
      ) : (
        <div className={styles.sideBySideContainer}>
          <div className={styles.sidePanel}>
            <img src={originalImage} alt="Original source photo" />
            <span className={styles.sideLabel}>Original Source</span>
          </div>
          <div className={styles.sidePanel}>
            <img src={editedImage} alt="Edited passport photo" />
            <span className={styles.sideLabel}>AI Processed</span>
          </div>
        </div>
      )}
    </div>
  );
};
