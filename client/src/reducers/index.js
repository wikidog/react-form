import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';

import uploaderReducer from './uploaderReducer';

export default combineReducers({
  uploader: uploaderReducer,
  //
  // Redux-Form: the key must be 'form'
  form: reduxForm,
});
