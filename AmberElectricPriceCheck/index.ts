import { AzureFunction, Context } from '@azure/functions';
import { fetchPriceList } from './services/network';
import { mapListResponseToModel } from './utils/reducers';
import {
	parseIntFallback,
	formatPercent,
	formatCurrency,
	parseFloatFallback,
	formatPriority,
} from './utils/utils';
import { findLastIndex, without, reject } from 'lodash';
import {
	PeriodType,
	PricePeriodModel,
	PricePeriodNotification,
	Priority,
} from './interfaces';
import { format, getTime } from 'date-fns';
import * as Push from 'pushover-notifications';

const CONFIG = {
	Postcode: process.env['PriceCheck.Postcode'] ?? '5000',
	TimezoneOffsetMinutes: parseIntFallback(
		process.env['PriceCheck.TimezoneOffsetMinutes'],
		0
	),
	Warning: {
		Price: parseFloatFallback(process.env['PriceCheck.Warning.Price'], 0.5),
		PeriodIndicies: (process.env['PriceCheck.Warning.PeriodIndicies'] ?? '0,1')
			.split(',')
			.map((i) => Number.parseInt(i)),
	},
	Critical: {
		Price: parseFloatFallback(process.env['PriceCheck.Critical.Price'], 1.0),
		PeriodIndicies: (process.env['PriceCheck.Critical.PeriodIndicies'] ?? '0,1')
			.split(',')
			.map((i) => Number.parseInt(i)),
	},
};

const notifier = new Push({
	user: process.env['PUSHOVER_USER'],
	token: process.env['PUSHOVER_TOKEN'],
});

const sendNotification = (notification) =>
	new Promise((resolve, reject) => {
		notifier.send(notification, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});

const priceThresholdReducerPredicate = (
	periods: PricePeriodModel[],
	threshold: number,
	max: number = Number.MAX_VALUE
) => (reduced: PricePeriodModel[], periodIndex: number) => {
	const period = periods[periodIndex];
	if (period.price >= threshold && period.price < max) reduced.push(period);
	return reduced;
};

const timerTrigger: AzureFunction = async function (
	context: Context,
	myTimer: any
): Promise<void> {
	// TODO: Tidy house!

	// TODO: Wrap in try
	const listResponse = await fetchPriceList(CONFIG.Postcode);

	const priceListModel = mapListResponseToModel(listResponse, {
		timezoneOffsetMinutes: CONFIG.TimezoneOffsetMinutes,
	});

	// Get Relevant Pricing
	const currentPriceIndex = findLastIndex(
		priceListModel,
		(p) => p.type === PeriodType.Actual
	);

	const priceForecast = priceListModel.slice(currentPriceIndex + 1);

	const warningPeriodIndicies = CONFIG.Warning.PeriodIndicies;
	const criticalPeriodIndicies = CONFIG.Critical.PeriodIndicies;

	const warningThreshold = CONFIG.Warning.Price;
	const criticalThreshold = CONFIG.Critical.Price;

	if (warningPeriodIndicies.some(Number.isNaN))
		throw Error(
			`Invalid Config: [PriceCheck.Warning.PeriodIndicies]: ${CONFIG.Warning.PeriodIndicies}`
		);

	if (criticalPeriodIndicies.some(Number.isNaN))
		throw Error(
			`Invalid Config: [PriceCheck.Critical.PeriodIndicies]: ${CONFIG.Critical.PeriodIndicies}`
		);

	if (Number.isNaN(warningThreshold))
		throw Error(
			`Invalid Config: [PriceCheck.Warning.Price]: ${CONFIG.Warning.Price}`
		);

	if (Number.isNaN(criticalThreshold))
		throw Error(
			`Invalid Config: [PriceCheck.Critical.Price]: ${CONFIG.Critical.Price}`
		);

	// TODO: Upgrade to reduce to several periods of time so windows of time can be reported.
	const criticalPeriods: PricePeriodNotification[] = criticalPeriodIndicies
		.reduce(
			priceThresholdReducerPredicate(priceForecast, criticalThreshold),
			[]
		)
		.map((p) => ({ ...p, priority: Priority.Critical }));

	const warningPeriods: PricePeriodNotification[] = warningPeriodIndicies
		.reduce(
			priceThresholdReducerPredicate(
				priceForecast,
				warningThreshold,
				criticalThreshold
			),
			[]
		)
		.map((p) => ({ ...p, priority: Priority.Warning }));

	const notificationPeriods = [...criticalPeriods, ...warningPeriods].sort(
		(a, b) => getTime(a.period) - getTime(b.period)
	);

	if (notificationPeriods.length) {
		const messagePriority = Boolean(criticalPeriods.length)
			? Priority.Critical
			: Priority.Warning;

		const isCritical = messagePriority === Priority.Critical;

		const title = isCritical
			? 'Critical Price Alert!'
			: 'Upcoming Price Warning';

		const message = notificationPeriods
			.map(
				(period) =>
					`${formatPriority(period.priority)} for ${format(
						period.period,
						'h:mm a'
					)}: ${formatCurrency(period.price)}`
			)
			.join('\n');

		const notification = {
			title,
			message,
			sound: isCritical ? 'siren' : 'vibrate',
			priority: messagePriority,
			device: process.env['PUSHOVER_DEVICE'] || undefined,
		};

		context.log(
			`Send notification: \n${title}\n${message}\n[Priority: ${messagePriority}]`
		);

		const result = await sendNotification(notification);
		context.log(result);
	} else {
		context.log('No warnings to report.');
	}
};

export default timerTrigger;
