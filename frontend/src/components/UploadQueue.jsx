import React from 'react';
import './UploadQueue.css';

function UploadQueue({ queue, onRetry, onCancel }) {
  return (
    <div className="upload-queue">
      {queue.map((item) => (
        <div key={item.id} className="upload-queue__item">
          
          <div className="upload-queue__top">
            <span className="upload-queue__name">
              {item.file.name}
            </span>

            <span
              className={`upload-queue__status upload-queue__status--${item.status}`}
            >
              {item.status}
            </span>
          </div>

          <div className="upload-queue__progress">
            <div
              className="upload-queue__progress-fill"
              style={{ width: `${item.progress}%` }}
            />
          </div>

          <div className="upload-queue__actions">
            {item.status === 'failed' && (
              <button onClick={() => onRetry(item.id)}>
                Retry
              </button>
            )}

            {item.status !== 'completed' && (
              <button onClick={() => onCancel(item.id)}>
                Cancel
              </button>
            )}
          </div>

        </div>
      ))}
    </div>
  );
}

export default UploadQueue;