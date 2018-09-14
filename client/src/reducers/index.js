import { combineReducers } from 'redux';
import { reducer as reduxForm } from 'redux-form';

import uploaderReducer from './uploaderReducer';
import notifierReducer from '../components/notifier/reducer';

export default combineReducers({
  uploader: uploaderReducer,
  notifier: notifierReducer,
  //
  // Redux-Form: the key must be 'form'
  form: reduxForm,
});
