import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
// import createSagaMiddleware from 'redux-saga';

import 'typeface-roboto';

// ==============================================================
// add support for IE 11 for create-react-app 2
import 'react-app-polyfill/ie11';
//
//! Polyfills are needed for Redux-Form to work in IE 11
//* Material UI doesn't need any polyfills.
import 'babel-polyfill';
// -------------------------------------------------------------

import reducer from './reducers';
// import rootSaga from './sagas';

import App from './components/App';

// const sagaMiddleware = createSagaMiddleware();
// 2nd parameter can be the pre-loaded state
const store = createStore(
  reducer,
  // composeWithDevTools(applyMiddleware(sagaMiddleware))
  composeWithDevTools(applyMiddleware())
);

// sagaMiddleware.run(rootSaga);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
