import type { Language } from '../i18n/translations';

export const formatCurrency = (value: number, lang: Language = 'pt'): string => {
  const locale = lang === 'pt' ? 'pt-BR' : 'en-US';
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

export const formatCurrencyPart = (value: number, lang: Language = 'pt') => {
  const locale = lang === 'pt' ? 'pt-BR' : 'en-US';
  const parts = new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'BRL',
  }).formatToParts(value);
  
  const symbol = parts.find((p) => p.type === 'currency')?.value || 'R$';
  const integer = parts.filter((p) => p.type === 'integer' || p.type === 'group').map(p => p.value).join('');
  const decimal = parts.find((p) => p.type === 'decimal')?.value || (lang === 'pt' ? ',' : '.');
  const fraction = parts.find((p) => p.type === 'fraction')?.value || '00';

  return { symbol, value: `${integer}${decimal}${fraction}` };
};
