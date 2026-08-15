import React, { useState } from 'react';
import './DragDropUploadZone.css';

export default function DragDropUploadZone({ onFileDrop }) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      onFileDrop(e.dataTransfer.files[0]);
    }
  };

  return (
    <div
      className={`drag-drop-zone ${isDragging ? 'active' : ''}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
    >
      <p>Drag & Drop Portrait Image Here or Click to Browse</p>
    </div>
  );
}
