import { OPEN_NOTIFIER, CLOSE_NOTIFIER } from './types';

export const openNotifier = messageObj => ({
  type: OPEN_NOTIFIER,
  payload: messageObj,
});

export const closeNotifier = () => ({
  type: CLOSE_NOTIFIER,
});
