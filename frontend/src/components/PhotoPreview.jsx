import React from 'react';

const PhotoPreview = ({ processedUrl }) => (
  <div>
    <img src={processedUrl} alt="Preview" />
  </div>
);

export default PhotoPreview;