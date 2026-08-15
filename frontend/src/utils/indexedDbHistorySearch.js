export const filterHistory = (items = [], query = '') => {
    if (!query) return items;
    return items.filter(i => (i.name || '').toLowerCase().includes(query.toLowerCase()));
};