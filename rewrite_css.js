const fs = require('fs');
const path = require('path');

const write = (file, content) => {
  fs.writeFileSync(path.join(__dirname, 'client/src', file), content.trim() + '\n', 'utf8');
};

write('index.css', `
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
@import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap');

:root {
  --bg-app: #0d0f15;
  --bg-panel: #161821;
  --bg-surface: #222530;
  --bg-hover: #2d313f;
  --border-color: rgba(255, 255, 255, 0.08);

  --text-primary: #f8fafc;
  --text-secondary: #94a3b8;
  --text-muted: #64748b;

  --accent-color: #6366f1;
  --accent-hover: #4f46e5;
  --error-color: #f87171;
  --error-bg: rgba(239, 68, 68, 0.1);

  --radius-sm: 6px;
  --radius-md: 10px;
  --radius-lg: 14px;

  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1);
  --shadow-lg: 0 10px 15px -3px rgb(0 0 0 / 0.5), 0 4px 6px -4px rgb(0 0 0 / 0.3);
  
  --transition-fast: 0.15s ease;
}

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

html, body, #root {
  height: 100%;
  overflow: hidden;
}

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  background: var(--bg-app);
  color: var(--text-primary);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
`);

write('App.css', `
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
  background: var(--bg-app);
}

.main-layout {
  display: flex;
  flex: 1;
  overflow: hidden;
  padding: 16px;
  gap: 16px;
}

.editor-preview-area {
  display: flex;
  flex: 1;
  overflow: hidden;
  background: var(--bg-panel);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  border: 1px solid var(--border-color);
  position: relative;
}

.editor-pane {
  height: 100%;
  overflow: hidden;
  flex-shrink: 0;
  border-radius: var(--radius-lg) 0 0 var(--radius-lg);
  background: #1e1e1e; /* matches Monaco vs-dark basic bg slightly better but Monaco does its own */
}

.preview-pane {
  height: 100%;
  overflow: hidden;
  flex-shrink: 0;
  background: var(--bg-panel);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}

.resize-handle {
  width: 1px;
  cursor: col-resize;
  background: var(--border-color);
  flex-shrink: 0;
  position: relative;
  z-index: 10;
  transition: background var(--transition-fast);
}

.resize-handle::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 32px;
  width: 4px;
  border-radius: 4px;
  background: var(--text-muted);
  opacity: 0;
  transition: opacity 0.2s, background 0.2s;
}

.resize-handle:hover,
.resize-handle:active {
  background: var(--accent-hover);
}

.resize-handle:hover::after,
.resize-handle:active::after {
  opacity: 1;
  background: var(--accent-color);
}
`);

write('components/Toolbar.css', `
.toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: var(--bg-panel);
  color: var(--text-primary);
  padding: 0 24px;
  height: 64px;
  flex-shrink: 0;
  border-bottom: 1px solid var(--border-color);
  z-index: 100;
}

.toolbar-brand {
  display: flex;
  align-items: center;
  gap: 12px;
}

.toolbar-logo {
  font-size: 22px;
  color: var(--accent-color);
  display: flex;
  align-items: center;
  justify-content: center;
}

.toolbar-title {
  font-size: 15px;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.toolbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  border: 1px solid transparent;
  border-radius: var(--radius-sm);
  padding: 8px 16px;
  font-size: 13px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-compile {
  background: var(--accent-color);
  color: white;
  box-shadow: var(--shadow-sm);
}

.btn-compile:hover:not(:disabled) {
  background: var(--accent-hover);
  transform: translateY(-1px);
}

.btn-compile:active:not(:disabled) {
  transform: translateY(0);
}

.btn-compile:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  background: var(--bg-surface);
  color: var(--text-muted);
}

.btn-log {
  background: var(--bg-surface);
  color: var(--text-secondary);
  border-color: var(--border-color);
}

.btn-log:hover {
  background: var(--bg-hover);
  color: var(--text-primary);
}

.btn-log--error {
  background: var(--error-bg);
  color: var(--error-color);
  border-color: rgba(239, 68, 68, 0.2);
}

.btn-log--error:hover {
  background: rgba(239, 68, 68, 0.15);
  border-color: rgba(239, 68, 68, 0.4);
}

.btn-log--active {
  background: var(--bg-hover);
  color: var(--text-primary);
  border-color: var(--text-muted);
}

.spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(255,255,255,0.3);
  border-top-color: currentColor;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.icon {
  font-size: 14px;
  display: flex;
}
`);

write('components/FileTree.css', `
.file-tree {
  width: 220px;
  min-width: 200px;
  background: var(--bg-panel);
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  flex-shrink: 0;
  box-shadow: var(--shadow-md);
}

.file-tree-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px;
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  color: var(--text-muted);
  border-bottom: 1px solid var(--border-color);
}

.file-tree-add {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 16px;
  cursor: pointer;
  padding: 4px;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.file-tree-add:hover {
  background: var(--bg-surface);
  color: var(--text-primary);
}

.file-tree-list {
  list-style: none;
  margin: 0;
  padding: 12px 8px;
  overflow-y: auto;
}

.file-tree-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  cursor: pointer;
  color: var(--text-secondary);
  font-size: 13px;
  border-radius: var(--radius-sm);
  transition: all var(--transition-fast);
  margin-bottom: 2px;
}

.file-tree-item:hover {
  background: var(--bg-surface);
  color: var(--text-primary);
}

.file-tree-item--active {
  background: rgba(99, 102, 241, 0.1);
  color: var(--accent-color);
  font-weight: 500;
}

.file-tree-icon {
  font-size: 15px;
  opacity: 0.9;
  display: flex;
}

.file-tree-name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
`);

write('components/PDFViewer.css', `
.pdf-viewer {
  width: 100%;
  height: 100%;
  background: #f1f5f9; /* Soft light background so the PDF pops nicely */
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
}

.pdf-iframe {
  width: 100%;
  height: 100%;
  border: none;
  background: white;
}

.pdf-viewer--loading,
.pdf-viewer--empty {
  justify-content: center;
  align-items: center;
  background: var(--bg-panel);
  color: var(--text-secondary);
  gap: 20px;
}

.pdf-loading-spinner {
  width: 44px;
  height: 44px;
  border: 3px solid var(--bg-surface);
  border-top-color: var(--accent-color);
  border-radius: 50%;
  animation: spinner 0.8s ease-in-out infinite;
}

@keyframes spinner {
  to { transform: rotate(360deg); }
}

.pdf-empty-icon {
  font-size: 50px;
  color: var(--border-color);
  margin-bottom: 8px;
}

.pdf-viewer--empty p,
.pdf-viewer--loading p {
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: var(--text-muted);
}
`);

write('components/LogPanel.css', `
.log-panel {
  width: 100%;
  height: 100%;
  background: var(--bg-panel);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  color: var(--text-primary);
}

.log-panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 20px;
  background: var(--bg-surface);
  border-bottom: 1px solid var(--border-color);
}

.log-panel-title {
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.8px;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.log-panel-title--error {
  color: var(--error-color);
}

.log-panel-close {
  background: transparent;
  border: 1px solid transparent;
  color: var(--text-muted);
  border-radius: var(--radius-sm);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  padding: 4px;
  transition: all var(--transition-fast);
}

.log-panel-close:hover {
  color: var(--text-primary);
  background: var(--bg-hover);
  border-color: var(--border-color);
}

.log-panel-error {
  padding: 16px 20px;
  background: var(--error-bg);
  color: var(--error-color);
  font-size: 13px;
  font-weight: 500;
  border-bottom: 1px solid rgba(239, 68, 68, 0.2);
}

.log-panel-content {
  flex: 1;
  overflow: auto;
  margin: 0;
  padding: 20px;
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.6;
  white-space: pre-wrap;
  word-break: break-word;
  color: var(--text-secondary);
}
`);

console.log("All CSS files updated successfully!");
