/**
 * Amber Electric Price Check Timer Function
 */

import { AzureFunction, Context } from '@azure/functions';
import { PUSHOVER, validateConfig } from './config';
import { buildNotification } from './functions';
import { send } from './services/notifier';
import { fetchData } from './services/data';

const timerTrigger: AzureFunction = async function (
	context: Context,
	myTimer: any
): Promise<void> {
	validateConfig();
	const data = await fetchData();

	if (!data.periods.length) {
		context.log('No warnings to report.');
		return;
	}

	const notification = buildNotification({
		...data,
		device: PUSHOVER.notification.device,
	});

	const { title, message, priority } = notification;

	context.log(
		`Send notification: \n${title}\n${message}\n[Priority: ${priority}]`
	);

	const result = await send(notification);
	context.log(result);
};

export default timerTrigger;
