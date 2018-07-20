import { CLOSE_SNACKBAR } from '../actions/types';

// this reducer manages this piece of state
const initialSate = {
  fetching: false,
  error: null,
  response: null,
  snackbarOpen: false,
};

export default (state = initialSate, action) => {
  switch (action.type) {
    // case FETCH_IMAGE_REQUEST:
    //   return { ...state, fetching: true, error: null, snackbarOpen: false };
    // case FETCH_IMAGE_SUCCESS:
    //   return {
    //     ...state,
    //     fetching: false,
    //     snackbarOpen: false,
    //     response: action.payload,
    //   };
    // case FETCH_IMAGE_FAILURE:
    //   return {
    //     ...state,
    //     fetching: false,
    //     response: null,
    //     snackbarOpen: true,
    //     error: action.payload,
    //   };
    case CLOSE_SNACKBAR:
      return { ...state, snackbarOpen: false };
    default:
      return state;
  }
};
