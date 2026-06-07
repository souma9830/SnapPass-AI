export const isCanvasSupported = () => {
    const elem = document.createElement('canvas');
    return !!(elem.getContext && elem.getContext('2d'));
};
