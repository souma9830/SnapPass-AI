import React, { useState } from 'react';
import ReactCrop from 'react-image-crop';
import 'react-image-crop/dist/ReactCrop.css';
import './CropPlayground.css';

/**
 * CropPlayground
 *
 * Allows users to manually adjust the crop area before
 * continuing with passport photo generation.
 */
function CropPlayground({ imageUrl, onCropChange }) {
  const [crop, setCrop] = useState({
    unit: '%',
    x: 20,
    y: 10,
    width: 60,
    height: 80,
  });

  const handleCropChange = (newCrop) => {
    setCrop(newCrop);

    // Keep parent components updated with the latest crop selection
    if (onCropChange) {
      onCropChange(newCrop);
    }
  };

  const handleReset = () => {
    const defaultCrop = {
      unit: '%',
      x: 20,
      y: 10,
      width: 60,
      height: 80,
    };

    // Restore the initial crop area if users want to start over
    setCrop(defaultCrop);

    if (onCropChange) {
      onCropChange(defaultCrop);
    }
  };

  const handleCenterCrop = () => {
    const centeredCrop = {
      ...crop,
      x: 20,
      y: 10,
    };

    // Recenter the crop box while preserving its dimensions
    setCrop(centeredCrop);

    if (onCropChange) {
      onCropChange(centeredCrop);
    }
  };

  return (
    <div className="crop-playground">
      <div className="crop-playground__header">
        <h3>Crop Adjustment Playground</h3>
        <p>
          Fine-tune your photo framing before generating the final passport
          photo.
        </p>
      </div>

      <div className="crop-playground__editor">
        <ReactCrop crop={crop} onChange={handleCropChange}>
          <img
            src={imageUrl}
            alt="Crop adjustment preview"
            className="crop-playground__image"
          />
        </ReactCrop>
      </div>

      <div className="crop-playground__actions">
        <button
          type="button"
          className="crop-playground__button"
          onClick={handleCenterCrop}
        >
          Recenter
        </button>

        <button
          type="button"
          className="crop-playground__button"
          onClick={handleReset}
        >
          Reset Crop
        </button>
      </div>
    </div>
  );
}

export default CropPlayground;
