import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { useToast } from './ToastContext';

const JOB_QUEUE_STORAGE_KEY = 'snappass_job_queue';
const POLL_INTERVAL_MS = 1500;

const JobQueueContext = createContext(null);

export const JobQueueProvider = ({ children }) => {
  const navigate = useNavigate();
  const toastCtx = useToast();
  const showToast = toastCtx?.showToast || (() => {});

  const [jobs, setJobs] = useState(() => {
    try {
      const stored = localStorage.getItem(JOB_QUEUE_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Save to localStorage whenever jobs update
  useEffect(() => {
    try {
      localStorage.setItem(JOB_QUEUE_STORAGE_KEY, JSON.stringify(jobs));
    } catch (err) {
      console.error('[JobQueue] Failed to save queue to localStorage:', err);
    }
  }, [jobs]);

  // Active (processing or pending) jobs count
  const activeCount = jobs.filter(
    (j) => j.status === 'processing' || j.status === 'pending' || j.status === 'queued'
  ).length;

  const updateJobInState = useCallback((jobId, patch) => {
    setJobs((prev) =>
      prev.map((job) => (job.jobId === jobId || job.id === jobId ? { ...job, ...patch } : job))
    );
  }, []);

  // Poll status for any active jobs
  useEffect(() => {
    const activeJobs = jobs.filter(
      (j) => j.status === 'processing' || j.status === 'pending' || j.status === 'queued'
    );

    if (activeJobs.length === 0) return;

    const pollInterval = setInterval(async () => {
      for (const job of activeJobs) {
        const id = job.jobId || job.id;
        try {
          const res = await api.get(`/process/job/${id}`);
          if (res.data?.success) {
            const data = res.data.data;
            const normalizedStatus = data.status === 'done' ? 'completed' : data.status;

            updateJobInState(id, {
              status: normalizedStatus,
              progress: data.progress ?? job.progress,
              stage: data.stage ?? job.stage,
              processedUrl: data.processedUrl || job.processedUrl,
              error: data.error?.message || (data.status === 'failed' ? 'Processing failed' : null),
            });

            if (normalizedStatus === 'completed' && job.status !== 'completed') {
              showToast(`Photo processing complete: ${job.filename}`, 'success');
            } else if (normalizedStatus === 'failed' && job.status !== 'failed') {
              showToast(`Photo processing failed: ${job.filename}`, 'error');
            }
          }
        } catch (err) {
          // If backend returns 404 or network error
          if (err.response?.status === 404) {
            updateJobInState(id, {
              status: 'failed',
              error: 'Job session expired on server.',
            });
          }
        }
      }
    }, POLL_INTERVAL_MS);

    return () => clearInterval(pollInterval);
  }, [jobs, updateJobInState, showToast]);

  const addJob = useCallback((jobData) => {
    const newJob = {
      id: jobData.jobId || `job-${Date.now()}`,
      jobId: jobData.jobId,
      filename: jobData.filename || 'Uploaded Photo',
      status: jobData.status || 'processing',
      progress: jobData.progress || 10,
      stage: jobData.stage || 'Initializing',
      processedUrl: jobData.processedUrl || null,
      error: null,
      createdAt: Date.now(),
      payload: jobData.payload || {},
    };

    setJobs((prev) => [newJob, ...prev.filter((j) => (j.jobId || j.id) !== newJob.id)]);
    showToast(`Added to processing queue: ${newJob.filename}`, 'info');
    return newJob;
  }, [showToast]);

  const retryJob = useCallback(async (jobId) => {
    const job = jobs.find((j) => j.jobId === jobId || j.id === jobId);
    if (!job) return;

    updateJobInState(jobId, {
      status: 'processing',
      progress: 5,
      stage: 'Retrying job...',
      error: null,
    });

    try {
      const res = await api.post(`/process/job/${jobId}/retry`, {});
      if (res.data?.success) {
        showToast(`Retrying processing for ${job.filename}...`, 'info');
      } else {
        updateJobInState(jobId, { status: 'failed', error: 'Failed to initiate retry.' });
      }
    } catch (err) {
      updateJobInState(jobId, {
        status: 'failed',
        error: err.response?.data?.message || 'Retry request failed.',
      });
    }
  }, [jobs, updateJobInState, showToast]);

  const removeJob = useCallback((jobId) => {
    setJobs((prev) => prev.filter((j) => j.jobId !== jobId && j.id !== jobId));
    api.delete(`/process/job/${jobId}`).catch(() => {});
  }, []);

  const clearCompleted = useCallback(() => {
    setJobs((prev) => prev.filter((j) => j.status !== 'completed' && j.status !== 'done'));
    showToast('Cleared completed jobs from queue history.', 'info');
  }, [showToast]);

  const retryAllFailed = useCallback(() => {
    const failedJobs = jobs.filter((j) => j.status === 'failed');
    failedJobs.forEach((j) => retryJob(j.jobId || j.id));
  }, [jobs, retryJob]);

  const reopenJobResult = useCallback((job) => {
    if (!job.processedUrl) return;
    navigate('/print-preview', {
      state: {
        processedUrl: job.processedUrl,
        filename: job.filename,
        sizePreset: job.payload?.photoSizePreset || '35x45',
        background: job.payload?.backgroundColour || 'white',
      },
    });
  }, [navigate]);

  return (
    <JobQueueContext.Provider
      value={{
        jobs,
        activeCount,
        addJob,
        retryJob,
        removeJob,
        clearCompleted,
        retryAllFailed,
        reopenJobResult,
      }}
    >
      {children}
    </JobQueueContext.Provider>
  );
};

export const useJobQueue = () => {
  const context = useContext(JobQueueContext);
  if (!context) {
    throw new Error('useJobQueue must be used within a JobQueueProvider');
  }
  return context;
};
