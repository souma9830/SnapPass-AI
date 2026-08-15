import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Layers,
  Clock,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Trash2,
  ExternalLink,
  Sparkles,
  RefreshCw,
  Inbox,
  Loader2,
} from 'lucide-react';
import { useJobQueue } from '../context/JobQueueContext';
import './QueuePage.css';

const QueuePage = ({ darkMode }) => {
  const {
    jobs,
    activeCount,
    retryJob,
    removeJob,
    clearCompleted,
    retryAllFailed,
    reopenJobResult,
  } = useJobQueue();

  const [activeTab, setActiveTab] = useState('all');

  const pendingCount = jobs.filter((j) => j.status === 'pending' || j.status === 'queued').length;
  const processingCount = jobs.filter((j) => j.status === 'processing').length;
  const activeJobsCount = pendingCount + processingCount;
  const completedJobsCount = jobs.filter((j) => j.status === 'completed' || j.status === 'done').length;
  const failedJobsCount = jobs.filter((j) => j.status === 'failed').length;

  const filteredJobs = jobs.filter((job) => {
    if (activeTab === 'active') {
      return job.status === 'processing' || job.status === 'pending' || job.status === 'queued';
    }
    if (activeTab === 'completed') {
      return job.status === 'completed' || job.status === 'done';
    }
    if (activeTab === 'failed') {
      return job.status === 'failed';
    }
    return true;
  });

  return (
    <div className="queue-page">
      {/* Header */}
      <div className="queue-header">
        <div className="queue-title-group">
          <h1>Processing Queue & History</h1>
          <p>Track live AI photo processing jobs, reopen results, and retry tasks</p>
        </div>

        <div className="queue-actions-top">
          {completedJobsCount > 0 && (
            <button
              type="button"
              className="queue-btn queue-btn-secondary"
              onClick={clearCompleted}
            >
              <Trash2 size={16} />
              Clear Completed ({completedJobsCount})
            </button>
          )}

          {failedJobsCount > 0 && (
            <button
              type="button"
              className="queue-btn queue-btn-danger"
              onClick={retryAllFailed}
            >
              <RotateCcw size={16} />
              Retry Failed ({failedJobsCount})
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="queue-tabs">
        <button
          type="button"
          className={`queue-tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All Jobs <span className="queue-tab-count">{jobs.length}</span>
        </button>

        <button
          type="button"
          className={`queue-tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active Processing <span className="queue-tab-count">{activeJobsCount}</span>
        </button>

        <button
          type="button"
          className={`queue-tab ${activeTab === 'completed' ? 'active' : ''}`}
          onClick={() => setActiveTab('completed')}
        >
          Completed <span className="queue-tab-count">{completedJobsCount}</span>
        </button>

        <button
          type="button"
          className={`queue-tab ${activeTab === 'failed' ? 'active' : ''}`}
          onClick={() => setActiveTab('failed')}
        >
          Failed <span className="queue-tab-count">{failedJobsCount}</span>
        </button>
      </div>

      {/* Jobs List */}
      {filteredJobs.length === 0 ? (
        <div className="queue-empty-state">
          <Inbox size={48} className="queue-empty-icon" />
          <h3>No Processing Jobs Found</h3>
          <p>
            {activeTab === 'all'
              ? 'Upload a photo to start AI processing and track job status here.'
              : `No jobs currently matching '${activeTab}' state.`}
          </p>
          <Link to="/upload" className="queue-btn queue-btn-primary" style={{ textDecoration: 'none' }}>
            <Sparkles size={16} />
            Start Photo Processing
          </Link>
        </div>
      ) : (
        <div className="queue-list">
          {filteredJobs.map((job) => {
            const isProcessing = job.status === 'processing';
            const isCompleted = job.status === 'completed' || job.status === 'done';
            const isFailed = job.status === 'failed';
            const isPending = job.status === 'pending' || job.status === 'queued';
            const jobIdStr = job.jobId || job.id;

            return (
              <div key={jobIdStr} className="queue-card">
                {/* Card Top */}
                <div className="queue-card-top">
                  <div className="queue-card-info">
                    <span className="queue-card-filename">{job.filename}</span>
                    <span className="queue-card-sub">
                      <span>ID: {jobIdStr.slice(0, 8)}...</span>
                      <span>Preset: {job.payload?.photoSizePreset || '35x45'}</span>
                      {job.createdAt && (
                        <span>
                          <Clock size={12} style={{ display: 'inline', marginRight: '3px' }} />
                          {new Date(job.createdAt).toLocaleTimeString()}
                        </span>
                      )}
                    </span>
                  </div>

                  {/* Status Badge */}
                  <div>
                    {isProcessing && (
                      <span className="queue-badge queue-badge-processing">
                        <Loader2 size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
                        Processing...
                      </span>
                    )}

                    {isPending && (
                      <span className="queue-badge queue-badge-pending">
                        <Clock size={14} />
                        Queued
                      </span>
                    )}

                    {isCompleted && (
                      <span className="queue-badge queue-badge-completed">
                        <CheckCircle2 size={14} />
                        Completed
                      </span>
                    )}

                    {isFailed && (
                      <span className="queue-badge queue-badge-failed">
                        <XCircle size={14} />
                        Failed
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress Bar & Stage */}
                {(isProcessing || isPending) && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <div className="queue-progress-bar-bg">
                      <div
                        className="queue-progress-bar-fill"
                        style={{ width: `${Math.max(5, job.progress || 0)}%` }}
                      />
                    </div>
                    <div className="queue-progress-info">
                      <span>Stage: {job.stage || 'Processing'}</span>
                      <span>{job.progress || 0}%</span>
                    </div>
                  </div>
                )}

                {/* Error Message */}
                {isFailed && job.error && (
                  <div
                    style={{
                      background: '#fee2e2',
                      color: '#991b1b',
                      borderRadius: '8px',
                      padding: '0.6rem 0.875rem',
                      fontSize: '0.85rem',
                    }}
                  >
                    Error: {job.error}
                  </div>
                )}

                {/* Card Actions */}
                <div className="queue-card-actions">
                  {isCompleted && (
                    <button
                      type="button"
                      className="queue-btn queue-btn-primary"
                      onClick={() => reopenJobResult(job)}
                    >
                      <ExternalLink size={16} />
                      View Result
                    </button>
                  )}

                  {isFailed && (
                    <button
                      type="button"
                      className="queue-btn queue-btn-primary"
                      onClick={() => retryJob(jobIdStr)}
                    >
                      <RotateCcw size={16} />
                      Retry Job
                    </button>
                  )}

                  <button
                    type="button"
                    className="queue-btn queue-btn-secondary"
                    onClick={() => removeJob(jobIdStr)}
                    title="Remove from queue history"
                  >
                    <Trash2 size={16} />
                    Remove
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default QueuePage;
