export const formatCurrency = (amount: number, currencyCode: string) => {
  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currencyCode,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currencyCode} ${amount.toFixed(2)}`;
  }
};

export const formatDate = (value: string | null) => {
  if (!value) return 'Not set';
  const date = new Date(`${value}T00:00:00.000Z`);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};
