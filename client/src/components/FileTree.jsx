import React, { useState } from 'react';
import './FileTree.css';

const FILES = [
  { name: 'main.tex', icon: '📄', active: true },
];

export default function FileTree() {
  const [active, setActive] = useState('main.tex');

  return (
    <div className="file-tree">
      <div className="file-tree-header">
        <span>Files</span>
        <button className="file-tree-add" title="New file">+</button>
      </div>
      <ul className="file-tree-list">
        {FILES.map(f => (
          <li
            key={f.name}
            className={`file-tree-item ${active === f.name ? 'file-tree-item--active' : ''}`}
            onClick={() => setActive(f.name)}
          >
            <span className="file-tree-icon">{f.icon}</span>
            <span className="file-tree-name">{f.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
