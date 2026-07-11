export const formatCurrency = (value: number): string => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatCurrencyPart = (value: number) => {
  const parts = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).formatToParts(value);
  
  const symbol = parts.find((p) => p.type === 'currency')?.value || 'R$';
  const integer = parts.filter((p) => p.type === 'integer' || p.type === 'group').map(p => p.value).join('');
  const decimal = parts.find((p) => p.type === 'decimal')?.value || ',';
  const fraction = parts.find((p) => p.type === 'fraction')?.value || '00';

  return { symbol, value: `${integer}${decimal}${fraction}` };
};
