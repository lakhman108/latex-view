# LaTeX View

A browser-based LaTeX editor and compiler with an Overleaf-like UI. Write LaTeX code in the editor and compile it to PDF instantly.

## Features

- 📝 **Monaco Editor** — VS Code-powered editor with syntax highlighting for LaTeX
- ⚡ **Live Compilation** — Compile LaTeX to PDF using `pdflatex` on the backend
- 📄 **PDF Preview** — View the compiled PDF side-by-side with your editor
- 🗂 **File Tree** — Navigate between project files
- 📋 **Compilation Logs** — View detailed error output when compilation fails
- ↔ **Resizable Panels** — Drag the divider to adjust editor/preview ratio
- 🎨 **Overleaf-like UI** — Familiar green-themed interface

## Tech Stack

- **Frontend**: React + Vite + Monaco Editor
- **Backend**: Node.js + Express
- **Compiler**: pdfLaTeX (TeX Live)

## Requirements

- Node.js 18+
- `pdflatex` (TeX Live) — install with `sudo apt-get install texlive-latex-base`

## Getting Started

### Install dependencies

```bash
# Install root dependencies
npm install

# Install client dependencies
cd client && npm install && cd ..

# Install server dependencies
cd server && npm install && cd ..
```

### Run in development mode

Start the backend server and the frontend dev server:

```bash
# Terminal 1: Start the backend
npm run server

# Terminal 2: Start the frontend
npm run client
```

Or run both concurrently:

```bash
npm run dev
```

The frontend runs at **http://localhost:5173** and the backend API at **http://localhost:3001**.

### Build for production

```bash
npm run build
```

The built frontend files will be in `client/dist/`.

## API

### `POST /api/compile`

Compiles LaTeX source code and returns a PDF.

**Request body:**
```json
{ "latex": "\\documentclass{article}..." }
```

**Response:**
- `200 OK` — PDF binary (Content-Type: application/pdf)
- `422 Unprocessable Entity` — Compilation error with log
- `400 Bad Request` — Missing or invalid LaTeX source

### `GET /api/health`

Returns `{"status": "ok"}` if the server is running.

## Project Structure

```
latex-view/
├── client/              # React frontend (Vite)
│   ├── src/
│   │   ├── App.jsx      # Main app component
│   │   ├── App.css      # Global styles
│   │   └── components/
│   │       ├── Toolbar.jsx    # Top toolbar with compile button
│   │       ├── FileTree.jsx   # Left sidebar file tree
│   │       ├── PDFViewer.jsx  # PDF preview panel
│   │       └── LogPanel.jsx   # Compilation log display
│   ├── index.html
│   └── package.json
├── server/              # Express backend
│   ├── index.js         # API server with /api/compile endpoint
│   └── package.json
└── package.json         # Root scripts
```
