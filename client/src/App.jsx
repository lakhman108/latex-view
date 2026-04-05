import React, { useState, useCallback, useRef, useEffect } from 'react';
import Editor from '@monaco-editor/react';
import Toolbar from './components/Toolbar';
import PDFViewer from './components/PDFViewer';
import FileTree from './components/FileTree';
import LogPanel from './components/LogPanel';
import './App.css';

const DEFAULT_LATEX = `\\documentclass{article}
\\usepackage[utf8]{inputenc}
\\usepackage{amsmath}
\\usepackage{geometry}
\\geometry{margin=1in}

\\title{My First LaTeX Document}
\\author{Author Name}
\\date{\\today}

\\begin{document}

\\maketitle

\\section{Introduction}
Welcome to \\textbf{LaTeX View} --- a browser-based LaTeX editor inspired by Overleaf.

\\section{Mathematics}
Here is the famous Euler's identity:
\\[
  e^{i\\pi} + 1 = 0
\\]

And the quadratic formula:
\\[
  x = \\frac{-b \\pm \\sqrt{b^2 - 4ac}}{2a}
\\]

\\section{Lists}
\\begin{itemize}
  \\item First item
  \\item Second item
  \\item Third item with \\textit{italics}
\\end{itemize}

\\end{document}
`;

export default function App() {
  const [latex, setLatex] = useState(DEFAULT_LATEX);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [compiling, setCompiling] = useState(false);
  const [log, setLog] = useState('');
  const [showLog, setShowLog] = useState(false);
  const [error, setError] = useState(null);
  const [editorWidth, setEditorWidth] = useState(50);
  const prevPdfUrl = useRef(null);

  const compile = useCallback(async () => {
    setCompiling(true);
    setError(null);
    setLog('');
    try {
      const response = await fetch('/api/compile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ latex }),
      });

      if (response.ok) {
        const blob = await response.blob();
        if (prevPdfUrl.current) URL.revokeObjectURL(prevPdfUrl.current);
        const url = URL.createObjectURL(blob);
        prevPdfUrl.current = url;
        setPdfUrl(url);
        setShowLog(false);
      } else {
        const data = await response.json();
        setError(data.error || 'Compilation failed');
        setLog(data.log || '');
        setShowLog(true);
      }
    } catch (err) {
      setError('Network error: ' + err.message);
      setShowLog(true);
    } finally {
      setCompiling(false);
    }
  }, [latex]);

  useEffect(() => {
    compile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="app">
      <Toolbar
        onCompile={compile}
        compiling={compiling}
        hasError={!!error}
        showLog={showLog}
        onToggleLog={() => setShowLog(v => !v)}
      />
      <div className="main-layout">
        <FileTree />
        <div className="editor-preview-area">
          <div className="editor-pane" style={{ width: editorWidth + '%' }}>
            <Editor
              height="100%"
              defaultLanguage="latex"
              theme="vs-dark"
              value={latex}
              onChange={value => setLatex(value ?? '')}
              options={{
                fontSize: 14,
                minimap: { enabled: false },
                wordWrap: 'on',
                scrollBeyondLastLine: false,
                lineNumbers: 'on',
                renderLineHighlight: 'all',
                fontFamily: '"JetBrains Mono", "Fira Code", monospace',
                fontLigatures: true,
                padding: { top: 10 },
              }}
            />
          </div>
          <div
            className="resize-handle"
            onMouseDown={e => {
              e.preventDefault();
              const startX = e.clientX;
              const startWidth = editorWidth;
              const onMove = ev => {
                const area = document.querySelector('.editor-preview-area');
                if (!area) return;
                const totalWidth = area.offsetWidth;
                const delta = ((ev.clientX - startX) / totalWidth) * 100;
                const newWidth = Math.max(20, Math.min(80, startWidth + delta));
                setEditorWidth(newWidth);
              };
              const onUp = () => {
                window.removeEventListener('mousemove', onMove);
                window.removeEventListener('mouseup', onUp);
              };
              window.addEventListener('mousemove', onMove);
              window.addEventListener('mouseup', onUp);
            }}
          />
          <div className="preview-pane" style={{ width: (100 - editorWidth) + '%' }}>
            {showLog && (error || log) ? (
              <LogPanel log={log} error={error} onClose={() => setShowLog(false)} />
            ) : (
              <PDFViewer url={pdfUrl} compiling={compiling} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
