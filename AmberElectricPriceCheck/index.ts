import { AzureFunction, Context } from '@azure/functions';
import { fetchPriceList } from './services/network';
import { mapListResponseToModel } from './utils/reducers';
import { parseIntFallback, formatPercent, formatCurrency } from './utils/utils';
import { findLastIndex } from 'lodash';
import { PeriodType, PricePeriodModel } from './interfaces';
import { format } from 'date-fns';

const PRICE_CHECK_POSTCODE = process.env['PRICE_CHECK_POSTCODE'];
const PRICE_CHECK_TIMEZONE_OFFSET_MINUTES =
	process.env['PRICE_CHECK_TIMEZONE_OFFSET_MINUTES'];

const timerTrigger: AzureFunction = async function (
	context: Context,
	myTimer: any
): Promise<void> {
	// TODO: Wrap in try
	const listResponse = await fetchPriceList(PRICE_CHECK_POSTCODE);

	const priceListModel = mapListResponseToModel(listResponse, {
		timezoneOffsetMinutes: parseIntFallback(
			PRICE_CHECK_TIMEZONE_OFFSET_MINUTES
		),
	});

	// Get Relevant Pricing
	const currentPriceIndex = findLastIndex(
		priceListModel,
		(p) => p.type === PeriodType.Actual
	);
	const currentPricePeriod = priceListModel[currentPriceIndex];
	const nextPricePeriod = priceListModel[currentPriceIndex + 1];

	const formatPeriodLog = (period: PricePeriodModel, label: string) =>
		`Period starting ${format(period.period, 'h:mm a')}: ${formatCurrency(
			period.price
		)} (${formatPercent(period.renewablesPercentage)} Renewables)`;

	context.log(formatPeriodLog(currentPricePeriod, 'Current Period'));
	context.log(formatPeriodLog(nextPricePeriod, 'Next Period'));
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
