/**
 * Amber Electric API Contracts
 */

export interface E1 {
	dataAvailable: boolean;
	networkDailyPrice: string;
	basicMeterDailyPrice: string;
	additionalSmartMeterDailyPrice: string;
	amberDailyPrice: string;
	totalDailyPrice: string;
	networkKWHPrice: string;
	marketKWHPrice: string;
	greenKWHPrice: string;
	carbonNeutralKWHPrice: string;
	lossFactor: string;
	offsetKWHPrice: string;
	totalfixedKWHPrice: string;
	totalBlackPeakFixedKWHPrice: string;
	totalBlackShoulderFixedKWHPrice: string;
	totalBlackOffpeakFixedKWHPrice: string;
}

export interface E2 {
	dataAvailable: boolean;
	networkDailyPrice: string;
	basicMeterDailyPrice: string;
	additionalSmartMeterDailyPrice: string;
	amberDailyPrice: string;
	totalDailyPrice: string;
	networkKWHPrice: string;
	marketKWHPrice: string;
	greenKWHPrice: string;
	carbonNeutralKWHPrice: string;
	lossFactor: string;
	offsetKWHPrice: string;
	totalfixedKWHPrice: string;
	totalBlackPeakFixedKWHPrice: string;
	totalBlackShoulderFixedKWHPrice: string;
	totalBlackOffpeakFixedKWHPrice: string;
}

export interface B1 {
	dataAvailable: boolean;
	networkDailyPrice: string;
	basicMeterDailyPrice: string;
	additionalSmartMeterDailyPrice: string;
	amberDailyPrice: string;
	totalDailyPrice: string;
	networkKWHPrice: string;
	marketKWHPrice: string;
	greenKWHPrice: string;
	carbonNeutralKWHPrice: string;
	lossFactor: string;
	offsetKWHPrice: string;
	totalfixedKWHPrice: string;
	totalBlackPeakFixedKWHPrice: string;
	totalBlackShoulderFixedKWHPrice: string;
	totalBlackOffpeakFixedKWHPrice: string;
}

export interface B1PFIT {
	dataAvailable: boolean;
	networkDailyPrice: number;
	basicMeterDailyPrice: number;
	additionalSmartMeterDailyPrice: number;
	amberDailyPrice: number;
	totalDailyPrice: number;
	networkKWHPrice: number;
	marketKWHPrice: number;
	greenKWHPrice: number;
	carbonNeutralKWHPrice: number;
	lossFactor: number;
	offsetKWHPrice: number;
	totalfixedKWHPrice: string;
	totalBlackPeakFixedKWHPrice: string;
	totalBlackShoulderFixedKWHPrice: string;
	totalBlackOffpeakFixedKWHPrice: string;
}

export interface StaticPrices {
	E1: E1;
	E2: E2;
	B1: B1;
	B1PFIT: B1PFIT;
}

export interface VariablePricesAndRenewablePeriod {
	periodType: string;
	semiScheduledGeneration: string;
	operationalDemand: string;
	rooftopSolar: string;
	createdAt: Date;
	wholesaleKWHPrice: string;
	region: string;
	period: Date;
	renewablesPercentage: string;
	periodSource: string;
	percentileRank: string;
	forecastedAt?: Date;
	'forecastedAt+period': string;
}

export interface Data {
	currentNEMtime: Date;
	postcode: string;
	networkProvider: string;
	staticPrices: StaticPrices;
	variablePricesAndRenewables: VariablePricesAndRenewablePeriod[];
}

export interface ListPricesApiResponse {
	serviceResponseType: number;
	data: Data;
	message: string;
}
