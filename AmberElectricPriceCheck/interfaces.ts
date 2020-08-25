/**
 * Internal Interfaces
 */

export enum PeriodType {
	Actual = 'ACTUAL',
	Forecast = 'FORECAST',
}

export interface PricePeriodModel {
	type: PeriodType;
	period: Date;
	price: number;
	renewablesPercentage: number;
}
