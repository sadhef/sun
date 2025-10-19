// Utility helper functions

export const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const formatDate = (dateString, format = 'yyyy-MM-dd') => {
  if (!dateString) return '';
  const date = new Date(dateString);

  const yyyy = date.getFullYear();
  const MM = String(date.getMonth() + 1).padStart(2, '0');
  const dd = String(date.getDate()).padStart(2, '0');

  if (format === 'yyyy-MM-dd') {
    return `${yyyy}-${MM}-${dd}`;
  } else if (format === 'dd/MM/yyyy') {
    return `${dd}/${MM}/${yyyy}`;
  }

  return dateString;
};

export const formatCurrency = (amount, currency = 'KWD') => {
  if (amount === null || amount === undefined) return '';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
  }).format(amount);
};

export const getStatusClass = (status) => {
  if (!status) return '';
  return 'status-' + status.toLowerCase().replace(/\s+/g, '-');
};

export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

export const sortData = (data, key, direction = 'asc', type = 'string') => {
  return [...data].sort((a, b) => {
    let aVal = key.split('.').reduce((obj, k) => obj?.[k], a);
    let bVal = key.split('.').reduce((obj, k) => obj?.[k], b);

    if (type === 'number') {
      aVal = Number(aVal) || 0;
      bVal = Number(bVal) || 0;
    } else if (type === 'date') {
      aVal = new Date(aVal).getTime() || 0;
      bVal = new Date(bVal).getTime() || 0;
    } else {
      aVal = String(aVal || '').toLowerCase();
      bVal = String(bVal || '').toLowerCase();
    }

    if (aVal === bVal) return 0;
    const comparison = aVal > bVal ? 1 : -1;
    return direction === 'asc' ? comparison : -comparison;
  });
};

export const filterDataBySearch = (data, searchTerm, searchFields) => {
  if (!searchTerm || searchTerm.trim() === '') return data;

  const term = searchTerm.toLowerCase();
  return data.filter(item => {
    return searchFields.some(field => {
      const value = field.split('.').reduce((obj, key) => obj?.[key], item);
      return value && String(value).toLowerCase().includes(term);
    });
  });
};

export const generateId = (prefix = 'ID') => {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const downloadFile = (data, filename, mimeType = 'application/octet-stream') => {
  const blob = new Blob([data], { type: mimeType });
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(url);
};

export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const validatePhone = (phone) => {
  const re = /^\+?[\d\s-()]+$/;
  return re.test(String(phone));
};

export const groupBy = (array, key) => {
  return array.reduce((groups, item) => {
    const groupKey = item[key];
    if (!groups[groupKey]) {
      groups[groupKey] = [];
    }
    groups[groupKey].push(item);
    return groups;
  }, {});
};

export const calculatePercentage = (part, total) => {
  if (!total || total === 0) return 0;
  return ((part / total) * 100).toFixed(2);
};

export const getDateRange = (startDate, endDate) => {
  const dates = [];
  let currentDate = new Date(startDate);
  const end = new Date(endDate);

  while (currentDate <= end) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
};
