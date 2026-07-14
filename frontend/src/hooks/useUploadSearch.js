import { useState, useMemo } from 'react';

export function useUploadSearch(items) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPreset, setSelectedPreset] = useState('all');
  const [dateOrder, setDateOrder] = useState('desc'); // desc or asc

  const filteredItems = useMemo(() => {
    if (!items) return [];

    let result = [...items];

    // Search filter
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      result = result.filter(item => 
        (item.filename && item.filename.toLowerCase().includes(term)) ||
        (item.background && item.background.toLowerCase().includes(term))
      );
    }

    // Preset filter
    if (selectedPreset !== 'all') {
      result = result.filter(item => item.photoSizePreset === selectedPreset);
    }

    // Sort order
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || a.timestamp || 0).getTime();
      const dateB = new Date(b.createdAt || b.timestamp || 0).getTime();
      return dateOrder === 'desc' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [items, searchTerm, selectedPreset, dateOrder]);

  return {
    searchTerm,
    setSearchTerm,
    selectedPreset,
    setSelectedPreset,
    dateOrder,
    setDateOrder,
    filteredItems
  };
}
export default useUploadSearch;
