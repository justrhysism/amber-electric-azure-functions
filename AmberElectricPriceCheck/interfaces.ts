/**
 * Internal Interfaces
 */

export enum PeriodType {
	Actual = 'ACTUAL',
	Forecast = 'FORECAST',
}

export enum Priority {
	Warning,
	Critical,
}

export interface PricePeriodModel {
	type: PeriodType;
	period: Date;
	price: number;
	renewablesPercentage: number;
}

export interface PricePeriodNotification extends PricePeriodModel {
	priority: Priority;
}
