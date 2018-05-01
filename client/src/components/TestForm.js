import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import isValidEmail from 'sane-email-validation';

import { withTheme } from 'material-ui/styles';
import { withStyles } from 'material-ui/styles';

import { Button, TextField } from 'material-ui';

// import * as actions from '../actions';
import showResults from './showResults';

const styles = {
  root: {
    textAlign: 'center',
    // paddingTop: this.props.theme.spacing.unit * 20,
  },
  button: {
    background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
    borderRadius: 3,
    border: 0,
    color: 'white',
    height: 48,
    padding: '0 30px',
    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .30)',
  },
};

const renderTextField = ({
  input,
  label,
  meta: { touched, error },
  ...custom
}) => (
  <TextField
    // hintText={label}
    label={label}
    error={touched && error}
    required
    fullWidth
    helperText={'aaaaaaaa'}
    type="input"
    {...input}
    {...custom}
  />
);

// const renderTextField = props => {
//   console.log('renderTextField', props);
//   return <input />;
// };

class TestForm extends Component {
  // onSubmit(values) {
  //   // console.log(values);
  //   showResults(values);
  // }

  render() {
    console.log('TestForm:', this.props);
    const { theme, classes } = this.props;

    // If your onSubmit function returns a promise,
    // the submitting property will be set to true
    // until the promise has been resolved or rejected.
    const { handleSubmit, pristine, reset, submitting } = this.props;

    return (
      <form className={classes.root} onSubmit={handleSubmit(showResults)}>
        <div>
          <Field
            name="firstName"
            component={renderTextField}
            label="First Name"
          />
        </div>
        <div>
          <Field
            name="lastName"
            component={renderTextField}
            label="Last Name"
          />
        </div>
        <div>
          <Field name="email" component={renderTextField} label="Email" />
        </div>
        <Button
          className={classes.button}
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

export default withTheme()(
  withStyles(styles)(
    reduxForm({
      form: 'testForm',
      validate,
    })(TestForm)
  )
);
