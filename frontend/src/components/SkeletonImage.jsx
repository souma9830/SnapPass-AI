import React, { useState } from 'react';
import './SkeletonImage.css';

/**
 * SkeletonImage — shows a shimmer skeleton while the image loads, then
 * smoothly fades the final image in. Prevents layout shifts by reserving
 * the element's space while loading.
 *
 * Props:
 *   src        (string)  — image source URL
 *   alt        (string)  — accessible alt text
 *   className  (string)  — extra class applied to the <img> element
 *   wrapperClassName (string) — extra class applied to the wrapper
 *   style      (object)  — inline styles applied to the wrapper
 */
function SkeletonImage({
  src,
  alt = '',
  className = '',
  wrapperClassName = '',
  style,
}) {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div
      className={`skeleton-image ${wrapperClassName} ${loaded ? 'skeleton-image--loaded' : ''}`}
      style={style}
    >
      {!loaded && !error && (
        <div className="skeleton-image__shimmer" aria-hidden="true" />
      )}
      {!error && (
        <img
          src={src}
          alt={alt}
          className={`skeleton-image__img ${className} ${loaded ? 'skeleton-image__img--visible' : ''}`}
          onLoad={() => setLoaded(true)}
          onError={() => setError(true)}
          loading="lazy"
        />
      )}
      {error && (
        <div className="skeleton-image__error" role="alert">
          Failed to load image
        </div>
      )}
    </div>
  );
}

export default SkeletonImage;
