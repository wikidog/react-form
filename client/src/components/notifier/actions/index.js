import { OPEN_NOTIFIER, CLOSE_NOTIFIER } from './types';

export const openNotifier = message => ({
  type: OPEN_NOTIFIER,
  payload: message,
});

export const closeNotifier = () => ({
  type: CLOSE_NOTIFIER,
});
