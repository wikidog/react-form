import { SUBMIT_FORM_REQUEST, CLOSE_SNACKBAR } from './types';

export const submitFormRequest = values => ({
  type: SUBMIT_FORM_REQUEST,

  payload: values,
});

export const closeSnackbar = () => ({
  type: CLOSE_SNACKBAR,
});
