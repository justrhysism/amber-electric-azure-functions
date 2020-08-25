/**
 * Network Service
 */

import got from 'got';
import { ListPricesApiResponse } from '../contracts/amber-electric';

const ENDPOINT = 'https://api.amberelectric.com.au/prices/listprices';

export const fetchPriceList = async (postcode: string) =>
	await got
		.post(ENDPOINT, { json: { postcode: postcode } })
		.json<ListPricesApiResponse>();
