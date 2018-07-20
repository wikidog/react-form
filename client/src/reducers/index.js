import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';

import uploadReducer from './uploadReducer';

export default combineReducers({
  upload: uploadReducer,
  //
  // Redux-Form: the key must be 'form'
  form: reduxForm,
});
