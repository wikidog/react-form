import {
  SUBMIT_FORM_REQUEST,
  CLOSE_SNACKBAR,
  UPLOADER_START_UPLOAD,
} from './types';

export const uploaderStartUpload = () => ({
  type: UPLOADER_START_UPLOAD,
});

export const submitFormRequest = values => ({
  type: SUBMIT_FORM_REQUEST,
  payload: values,
});

export const closeSnackbar = () => ({
  type: CLOSE_SNACKBAR,
});
