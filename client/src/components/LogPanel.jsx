import React from 'react';
import './LogPanel.css';

export default function LogPanel({ log, error, onClose }) {
  return (
    <div className="log-panel">
      <div className="log-panel-header">
        <span className={`log-panel-title ${error ? 'log-panel-title--error' : ''}`}>
          {error ? '⚠ Compilation Error' : 'Compilation Log'}
        </span>
        <button className="log-panel-close" onClick={onClose}>✕</button>
      </div>
      {error && (
        <div className="log-panel-error">{error}</div>
      )}
      {log && (
        <pre className="log-panel-content">{log}</pre>
      )}
    </div>
  );
}
