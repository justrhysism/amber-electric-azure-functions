/**
 * Config
 */

import { parseFloatFallback, parseIntFallback } from './utils/utils';

export const CONFIG = {
	Postcode: process.env['PriceCheck.Postcode'] ?? '5000',
	TimezoneOffsetMinutes: parseIntFallback(
		process.env['PriceCheck.TimezoneOffsetMinutes'],
		0
	),
	Warning: {
		Price: parseFloatFallback(process.env['PriceCheck.Warning.Price'], 0.5),
		PeriodIndexes: (
			process.env['PriceCheck.Warning.PeriodIndexes'] ??
			process.env['PriceCheck.Critical.PeriodIndicies'] ??
			'0,1'
		)
			.split(',')
			.map((i) => Number.parseInt(i)),
	},
	Critical: {
		Price: parseFloatFallback(process.env['PriceCheck.Critical.Price'], 1.0),
		PeriodIndexes: (
			process.env['PriceCheck.Critical.PeriodIndexes'] ??
			process.env['PriceCheck.Critical.PeriodIndicies'] ??
			'0,1'
		)
			.split(',')
			.map((i) => Number.parseInt(i)),
	},
};

export const PUSHOVER = {
	app: {
		user: process.env['PUSHOVER_USER'] ?? undefined,
		token: process.env['PUSHOVER_TOKEN'] ?? undefined,
	},
	notification: {
		device: process.env['PUSHOVER_DEVICE'] ?? undefined,
	},
};

export const validateConfig = () => {
	if (CONFIG.Warning.PeriodIndexes.some(Number.isNaN))
		throw Error(
			`Invalid Config: [PriceCheck.Warning.PeriodIndexes]: ${CONFIG.Warning.PeriodIndexes}`
		);

	if (CONFIG.Critical.PeriodIndexes.some(Number.isNaN))
		throw Error(
			`Invalid Config: [PriceCheck.Critical.PeriodIndexes]: ${CONFIG.Critical.PeriodIndexes}`
		);

	if (Number.isNaN(CONFIG.Warning.Price))
		throw Error(
			`Invalid Config: [PriceCheck.Warning.Price]: ${CONFIG.Warning.Price}`
		);

	if (Number.isNaN(CONFIG.Critical.Price))
		throw Error(
			`Invalid Config: [PriceCheck.Critical.Price]: ${CONFIG.Critical.Price}`
		);
};
