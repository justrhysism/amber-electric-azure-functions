import { AzureFunction, Context } from '@azure/functions';
import { fetchPriceList } from './services/network';
import { mapListResponseToModel } from './utils/reducers';
import {
	parseIntFallback,
	formatPercent,
	formatCurrency,
	parseFloatFallback,
} from './utils/utils';
import { findLastIndex } from 'lodash';
import { PeriodType, PricePeriodModel } from './interfaces';
import { format } from 'date-fns';
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
			.map(Number.parseInt),
	},
	Critical: {
		Price: parseFloatFallback(process.env['PriceCheck.Critical.Price'], 1.0),
		PeriodIndicies: (process.env['PriceCheck.Critical.PeriodIndicies'] ?? '0,1')
			.split(',')
			.map(Number.parseInt),
	},
};

const notifier = new Push({
	user: process.env['PUSHOVER_USER'],
	token: process.env['PUSHOVER_TOKEN'],
});

const formatPeriodLog = (period: PricePeriodModel) =>
	`Period starting ${format(period.period, 'h:mm a')}: ${formatCurrency(
		period.price
	)} (${formatPercent(period.renewablesPercentage)} Renewables)`;

const timerTrigger: AzureFunction = async function (
	context: Context,
	myTimer: any
): Promise<void> {
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
	const currentPricePeriod = priceListModel[currentPriceIndex];
	const nextPricePeriod = priceListModel[currentPriceIndex + 1];

	context.log(formatPeriodLog(currentPricePeriod));
	context.log(formatPeriodLog(nextPricePeriod));

	const priceForecast = priceListModel.slice(currentPriceIndex + 1);

	const warningPeriodIndicies = [0, 1, 7]; // Next period, +1hr, +4hr
	const criticalPeriodIndicies = [0, 1]; // Send critical alert if critical price breached within these periods

	const warningThreshold = 0.2;
	const criticalThreshold = 0.26;

	// TODO: Build up information to reduce notifications
	// Consolidate into a single notification.
	warningPeriodIndicies.forEach((periodIndex) => {
		const period = priceForecast[periodIndex];
		let title = 'No Warning';
		let priority = -1;
		const log = formatPeriodLog(period);

		if (period.price >= criticalThreshold) {
			context.log(`Critical Warning! - ${log}`);

			if (criticalPeriodIndicies.includes(periodIndex)) {
				// notifier.send({
				// 	title: 'Critical Price Warning',
				// 	message: log,
				// 	sound: 'siren',
				// 	priority: 1,
				// });
			}

			return;
		} else if (period.price >= warningThreshold) {
			context.log(`'Price Warning' - ${log}`);
			// notifier.send({
			// 	title: 'Price Warning',
			// 	message: log,
			// 	priority: 0,
			// });
			return;
		}

		context.log(`'No warning' - ${log}`);
	});
};

export default timerTrigger;

/*

Plan:
- Fetch price list
- (Later) compare with dates checked in storage
- Get pricing forecast
- Reduce to prices above warning threshold
- Send warning notifications for prices upcoming (later, multiple time windows, to start, next time window)
- (Later) track notifications sent for which forecasts
- (Later) notify if warning has cleared (e.g. prices dropped below threhold)

*/
