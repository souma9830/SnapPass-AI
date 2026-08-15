import React, { useEffect, useRef, useState } from 'react';
import './HistogramAnalyzer.css';

function HistogramAnalyzer({ imageUrl, darkMode }) {
  const canvasRef = useRef(null);
  const [stats, setStats] = useState({ avgLuminance: 0, shadowPct: 0, highlightPct: 0, status: 'Analyzing...' });

  useEffect(() => {
    if (!imageUrl) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.src = imageUrl;

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 150;
      canvas.height = 150;
      ctx.drawImage(img, 0, 0, 150, 150);

      try {
        const imageData = ctx.getImageData(0, 0, 150, 150);
        const data = imageData.data;
        const rCounts = new Array(256).fill(0);
        const gCounts = new Array(256).fill(0);
        const bCounts = new Array(256).fill(0);

        let totalLuminance = 0;
        let shadowPixels = 0;
        let highlightPixels = 0;
        const totalPixels = data.length / 4;

        for (let i = 0; i < data.length; i += 4) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];

          rCounts[r]++;
          gCounts[g]++;
          bCounts[b]++;

          const lum = Math.round(0.299 * r + 0.587 * g + 0.114 * b);
          totalLuminance += lum;

          if (lum < 20) shadowPixels++;
          if (lum > 240) highlightPixels++;
        }

        const avgLum = Math.round(totalLuminance / totalPixels);
        const shadowPct = Math.round((shadowPixels / totalPixels) * 100);
        const highlightPct = Math.round((highlightPixels / totalPixels) * 100);

        let exposureStatus = 'Optimal Exposure';
        if (avgLum < 80) exposureStatus = 'Under-exposed (Dark)';
        else if (avgLum > 200) exposureStatus = 'Over-exposed (Washed out)';

        setStats({
          avgLuminance: avgLum,
          shadowPct,
          highlightPct,
          status: exposureStatus,
        });

        // Draw Histogram on chart canvas
        const chartCanvas = canvasRef.current;
        if (chartCanvas) {
          const cCtx = chartCanvas.getContext('2d');
          const width = chartCanvas.width;
          const height = chartCanvas.height;

          cCtx.clearRect(0, 0, width, height);

          const maxVal = Math.max(...rCounts, ...gCounts, ...bCounts) || 1;

          // Draw RGB curves
          const drawChannel = (counts, color) => {
            cCtx.beginPath();
            cCtx.strokeStyle = color;
            cCtx.lineWidth = 1.5;
            for (let i = 0; i < 256; i++) {
              const x = (i / 255) * width;
              const y = height - (counts[i] / maxVal) * (height - 10);
              if (i === 0) cCtx.moveTo(x, y);
              else cCtx.lineTo(x, y);
            }
            cCtx.stroke();
          };

          drawChannel(rCounts, 'rgba(239, 68, 68, 0.75)');
          drawChannel(gCounts, 'rgba(34, 197, 94, 0.75)');
          drawChannel(bCounts, 'rgba(59, 130, 246, 0.75)');
        }
      } catch (err) {
        setStats({ avgLuminance: 0, shadowPct: 0, highlightPct: 0, status: 'Analysis Unavailable' });
      }
    };
  }, [imageUrl]);

  return (
    <div className={`histogram-analyzer ${darkMode ? 'histogram-analyzer-dark' : ''}`}>
      <div className="histogram-header">
        <h4 className="histogram-title">📊 Real-Time RGB Exposure Histogram</h4>
        <span className={`histogram-status-badge ${stats.avgLuminance >= 80 && stats.avgLuminance <= 200 ? 'status-good' : 'status-warn'}`}>
          {stats.status}
        </span>
      </div>

      <div className="histogram-canvas-wrapper">
        <canvas ref={canvasRef} width={280} height={90} className="histogram-canvas" />
      </div>

      <div className="histogram-metrics">
        <div className="metric-item">
          <span className="metric-label">Avg Luminance</span>
          <span className="metric-val">{stats.avgLuminance} / 255</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Shadow Clipped</span>
          <span className="metric-val">{stats.shadowPct}%</span>
        </div>
        <div className="metric-item">
          <span className="metric-label">Highlight Clipped</span>
          <span className="metric-val">{stats.highlightPct}%</span>
        </div>
      </div>
    </div>
  );
}

export default HistogramAnalyzer;
