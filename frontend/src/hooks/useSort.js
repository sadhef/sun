import { useMemo, useState } from 'react';

export const useSort = (data, initialKey = '', initialDirection = 'asc') => {
  const [sortConfig, setSortConfig] = useState({
    key: initialKey,
    direction: initialDirection
  });

  const sortedData = useMemo(() => {
    if (!sortConfig.key) return data;

    return [...data].sort((a, b) => {
      const aVal = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], a);
      const bVal = sortConfig.key.split('.').reduce((obj, key) => obj?.[key], b);

      if (aVal === bVal) return 0;

      const comparison = aVal > bVal ? 1 : -1;
      return sortConfig.direction === 'asc' ? comparison : -comparison;
    });
  }, [data, sortConfig]);

  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  return { sortedData, requestSort, sortConfig };
};
