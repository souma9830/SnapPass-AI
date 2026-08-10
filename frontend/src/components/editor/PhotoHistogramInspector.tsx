import React, { useState } from 'react';
import { HistogramChannelBins, ExposureAnalysisStats } from '../../types/histogram';
import styles from './PhotoHistogramInspector.module.css';

interface Props {
  bins?: HistogramChannelBins;
  stats?: ExposureAnalysisStats;
}

export const PhotoHistogramInspector: React.FC<Props> = ({ bins, stats }) => {
  const [activeChannel, setActiveChannel] = useState<'all' | 'red' | 'green' | 'blue' | 'lum'>('all');

  const defaultStats: ExposureAnalysisStats = stats || {
    underExposedPercentage: 1.2,
    overExposedPercentage: 0.8,
    isExposureCompliant: true,
    meanLuminance: 128,
  };

  return (
    <div className={styles.histogramCard} aria-label="Photo Exposure & RGB Histogram Inspector">
      <header className={styles.header}>
        <h3 className={styles.title}>RGB & Luminance Histogram</h3>
        <div className={styles.channelButtons}>
          <button type="button" className={activeChannel === 'all' ? styles.activeBtn : styles.btn} onClick={() => setActiveChannel('all')}>RGB</button>
          <button type="button" className={activeChannel === 'red' ? styles.activeBtn : styles.btn} onClick={() => setActiveChannel('red')}>R</button>
          <button type="button" className={activeChannel === 'green' ? styles.activeBtn : styles.btn} onClick={() => setActiveChannel('green')}>G</button>
          <button type="button" className={activeChannel === 'blue' ? styles.activeBtn : styles.btn} onClick={() => setActiveChannel('blue')}>B</button>
        </div>
      </header>

      {/* SVG Multi-Channel Curve Placeholder Graphic */}
      <div className={styles.graphContainer}>
        <svg className={styles.svgGraph} viewBox="0 0 256 100" preserveAspectRatio="none">
          <path d="M 0 100 Q 64 20, 128 50 T 256 100 Z" fill="rgba(59, 130, 246, 0.3)" stroke="#3b82f6" strokeWidth="1.5" />
          <path d="M 0 100 Q 64 40, 128 30 T 256 100 Z" fill="rgba(239, 68, 68, 0.2)" stroke="#ef4444" strokeWidth="1.5" />
          <path d="M 0 100 Q 64 60, 128 20 T 256 100 Z" fill="rgba(16, 185, 129, 0.2)" stroke="#10b981" strokeWidth="1.5" />
        </svg>
      </div>

      <footer className={styles.statsFooter}>
        <div className={styles.statItem}>
          <span>Mean Luminance:</span>
          <strong>{defaultStats.meanLuminance} / 255</strong>
        </div>
        <div className={styles.statItem}>
          <span>Clipping Alerts:</span>
          <span className={defaultStats.isExposureCompliant ? styles.passPill : styles.warnPill}>
            {defaultStats.isExposureCompliant ? 'Passed (Balanced)' : 'Clipping Detected'}
          </span>
        </div>
      </footer>
    </div>
  );
};
