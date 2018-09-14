import { START_PROCESS, END_PROCESS } from './types';

export const startProcess = () => ({
  type: START_PROCESS,
});

export const endProcess = () => ({
  type: END_PROCESS,
});
