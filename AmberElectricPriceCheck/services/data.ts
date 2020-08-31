/**
 * Data Service
 */

import { getTime } from 'date-fns';
import { findLastIndex } from 'lodash';
import { CONFIG } from '../config';
import { priceThresholdReducerPredicate } from '../functions';
import {
	PeriodNotificationData,
	PeriodType,
	PricePeriodNotification,
	Priority,
} from '../interfaces';
import { mapListResponseToModel } from '../utils/reducers';
import { fetchPriceList } from './network';

export async function fetchData(): Promise<PeriodNotificationData> {
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

	const warningPeriodIndexes = CONFIG.Warning.PeriodIndexes;
	const criticalPeriodIndexes = CONFIG.Critical.PeriodIndexes;

	const warningThreshold = CONFIG.Warning.Price;
	const criticalThreshold = CONFIG.Critical.Price;

	// TODO: Upgrade to reduce to several periods of time so windows of time can be reported.
	const criticalPeriods: PricePeriodNotification[] = criticalPeriodIndexes
		.reduce(
			priceThresholdReducerPredicate(priceForecast, criticalThreshold),
			[]
		)
		.map((p) => ({ ...p, priority: Priority.Critical }));

	const warningPeriods: PricePeriodNotification[] = warningPeriodIndexes
		.reduce(
			priceThresholdReducerPredicate(
				priceForecast,
				warningThreshold,
				criticalThreshold
			),
			[]
		)
		.map((p) => ({ ...p, priority: Priority.Warning }));

	const periods = [...criticalPeriods, ...warningPeriods].sort(
		(a, b) => getTime(a.period) - getTime(b.period)
	);

	return {
		periods,
		priority: Boolean(criticalPeriods.length)
			? Priority.Critical
			: Priority.Warning,
	};
}
