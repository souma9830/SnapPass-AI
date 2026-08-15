export const resizeCanvasPhoto = (sourceCanvas, targetWidthPx, targetHeightPx) => {
    const offscreen = document.createElement('canvas');
    offscreen.width = targetWidthPx;
    offscreen.height = targetHeightPx;
    const ctx = offscreen.getContext('2d');
    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';
    ctx.drawImage(sourceCanvas, 0, 0, targetWidthPx, targetHeightPx);
    return offscreen;
};