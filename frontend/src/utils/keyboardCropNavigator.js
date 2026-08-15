export const handleCropKeyNavigation = (currentCrop, key, step = 5) => {
    if (!currentCrop) return currentCrop;
    const nextCrop = { ...currentCrop };

    switch (key) {
        case 'ArrowUp':
            nextCrop.y = Math.max(0, nextCrop.y - step);
            break;
        case 'ArrowDown':
            nextCrop.y += step;
            break;
        case 'ArrowLeft':
            nextCrop.x = Math.max(0, nextCrop.x - step);
            break;
        case 'ArrowRight':
            nextCrop.x += step;
            break;
        case '+':
        case '=':
            nextCrop.width += step;
            nextCrop.height += step;
            break;
        case '-':
            nextCrop.width = Math.max(20, nextCrop.width - step);
            nextCrop.height = Math.max(20, nextCrop.height - step);
            break;
        default:
            return currentCrop;
    }
    return nextCrop;
};