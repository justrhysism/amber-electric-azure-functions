/**
 * Functions
 */

import { format } from 'date-fns';
import {
	PricePeriodModel,
	PricePeriodNotification,
	Priority,
} from './interfaces';
import { formatCurrency, formatPriority } from './utils/utils';

export const priceThresholdReducerPredicate = (
	periods: PricePeriodModel[],
	threshold: number,
	max: number = Number.MAX_VALUE
) => (reduced: PricePeriodModel[], periodIndex: number) => {
	const period = periods[periodIndex];
	if (period.price >= threshold && period.price < max) reduced.push(period);
	return reduced;
};

interface BuildNotificationOptions {
	priority: Priority;
	periods: PricePeriodNotification[];
	device?: string;
}

export const buildNotification = ({
	priority,
	periods,
	device,
}: BuildNotificationOptions) => {
	const isCritical = priority === Priority.Critical;

	const title = isCritical ? 'Critical Price Alert!' : 'Upcoming Price Warning';

	const message = periods
		.map(
			(period) =>
				`${formatPriority(period.priority)} for ${format(
					period.period,
					'h:mm a'
				)}: ${formatCurrency(period.price)}`
		)
		.join('\n');

	return {
		title,
		message,
		sound: isCritical ? 'siren' : 'vibrate',
		priority,
		device: device,
	};
};
