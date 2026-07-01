import React, { useState } from 'react';
import './ProcessingHistoryTimeline.css';
import { getSessionHistory } from '../utils/sessionManager';

function ProcessingHistoryTimeline() {
  const [filter, setFilter] = useState('all');

  const history = getSessionHistory() || [];

  const filteredHistory =
    filter === 'all'
      ? history
      : history.filter(
          (item) => item.status === filter
        );

  return (
    <div className="history-timeline">

      <div className="history-timeline__filters">
        <button onClick={() => setFilter('all')}>
          All
        </button>

        <button onClick={() => setFilter('processed')}>
          Processed
        </button>

        <button onClick={() => setFilter('failed')}>
          Failed
        </button>
      </div>

      <div className="history-timeline__list">
        {filteredHistory.length > 0 ? (
          filteredHistory.map((item, index) => (
            <div
              key={index}
              className="history-timeline__card"
            >
              <img
                src={item.localUrl || item.processedUrl}
                alt={item.filename}
                className="history-timeline__thumbnail"
              />

              <div className="history-timeline__content">
                <h3>{item.filename}</h3>

                <p>
                  Status:
                  <span
                    className={`history-timeline__status history-timeline__status--${item.status}`}
                  >
                    {item.status}
                  </span>
                </p>

                <p>
                  Export:
                  {item.exportType || 'N/A'}
                </p>
              </div>
            </div>
          ))
        ) : (
          <p className="history-timeline__empty">
            No history found.
          </p>
        )}
      </div>

    </div>
  );
}

export default ProcessingHistoryTimeline;