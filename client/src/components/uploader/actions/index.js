import { START_PROCESS, END_PROCESS, ADD_SUCCEEDED, ADD_FAILED } from './types';

export const startProcess = () => ({
  type: START_PROCESS,
});

export const endProcess = () => ({
  type: END_PROCESS,
});

export const addSucceeded = id => ({
  type: ADD_SUCCEEDED,
  payload: id,
});

export const addFailed = id => ({
  type: ADD_FAILED,
  payload: id,
});
