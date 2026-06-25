import React from "react";
import "./SkeletonLoader.css";

const SkeletonLoader = ({ type = "text", count = 1 }) => {
  const renderSkeleton = () => {
    switch (type) {
      case "editor":
        return (
          <div className="skeleton-editor" key={Math.random()}>
            <div className="skeleton-editor-inner loading-shimmer" />
            <div className="skeleton-editor-subtext loading-shimmer" />
          </div>
        );
      case "card":
        return (
          <div className="skeleton-card" key={Math.random()}>
            <div className="skeleton-image loading-shimmer" />
            <div className="skeleton-title loading-shimmer" />
            <div className="skeleton-text loading-shimmer" />
          </div>
        );
      case "avatar":
        return (
          <div className="skeleton-avatar-group" key={Math.random()}>
            <div className="skeleton-avatar loading-shimmer" />
            <div className="skeleton-title loading-shimmer" />
          </div>
        );
      case "text":
      default:
        return (
          <div className="skeleton-text-group" key={Math.random()}>
            <div className="skeleton-title loading-shimmer" />
            <div className="skeleton-text loading-shimmer" />
            <div className="skeleton-text short loading-shimmer" />
          </div>
        );
    }
  };

  return (
    <div className="skeleton-container" aria-label="Loading..." role="status">
      {Array.from({ length: count }).map(() => renderSkeleton())}
    </div>
  );
};

export default SkeletonLoader;
