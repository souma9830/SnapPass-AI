import React from 'react';
import './ConfirmModal.css';

export default function BatchProcessingQueueModal({
  isOpen,
  onClose,
  queue = [],
  onClearCompleted,
  onRetry,
  onRemove,
  onRetryAllFailed,
  onExportAllSuccess,
}) {
  if (!isOpen) return null;

  const total = queue.length;
  const completed = queue.filter((i) => i.status === 'completed' || i.status === 'done').length;
  const failed = queue.filter((i) => i.status === 'error' || i.status === 'failed').length;
  const pending = queue.filter((i) => i.status === 'pending' || i.status === 'processing' || i.status === 'queued').length;

  return (
    <div className="confirm-modal-overlay" role="dialog" aria-modal="true" aria-labelledby="batch-modal-title">
      <div className="confirm-modal-content max-w-lg w-full">
        <div className="flex justify-between items-center pb-3 border-b border-gray-200 dark:border-gray-700">
          <div>
            <h3 id="batch-modal-title" className="text-lg font-semibold text-gray-900 dark:text-white">
              Batch Processing Queue ({completed}/{total})
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {pending} pending • {completed} done • {failed} failed
            </p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 text-lg p-1 focus:outline-none"
            aria-label="Close batch export queue"
          >
            ✕
          </button>
        </div>

        <div className="my-4 max-h-64 overflow-y-auto space-y-2 pr-1">
          {queue.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-6">No items currently in batch queue.</p>
          ) : (
            queue.map((item) => (
              <div
                key={item.id}
                className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex flex-col gap-1.5"
              >
                <div className="flex justify-between items-center text-sm">
                  <span className="font-medium text-gray-800 dark:text-gray-200 truncate max-w-[220px]">
                    {item.title || item.name || 'Photo Item'}
                  </span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded font-medium ${
                        item.status === 'completed' || item.status === 'done'
                          ? 'bg-green-100 text-green-800 dark:bg-green-900/40 dark:text-green-300'
                          : item.status === 'error' || item.status === 'failed'
                          ? 'bg-red-100 text-red-800 dark:bg-red-900/40 dark:text-red-300'
                          : 'bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300'
                      }`}
                    >
                      {item.status}
                    </span>
                    {onRemove && (
                      <button
                        onClick={() => onRemove(item.id)}
                        className="text-xs text-gray-400 hover:text-red-500"
                        title="Remove item"
                      >
                        ✕
                      </button>
                    )}
                  </div>
                </div>

                {item.status === 'processing' && (
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div
                      className="bg-blue-600 h-1.5 rounded-full transition-all duration-300"
                      style={{ width: `${item.progress || 50}%` }}
                    />
                  </div>
                )}

                {(item.status === 'error' || item.status === 'failed') && (
                  <div className="flex justify-between items-center mt-1">
                    <span className="text-xs text-red-500 font-mono truncate max-w-[280px]">
                      {item.error || 'Processing failed'}
                    </span>
                    <button
                      onClick={() => onRetry && onRetry(item.id)}
                      className="text-xs font-semibold text-blue-600 hover:underline"
                    >
                      Retry
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700 text-xs">
          <div className="flex items-center gap-2">
            <button
              onClick={onClearCompleted}
              disabled={completed === 0}
              className="px-2.5 py-1.5 rounded border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-40"
            >
              Clear Completed
            </button>
            {failed > 0 && onRetryAllFailed && (
              <button
                onClick={onRetryAllFailed}
                className="px-2.5 py-1.5 rounded bg-amber-50 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 border border-amber-300 dark:border-amber-700 font-semibold"
              >
                Retry Failed ({failed})
              </button>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
