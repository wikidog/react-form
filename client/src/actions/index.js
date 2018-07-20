import { SUBMIT_FORM_REQUEST } from './types';

export const submitFormRequest = values => ({
  type: SUBMIT_FORM_REQUEST,
  payload: values,
});
