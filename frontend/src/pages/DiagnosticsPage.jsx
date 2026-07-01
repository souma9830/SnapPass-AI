import React, { useState, useEffect } from 'react';
import './DiagnosticsPage.css';
import { motion } from 'framer-motion';

function DiagnosticsPage({ darkMode }) {
  const [running, setRunning] = useState(false);
  const [report, setReport] = useState(null);
  const [networkLatency, setNetworkLatency] = useState('Not tested');
  const [storageOccupancy, setStorageOccupancy] = useState('0 KB');

  const calculateLocalStorageUsage = () => {
    let total = 0;
    for (let x in localStorage) {
      if (localStorage.hasOwnProperty(x)) {
        total += ((localStorage[x].length + x.length) * 2);
      }
    }
    return (total / 1024).toFixed(2) + ' KB';
  };

  const runSystemDiagnostics = async () => {
    setRunning(true);
    const startTime = Date.now();
    let apiStatus = 'Offline';
    let latency = 'N/A';

    try {
      const res = await fetch('/health');
      if (res.ok) {
        apiStatus = 'Online';
        latency = `${Date.now() - startTime} ms`;
        setNetworkLatency(latency);
      }
    } catch (err) {
      apiStatus = 'Unreachable';
      setNetworkLatency('Unreachable');
    }

    const storageUsage = calculateLocalStorageUsage();
    setStorageOccupancy(storageUsage);

    const diagnosticsData = {
      timestamp: new Date().toISOString(),
      browser: {
        userAgent: navigator.userAgent,
        language: navigator.language,
        online: navigator.onLine,
        cookieEnabled: navigator.cookieEnabled,
        platform: navigator.platform,
      },
      screen: {
        width: window.screen.width,
        height: window.screen.height,
        devicePixelRatio: window.devicePixelRatio,
      },
      application: {
        theme: darkMode ? 'Dark Mode' : 'Light Mode',
        localStorageUsed: storageUsage,
        apiEndpointStatus: apiStatus,
        apiLatency: latency,
      },
    };

    setReport(diagnosticsData);
    setRunning(false);
  };

  const copyToClipboard = () => {
    if (!report) return;
    navigator.clipboard.writeText(JSON.stringify(report, null, 2));
    alert('Diagnostics report copied to clipboard!');
  };

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.98 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.4 } },
  };

  return (
    <div className={`diagnostics-layout ${darkMode ? 'diagnostics-layout--dark' : ''}`}>
      <motion.div
        className="diagnostics-container page-content"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <header className="diagnostics-header">
          <h1 className="diagnostics-title">Diagnostics Utility</h1>
          <p className="diagnostics-subtitle">Perform system diagnostics, verify API connectivity, and generate compatibility reports.</p>
        </header>

        <div className="diagnostics-grid">
          {/* Controls Card */}
          <section className="diagnostics-card card">
            <h2 className="card-sec-title">Diagnostic Checks</h2>
            <p className="check-description">Verify system configuration and connection speeds to diagnose compatibility issues.</p>
            
            <div className="check-stats-list">
              <div className="stat-item">
                <span className="stat-label">Online Status:</span>
                <span className={`stat-value ${navigator.onLine ? 'success' : 'danger'}`}>
                  {navigator.onLine ? 'Connected' : 'Offline'}
                </span>
              </div>
              <div className="stat-item">
                <span className="stat-label">API Latency:</span>
                <span className="stat-value">{networkLatency}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Local Storage:</span>
                <span className="stat-value">{storageOccupancy}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Browser Platform:</span>
                <span className="stat-value">{navigator.platform || 'Unknown'}</span>
              </div>
            </div>

            <button
              onClick={runSystemDiagnostics}
              className="btn btn-primary run-checks-btn"
              disabled={running}
            >
              {running ? 'Running Checks...' : '⚡ Run Diagnostic Report'}
            </button>
          </section>

          {/* Report Viewer */}
          <section className="diagnostics-card card report-viewer-card">
            <div className="report-header">
              <h2 className="card-sec-title">Generated Report Output</h2>
              {report && (
                <button onClick={copyToClipboard} className="btn btn-secondary copy-report-btn">
                  📋 Copy JSON Report
                </button>
              )}
            </div>

            {report ? (
              <pre className="report-code-block">
                {JSON.stringify(report, null, 2)}
              </pre>
            ) : (
              <div className="report-empty-state">
                <span className="empty-icon">📁</span>
                <p>No report generated yet. Run diagnostic checks to populate system telemetry.</p>
              </div>
            )}
          </section>
        </div>
      </motion.div>
    </div>
  );
}

export default DiagnosticsPage;
