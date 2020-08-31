/**
 * Notifier Service
 */

import * as Push from 'pushover-notifications';
import { PUSHOVER } from '../config';

const notifier = new Push(PUSHOVER.app);

export const send = (notification) =>
	new Promise((resolve, reject) => {
		notifier.send(notification, (err, result) => {
			if (err) return reject(err);
			resolve(result);
		});
	});
