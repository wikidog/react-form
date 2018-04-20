import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import isValidEmail from 'sane-email-validation';

import Button from 'material-ui/Button';

// import * as actions from '../actions';
import showResults from './showResults';

class TestForm extends Component {
  // onSubmit(values) {
  //   // console.log(values);
  //   showResults(values);
  // }

  render() {
    console.log(this.props);

    // If your onSubmit function returns a promise,
    // the submitting property will be set to true
    // until the promise has been resolved or rejected.
    const { handleSubmit, submitting } = this.props;

    return (
      <form onSubmit={handleSubmit(showResults)}>
        <div>
          <label htmlFor="firstName">First Name</label>
          <Field name="firstName" component="input" type="text" />
        </div>
        <div>
          <label htmlFor="lastName">Last Name</label>
          <Field name="lastName" component="input" type="text" />
        </div>
        <div>
          <label htmlFor="email">Email</label>
          <Field name="email" component="input" type="email" />
        </div>
        <Button
          variant="raised"
          color="primary"
          type="submit"
          disabled={submitting}
        >
          Submit
        </Button>
      </form>
    );
  }
}

function validate(values) {
  const errors = {};

  if (!values.firstName) {
    errors.firstName = 'Required';
  }

  if (!values.lastName) {
    errors.lastName = 'Required';
  }

  if (!values.email) {
    errors.email = 'Required';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid Email';
  }

  // console.log('validate errors:', errors);

  return errors;
}

export default reduxForm({
  form: 'testForm',
  validate,
})(TestForm);
