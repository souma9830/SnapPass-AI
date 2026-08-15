import React from "react";
import "./SkeletonLoader.css";

const SkeletonLoader = ({ type = "text", count = 1, width, height, className = "" }) => {
  const renderSkeleton = (index) => {
    const key = `skeleton-${type}-${index}`;
    const customStyle = {
      ...(width ? { width } : {}),
      ...(height ? { height } : {}),
    };

    switch (type) {
      case "editor":
        return (
          <div className="skeleton-editor" key={key} style={customStyle}>
            <div className="skeleton-editor-inner loading-shimmer" />
            <div className="skeleton-editor-subtext loading-shimmer" />
          </div>
        );
      case "card":
        return (
          <div className="skeleton-card" key={key} style={customStyle}>
            <div className="skeleton-image loading-shimmer" />
            <div className="skeleton-title loading-shimmer" />
            <div className="skeleton-text loading-shimmer" />
          </div>
        );
      case "avatar":
        return (
          <div className="skeleton-avatar-group" key={key} style={customStyle}>
            <div className="skeleton-avatar loading-shimmer" />
            <div className="skeleton-title loading-shimmer" />
          </div>
        );
      case "table-row":
        return (
          <div className="skeleton-table-row" key={key} style={customStyle}>
            <div className="skeleton-cell short loading-shimmer" />
            <div className="skeleton-cell medium loading-shimmer" />
            <div className="skeleton-cell long loading-shimmer" />
          </div>
        );
      case "text":
      default:
        return (
          <div className="skeleton-text-group" key={key} style={customStyle}>
            <div className="skeleton-title loading-shimmer" />
            <div className="skeleton-text loading-shimmer" />
            <div className="skeleton-text short loading-shimmer" />
          </div>
        );
    }
  };

  return (
    <div
      className={`skeleton-container ${className}`.trim()}
      aria-label="Loading contents..."
      aria-busy="true"
      role="status"
    >
      {Array.from({ length: count }).map((_, idx) => renderSkeleton(idx))}
    </div>
  );
};

export default SkeletonLoader;

