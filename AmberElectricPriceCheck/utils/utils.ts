/**
 * Utilities
 */

import { round } from 'lodash';
import { Priority } from '../interfaces';

const LOCALE = 'en-AU';
const CURRENCY = 'AUD';

export const parseIntFallback = (value: string, fallback: number = 0) => {
	const parsed = Number.parseInt(value);
	return Number.isNaN(parsed) ? fallback : parsed;
};

export const parseFloatFallback = (value: string, fallback: number = 0.0) => {
	const parsed = Number.parseFloat(value);
	return Number.isNaN(parsed) ? fallback : parsed;
};

const percentFormatter = new Intl.NumberFormat(LOCALE, { style: 'percent' });

export const formatPercent = percentFormatter.format;
export const formatCurrency = (value: number) =>
	value < 1.0 ? `${round(value * 100.0)}¢` : `$${round(value, 2).toFixed(2)}`;

export const formatPriority = (priority: Priority) => {
	return {
		[Priority.Warning]: 'Warning',
		[Priority.Critical]: 'CRITICAL',
	}[priority];
};
