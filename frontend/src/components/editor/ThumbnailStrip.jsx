import React from 'react';
import './ThumbnailStrip.css';

export default function ThumbnailStrip({ thumbnails = [], selectedIndex, onSelect }) {
  if (!thumbnails.length) return null;

  return (
    <div className="thumbnail-strip-container">
      {thumbnails.map((item, idx) => (
        <img
          key={idx}
          src={item}
          alt={`Thumbnail ${idx}`}
          className={`thumbnail-img ${idx === selectedIndex ? 'selected' : ''}`}
          onClick={() => onSelect(idx)}
        />
      ))}
    </div>
  );
}
