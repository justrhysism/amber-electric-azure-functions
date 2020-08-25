/**
 * Reducers
 */

import { round } from 'lodash';
import { sub } from 'date-fns';
import {
	VariablePricesAndRenewablePeriod,
	E1,
	ListPricesApiResponse,
} from '../contracts/amber-electric';
import { PricePeriodModel, PeriodType } from '../interfaces';

export interface ListResponseReducerOptions {
	timezoneOffsetMinutes?: number;
}

const calculatePrice = (
	wholesalePrice: string,
	{ totalfixedKWHPrice: fixedPrice, lossFactor }: E1
): number =>
	round(
		round(
			Number.parseFloat(fixedPrice) +
				Number.parseFloat(lossFactor) * Number.parseFloat(wholesalePrice)
		)
	);

const mapPriceDataToModel = (
	period: VariablePricesAndRenewablePeriod,
	E1: E1,
	options?: ListResponseReducerOptions
): PricePeriodModel => ({
	type: period.periodType as PeriodType,
	period: sub(new Date(period.period), {
		minutes: 30 + (options?.timezoneOffsetMinutes ?? 0),
	}),
	price: calculatePrice(period.wholesaleKWHPrice, E1) / 100.0,
	renewablesPercentage: Number.parseFloat(period.renewablesPercentage),
});

export const mapListResponseToModel = (
	response: ListPricesApiResponse,
	options?: ListResponseReducerOptions
) =>
	response.data.variablePricesAndRenewables.map((period) =>
		mapPriceDataToModel(period, response.data.staticPrices.E1, options)
	);
