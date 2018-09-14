import { START_PROCESS, END_PROCESS } from '../actions/types';

// this reducer manages this piece of state
const initialSate = {
  workInProgress: false,
  fileUploading: false,
  error: null,
  response: null,
};

export default (state = initialSate, action) => {
  switch (action.type) {
    case START_PROCESS:
      return {
        ...state,
        workInProgress: true,
        error: null,
      };

    case END_PROCESS:
      return {
        ...state,
        workInProgress: false,
        // error: null,
        // snackbarOpen: false,
      };

    // case SUBMIT_FORM_REQUEST:
    //   return {
    //     ...state,
    //     fileUploading: true,
    //     error: null,
    //     snackbarOpen: false,
    //   };

    // case SUBMIT_FORM_SUCCESS:
    //   return {
    //     ...state,
    //     fileUploading: false,
    //     snackbarOpen: false,
    //     response: action.payload,
    //   };

    // case SUBMIT_FORM_FAILURE:
    //   return {
    //     ...state,
    //     fileUploading: false,
    //     response: null,
    //     snackbarOpen: true,
    //     error: action.payload,
    //   };

    default:
      return state;
  }
};
