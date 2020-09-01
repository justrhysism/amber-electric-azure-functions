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
	Price: {
		Warning: parseFloatFallback(process.env['PriceCheck.Price.Warning'], 0.5),
		Critical: parseFloatFallback(process.env['PriceCheck.Price.Critical'], 0.5),
	},
	PeriodIndexes: {
		Warning: (process.env['PriceCheck.PeriodIndexes.Warning'] ?? '0,1')
			.split(',')
			.map((i) => Number.parseInt(i)),
		Critical: (process.env['PriceCheck.PeriodIndexes.Critical'] ?? '0,1')
			.split(',')
			.map((i) => Number.parseInt(i)),
	},
};

export const PUSHOVER = {
	app: {
		user: process.env['Pushover.User'] ?? undefined,
		token: process.env['Pushover.Token'] ?? undefined,
	},
	notification: {
		device: process.env['Pushover.Device'] ?? undefined,
	},
};

export const validateConfig = () => {
	if (CONFIG.PeriodIndexes.Warning.some(Number.isNaN))
		throw Error(
			`Invalid Config: [PriceCheck.PeriodIndexes.Warning]: ${CONFIG.PeriodIndexes.Warning}`
		);

	if (CONFIG.PeriodIndexes.Critical.some(Number.isNaN))
		throw Error(
			`Invalid Config: [PriceCheck.PeriodIndexes.Critical]: ${CONFIG.PeriodIndexes.Critical}`
		);

	if (Number.isNaN(CONFIG.Price.Warning))
		throw Error(
			`Invalid Config: [PriceCheck.Warning.Price]: ${CONFIG.Price.Warning}`
		);

	if (Number.isNaN(CONFIG.Price.Critical))
		throw Error(
			`Invalid Config: [PriceCheck.Price.Critical]: ${CONFIG.Price.Critical}`
		);
};
