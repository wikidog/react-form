import { OPEN_NOTIFIER, CLOSE_NOTIFIER } from '../actions/types';

const initialSate = {
  open: false,
  variant: 'info',
  message: null,
};

export default (state = initialSate, action) => {
  switch (action.type) {
    case OPEN_NOTIFIER:
      return {
        ...state,
        open: true,
        variant: action.payload.variant,
        message: action.payload.message,
      };

    case CLOSE_NOTIFIER:
      return {
        ...state,
        open: false,
        message: null,
      };

    default:
      return state;
  }
};
