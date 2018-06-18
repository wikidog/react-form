import React, { Component } from 'react';
import axios from 'axios';

import { Field, reduxForm } from 'redux-form';
import { SubmissionError } from 'redux-form';
import isValidEmail from 'sane-email-validation';

import { withTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
// import Fade from 'material-ui/transitions/Fade';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import UploadComponent, { uploader } from './Upload';

// import * as actions from '../actions';
// import showResults from './showResults';

const styles = {
  root: {
    position: 'relative',
    overflow: 'hidden',
    textAlign: 'center',
    // paddingTop: this.props.theme.spacing.unit * 20,
  },
  snackbar: {
    position: 'absolute',
  },
  fineUploader: {
    margin: '10px 0 30px 0',
    textAlign: 'left',
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
  meta: { touched, error },
  label,
  ...custom
}) => (
  <FormControl fullWidth error={touched && error ? true : false}>
    <InputLabel htmlFor={input.name}>{label}</InputLabel>
    <Input id={input.name} {...input} {...custom} />
    <FormHelperText id={`${input.name}-text`}>
      {touched ? error : ''}
    </FormHelperText>
  </FormControl>
  // <TextField
  //   label={label}
  //   error={touched && error ? true : false}
  //   required
  //   fullWidth
  //   helperText={touched ? error : 'aaaaa'}
  //   type="input"
  //   {...input}
  //   {...custom}
  // />
);

class TestForm extends Component {
  state = {
    open: false,
  };
  // onSubmit(values) {
  //   // console.log(values);
  //   showResults(values);
  // }

  handleClick = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  submitForm = values => {
    // console.log('uploader', uploader);
    // console.log('uploader-methods', uploader.methods);
    uploader.methods.log('adfadfadfadsfasdfasdfasdfadfa ==============');
    uploader.methods.uploadStoredFiles();

    return axios
      .post('http://localhost:5000/formsubmit', values)
      .then(response => {
        console.log('response from server:', response);

        window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`);
      })
      .catch(err => {
        console.log(err);
        this.setState({ open: true });
        throw new SubmissionError({
          email: 'Email does not exist',
          _error: 'Login failed!',
        });
      });
  };

  render() {
    console.log('TestForm:', this.props);
    const { classes } = this.props;
    const { open } = this.state;

    // If your onSubmit function returns a promise,
    // the submitting property will be set to true
    // until the promise has been resolved or rejected.
    const { error, handleSubmit, submitting } = this.props;

    return (
      <form className={classes.root} onSubmit={handleSubmit(this.submitForm)}>
        <div>
          <Field
            name="firstName"
            component={renderTextField}
            label="First Name *"
          />
        </div>
        <div>
          <Field
            name="lastName"
            component={renderTextField}
            label="Last Name *"
          />
        </div>
        <div>
          <Field name="email" component={renderTextField} label="Email *" />
        </div>
        {/* {error && <div>{error}</div>} */}
        <div className={classes.fineUploader}>
          <UploadComponent />
        </div>
        <div>
          <Button
            // className={classes.button}
            variant="raised"
            color="primary"
            type="submit"
            disabled={submitting}
          >
            Submit
          </Button>
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={open}
          // autoHideDuration={4000}
          onClose={this.handleClose}
          // transition={Fade}
          SnackbarContentProps={{
            'aria-describedby': 'snackbar-fab-message-id',
            className: classes.snackbarContent,
          }}
          message={<span id="snackbar-fab-message-id">{error}</span>}
          action={
            <Button color="inherit" size="small" onClick={this.handleClose}>
              Undo
            </Button>
          }
          className={classes.snackbar}
        />
      </form>
    );
  }
}

function validate(values) {
  const errors = {};

  if (!values.firstName) {
    errors.firstName = 'Enter your first name';
  }

  if (!values.lastName) {
    errors.lastName = 'Enter your last name';
  }

  if (!values.email) {
    errors.email = 'Enter your email';
  } else if (!isValidEmail(values.email)) {
    errors.email = 'Invalid Email';
  }

  // console.log('validate errors:', errors);

  return errors;
}

function onSubmitFail(errors) {
  console.log(errors);
}

export default withTheme()(
  withStyles(styles)(
    reduxForm({
      form: 'testForm',
      validate,
      onSubmitFail,
    })(TestForm)
  )
);
