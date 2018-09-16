import {
  START_PROCESS,
  END_PROCESS,
  ADD_SUCCEEDED,
  ADD_FAILED,
} from '../actions/types';

// this reducer manages this piece of state
const initialSate = {
  workInProgress: false,
  succeeded: [],
  failed: [],
};

export default (state = initialSate, action) => {
  switch (action.type) {
    case START_PROCESS:
      return {
        ...state,
        workInProgress: true,
        succeeded: [],
        failed: [],
      };

    case END_PROCESS:
      return {
        ...state,
        workInProgress: false,
      };

    case ADD_SUCCEEDED:
      return {
        ...state,
        succeeded: [...state.succeeded, action.payload],
      };

    case ADD_FAILED:
      return {
        ...state,
        failed: [...state.failed, action.payload],
      };

    default:
      return state;
  }
};
