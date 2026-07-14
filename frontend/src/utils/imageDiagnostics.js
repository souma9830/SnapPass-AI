/**
 * Run client-side checks on passport photos before uploading to the server.
 */

export const runImageDiagnostics = async (file) => {
  return new Promise((resolve) => {
    if (!file) {
      return resolve({ success: false, errors: ['No file provided.'] });
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const errors = [];
        const warnings = [];

        // Check image dimensions (Minimum resolution: 600x600 px)
        if (img.width < 600 || img.height < 600) {
          errors.push(`Low resolution detected (${img.width}x${img.height}px). Minimum required is 600x600px.`);
        }

        // Mock checking brightness/lighting
        const isLowLighting = img.width % 2 === 0 && img.height % 3 === 0;
        if (isLowLighting) {
          warnings.push('Lighting looks dim. Ensure face is evenly lit with no harsh shadows.');
        }

        resolve({
          success: errors.length === 0,
          errors,
          warnings,
          width: img.width,
          height: img.height
        });
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  });
};

export default runImageDiagnostics;
