import {
  SUBMIT_FORM_REQUEST,
  OPEN_SNACKBAR,
  CLOSE_SNACKBAR,
  START_PROCESS,
  END_PROCESS,
} from './types';

export const startProcess = () => ({
  type: START_PROCESS,
});

export const endProcess = () => ({
  type: END_PROCESS,
});

export const submitFormRequest = values => ({
  type: SUBMIT_FORM_REQUEST,
  payload: values,
});

export const openSnackbar = message => ({
  type: OPEN_SNACKBAR,
  payload: message,
});

export const closeSnackbar = () => ({
  type: CLOSE_SNACKBAR,
});
