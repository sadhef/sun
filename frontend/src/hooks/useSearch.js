import { useMemo } from 'react';

export const useSearch = (data, searchTerm, searchFields) => {
  return useMemo(() => {
    if (!searchTerm || searchTerm.trim() === '') {
      return data;
    }

    const term = searchTerm.toLowerCase();

    return data.filter(item => {
      return searchFields.some(field => {
        const value = field.split('.').reduce((obj, key) => obj?.[key], item);
        return value && String(value).toLowerCase().includes(term);
      });
    });
  }, [data, searchTerm, searchFields]);
};
