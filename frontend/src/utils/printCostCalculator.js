export const LAYOUT_CAPACITIES = {
    'A4': 6,
    '4x6': 2,
    '5x7': 4,
    'A3': 12,
    'Letter': 6
};

export const calculatePrintSheetCost = ({ paperSize = 'A4', copies = 1, costPerPage = 0.25 }) => {
    const photosPerSheet = LAYOUT_CAPACITIES[paperSize] || 6;
    const totalSheets = Math.ceil(copies / photosPerSheet);
    const totalCost = totalSheets * costPerPage;
    const costPerPhoto = totalCost / copies;

    return {
        paperSize,
        copies,
        photosPerSheet,
        totalSheets,
        totalCost: Number(totalCost.toFixed(2)),
        costPerPhoto: Number(costPerPhoto.toFixed(3)),
        wastageSlotCount: (totalSheets * photosPerSheet) - copies
    };
};