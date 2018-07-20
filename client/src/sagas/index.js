import { takeLatest, call, put, all } from 'redux-saga/effects';
import axios from 'axios';

import {
  SUBMIT_FORM_REQUEST,
  SUBMIT_FORM_SUCCESS,
  SUBMIT_FORM_FAILURE,
} from '../actions/types';

// -----------------------------------------------------------

const apiUrl = 'https://pixabay.com/api';
const apiKey = '8783992-06499d83b0b376f06affd8505';

function fetchImage(searchText, amount) {
  return axios({
    method: 'get',
    url: `${apiUrl}/?key=${apiKey}&q=${searchText}&$image_type=photo&per_page=${amount}&safesearch=true`,
  });
}

// -----------------------------------------------------------
// Worker Saga
function* submitFormRequest(action) {
  const searchText = action.payload.searchText;
  const amount = action.payload.amount;

  try {
    const res = yield call(fetchImage, searchText, amount);
    // dispatch a success action
    yield put({ type: SUBMIT_FORM_SUCCESS, payload: res.data.hits });
  } catch (error) {
    // dispatch a failure action
    // yield put({ type: FETCH_IMAGE_FAILURE, payload: 'Fetch image error' });

    let errorMsg = '';

    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMsg = error.response.data;
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      // errorMsg = 'No response was received from the server';
      errorMsg = 'No response received';
    } else {
      // Something happened in setting up the request that triggered an Error
      errorMsg = error.message;
    }

    yield put({ type: SUBMIT_FORM_FAILURE, payload: errorMsg });
  }
}

// -----------------------------------------------------------
// Watcher Saga
//
// watch FETCH_IMAGE_REQUEST action
function* watchSubmitFormRequest() {
  yield takeLatest(SUBMIT_FORM_REQUEST, submitFormRequest);
}

// -----------------------------------------------------------
// Root Saga
export default function* rootSaga() {
  yield all([watchSubmitFormRequest()]);
}
