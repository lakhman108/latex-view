const express = require('express');
const cors = require('cors');
const { execFileSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const os = require('os');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

function isPdflatexAvailable() {
  try {
    execFileSync('pdflatex', ['--version'], { timeout: 5000, stdio: 'ignore' });
    return true;
  } catch {
    return false;
  }
}

const hasPdflatex = isPdflatexAvailable();

if (!hasPdflatex) {
  console.warn(
      'pdflatex was not found on PATH. Install TeX Live (e.g. apt-get install texlive-latex-base texlive-latex-extra texlive-fonts-extra).'
  );
}

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Rate limit compilation requests to prevent abuse
const compileLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 20,             // max 20 requests per minute per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many compilation requests. Please wait a moment and try again.' },
});

// Compile LaTeX to PDF
app.post('/api/compile', compileLimiter, (req, res) => {
  const { latex } = req.body;

  if (!latex || typeof latex !== 'string') {
    return res.status(400).json({ error: 'No LaTeX source provided.' });
  }

  if (!hasPdflatex) {
    return res.status(503).json({
      error: 'LaTeX compiler is not installed on the server.',
      details:
        'Install pdflatex (TeX Live) and restart the server. On Ubuntu: sudo apt-get install texlive-latex-base texlive-latex-extra texlive-fonts-extra',
    });
  }

  const jobId = uuidv4();
  const workDir = path.join(os.tmpdir(), `latex-${jobId}`);

  try {
    fs.mkdirSync(workDir, { recursive: true });

    const texFile = path.join(workDir, 'main.tex');
    fs.writeFileSync(texFile, latex, 'utf8');

    try {
      // Use execFileSync with an arguments array to prevent command injection
      execFileSync(
        'pdflatex',
        ['-interaction=nonstopmode', '-output-directory', workDir, texFile],
        { timeout: 30000, cwd: workDir }
      );
    } catch (compileErr) {
      if (compileErr?.code === 'ENOENT') {
        return res.status(503).json({
          error: 'LaTeX compiler executable was not found.',
          details:
            'Install pdflatex (TeX Live) and restart the server. On Ubuntu: sudo apt-get install texlive-latex-base texlive-latex-extra texlive-fonts-extra',
        });
      }

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
  res.json({ status: 'ok', compiler: hasPdflatex ? 'pdflatex' : 'missing' });
});

app.listen(PORT, () => {
  console.log(`LaTeX View server running on http://localhost:${PORT}`);
});
