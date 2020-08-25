/**
 * Utilities
 */

const LOCALE = 'en-AU';
const CURRENCY = 'AUD';

export const parseIntFallback = (value: string, fallback: number = 0) => {
	const parsed = Number.parseInt(value);
	return Number.isNaN(parsed) ? fallback : parsed;
};

const percentFormatter = new Intl.NumberFormat(LOCALE, { style: 'percent' });
const currencyFormatter = new Intl.NumberFormat(LOCALE, {
	style: 'currency',
	currency: CURRENCY,
});

export const formatPercent = percentFormatter.format;
export const formatCurrency = currencyFormatter.format;
