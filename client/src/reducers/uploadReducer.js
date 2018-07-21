import {
  SUBMIT_FORM_REQUEST,
  SUBMIT_FORM_SUCCESS,
  SUBMIT_FORM_FAILURE,
  CLOSE_SNACKBAR,
} from '../actions/types';

// this reducer manages this piece of state
const initialSate = {
  submitting: false,
  error: null,
  response: null,
  snackbarOpen: false,
};

export default (state = initialSate, action) => {
  switch (action.type) {
    case SUBMIT_FORM_REQUEST:
      return { ...state, submitting: true, error: null, snackbarOpen: false };

    case SUBMIT_FORM_SUCCESS:
      return {
        ...state,
        submitting: false,
        snackbarOpen: false,
        response: action.payload,
      };

    case SUBMIT_FORM_FAILURE:
      return {
        ...state,
        submitting: false,
        response: null,
        snackbarOpen: true,
        error: action.payload,
      };

    case CLOSE_SNACKBAR:
      return { ...state, snackbarOpen: false };

    default:
      return state;
  }
};
