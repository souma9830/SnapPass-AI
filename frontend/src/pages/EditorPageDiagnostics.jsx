import React, { useEffect } from 'react';

const EditorPageDiagnostics = ({
  sizePreset,
  background,
  attire,
  filename,
}) => {
  useEffect(() => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(
        `[EditorDiagnostics] State updated: preset=${sizePreset}, bg=${background}, attire=${attire}, file=${filename || 'none'}`
      );
    }
  }, [sizePreset, background, attire, filename]);

  return null; // Development diagnostic check, no visual impact on the DOM
};

export default EditorPageDiagnostics;
