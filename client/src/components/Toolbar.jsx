import React from 'react';
import './Toolbar.css';

export default function Toolbar({ onCompile, compiling, hasError, showLog, onToggleLog }) {
  return (
    <div className="toolbar">
      <div className="toolbar-brand">
        <span className="toolbar-logo">📄</span>
        <span className="toolbar-title">LaTeX View</span>
      </div>
      <div className="toolbar-actions">
        <button
          className="btn btn-compile"
          onClick={onCompile}
          disabled={compiling}
        >
          {compiling ? (
            <>
              <span className="spinner" />
              Compiling…
            </>
          ) : (
            <>
              <span className="icon">▶</span>
              Recompile
            </>
          )}
        </button>
        <button
          className={`btn btn-log ${hasError ? 'btn-log--error' : ''} ${showLog ? 'btn-log--active' : ''}`}
          onClick={onToggleLog}
        >
          {hasError ? '⚠ Logs' : 'Logs'}
        </button>
      </div>
    </div>
  );
}
