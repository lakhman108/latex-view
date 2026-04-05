import React from 'react';
import './PDFViewer.css';

export default function PDFViewer({ url, compiling }) {
  if (compiling) {
    return (
      <div className="pdf-viewer pdf-viewer--loading">
        <div className="pdf-loading-spinner" />
        <p>Compiling…</p>
      </div>
    );
  }

  if (!url) {
    return (
      <div className="pdf-viewer pdf-viewer--empty">
        <div className="pdf-empty-icon">📄</div>
        <p>Click <strong>Recompile</strong> to generate your PDF</p>
      </div>
    );
  }

  return (
    <div className="pdf-viewer">
      <iframe
        className="pdf-iframe"
        src={url}
        title="PDF Preview"
      />
    </div>
  );
}
