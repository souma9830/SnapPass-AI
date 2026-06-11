export const isCanvasSupported = () => {
    const elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
};

// Detect canvas rendering support
export const isCanvasSupported = () => {
  try {
    return !!window.HTMLCanvasElement;
  } catch (e) { return false; }
};
