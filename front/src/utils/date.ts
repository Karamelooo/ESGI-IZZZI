export const toDateFR = (dateString: string): string => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
};

export const toIsoDate = (dateString: string): string | undefined => {
  if (!dateString) return undefined;
  if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) return dateString;

  const parts = dateString.split('/');
  if (parts.length === 3) {
    const [day, month, year] = parts;
    return `${year}-${month}-${day}`;
  }

  return undefined;
};
