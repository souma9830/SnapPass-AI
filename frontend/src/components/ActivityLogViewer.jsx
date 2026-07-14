import React, { useState } from 'react';

export const ActivityLogViewer = () => {
  const [logs] = useState([
    { id: 1, action: 'User Login', ip: '192.168.1.45', status: 'Success', time: 'Just now' },
    { id: 2, action: 'Generate Passport Photo', ip: '192.168.1.45', status: 'Success', time: '10 mins ago' },
    { id: 3, action: 'Change Account Password', ip: '192.168.1.45', status: 'Success', time: '1 hour ago' },
    { id: 4, action: 'Failed Admin Access Attempt', ip: '203.0.113.12', status: 'Blocked', time: '3 hours ago' },
  ]);

  return (
    <div className="activity-log-viewer" style={{ padding: '20px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.01)', marginTop: '20px' }}>
      <h3 style={{ margin: '0 0 15px 0', fontSize: '1.1rem', fontWeight: '600' }}>Recent Security Activities</h3>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {logs.map(log => (
          <div key={log.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', borderRadius: '8px', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.9rem', fontWeight: '500', color: '#f3f4f6' }}>{log.action}</p>
              <span style={{ fontSize: '0.75rem', color: '#9ca3af' }}>IP: {log.ip} • {log.time}</span>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: '600', padding: '4px 8px', borderRadius: '99px', background: log.status === 'Success' ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)', color: log.status === 'Success' ? '#10b981' : '#ef4444' }}>
              {log.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ActivityLogViewer;
