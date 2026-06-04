import React from 'react';
import './SkeletonLoader.css';

const SkeletonLoader = ({ type = 'text', count = 1 }) => {
  const renderSkeletons = () => {
    return Array.from({ length: count }).map((_, index) => (
      <div key={index} className={`skeleton-item skeleton-${type}`} />
    ));
  };

  return <div className="skeleton-container">{renderSkeletons()}</div>;
};

export default SkeletonLoader;
