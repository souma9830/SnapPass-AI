import React, { useState, useRef, useEffect } from 'react';
import './LazyImage.css';

const LazyImage = ({
  src,
  alt,
  width,
  height,
  className,
  placeholder,
  onLoad,
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef(null);
  const observerRef = useRef(null);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    observerRef.current = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observerRef.current?.disconnect();
        }
      },
      { rootMargin: '200px 0px', threshold: 0.01 }
    );

    if (imgRef.current) {
      observerRef.current.observe(imgRef.current);
    }

    return () => observerRef.current?.disconnect();
  }, []);

  const handleLoad = () => {
    setLoaded(true);
    onLoad?.();
  };

  const ratio = width && height ? (height / width) * 100 : 0;

  return (
    <div
      ref={imgRef}
      className={`lazy-image-wrapper ${className || ''} ${loaded ? 'lazy-image-wrapper--loaded' : ''}`}
      style={ratio ? { paddingBottom: `${ratio}%` } : undefined}
    >
      {!inView && placeholder && (
        <div className="lazy-image-placeholder">{placeholder}</div>
      )}
      {inView && (
        <img
          src={src}
          alt={alt}
          className={`lazy-image ${loaded ? 'lazy-image--visible' : 'lazy-image--hidden'} ${error ? 'lazy-image--error' : ''}`}
          onLoad={handleLoad}
          onError={() => setError(true)}
          width={width}
          height={height}
          loading="lazy"
        />
      )}
      {error && (
        <div className="lazy-image-error" role="alert">
          Failed to load image
        </div>
      )}
    </div>
  );
};

export default LazyImage;
