import {
  START_PROCESS,
  END_PROCESS,
  SUBMIT_FORM_REQUEST,
  SUBMIT_FORM_SUCCESS,
  SUBMIT_FORM_FAILURE,
  CLOSE_SNACKBAR,
} from '../actions/types';

// this reducer manages this piece of state
const initialSate = {
  workInProgress: false,
  fileUploading: false,
  error: null,
  response: null,
  snackbarOpen: false,
};

export default (state = initialSate, action) => {
  switch (action.type) {
    case START_PROCESS:
      return {
        ...state,
        workInProgress: true,
        error: null,
        snackbarOpen: false,
      };

    case END_PROCESS:
      return {
        ...state,
        workInProgress: false,
        error: null,
        snackbarOpen: false,
      };

    case SUBMIT_FORM_REQUEST:
      return {
        ...state,
        fileUploading: true,
        error: null,
        snackbarOpen: false,
      };

    case SUBMIT_FORM_SUCCESS:
      return {
        ...state,
        fileUploading: false,
        snackbarOpen: false,
        response: action.payload,
      };

    case SUBMIT_FORM_FAILURE:
      return {
        ...state,
        fileUploading: false,
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
