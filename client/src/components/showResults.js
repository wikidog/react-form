import axios from 'axios';
import { SubmissionError } from 'redux-form';

// const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));
// export default (async function showResults(values) {
//   await sleep(2000); // simulate server latency
//   window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`);
// });

const ROOT_URL = 'http://localhost:5000';

function showResults(values) {
  return axios
    .post(`${ROOT_URL}/formsubmit`, values)
    .then(response => {
      console.log('response from server:', response);

      window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`);
    })
    .catch(err => {
      console.log(err);
      throw new SubmissionError({
        email: 'Email does not exist',
        _error: 'Login failed!',
      });
    });
}

export default showResults;
