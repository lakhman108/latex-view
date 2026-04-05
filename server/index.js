const express = require('express');
const cors = require('cors');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const os = require('os');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Compile LaTeX to PDF
app.post('/api/compile', (req, res) => {
  const { latex } = req.body;

  if (!latex || typeof latex !== 'string') {
    return res.status(400).json({ error: 'No LaTeX source provided.' });
  }

  const jobId = uuidv4();
  const workDir = path.join(os.tmpdir(), `latex-${jobId}`);

  try {
    fs.mkdirSync(workDir, { recursive: true });

    const texFile = path.join(workDir, 'main.tex');
    fs.writeFileSync(texFile, latex, 'utf8');

    try {
      execSync(
        `pdflatex -interaction=nonstopmode -output-directory="${workDir}" "${texFile}"`,
        { timeout: 30000, cwd: workDir }
      );
    } catch (compileErr) {
      const logFile = path.join(workDir, 'main.log');
      const logContent = fs.existsSync(logFile)
        ? fs.readFileSync(logFile, 'utf8')
        : compileErr.stderr?.toString() || compileErr.message;

      const pdfFile = path.join(workDir, 'main.pdf');
      if (!fs.existsSync(pdfFile)) {
        return res.status(422).json({
          error: 'Compilation failed',
          log: logContent,
        });
      }
      // PDF was generated despite errors (e.g., warnings only)
    }

    const pdfFile = path.join(workDir, 'main.pdf');
    if (!fs.existsSync(pdfFile)) {
      return res.status(422).json({ error: 'PDF was not generated.' });
    }

    const pdfBuffer = fs.readFileSync(pdfFile);
    res.set('Content-Type', 'application/pdf');
    res.set('Content-Disposition', 'inline; filename="main.pdf"');
    res.send(pdfBuffer);
  } catch (err) {
    console.error('Unexpected error:', err);
    res.status(500).json({ error: 'Internal server error.' });
  } finally {
    // Clean up temp files
    try {
      fs.rmSync(workDir, { recursive: true, force: true });
    } catch (_) {}
  }
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok' });
});

app.listen(PORT, () => {
  console.log(`LaTeX View server running on http://localhost:${PORT}`);
});
