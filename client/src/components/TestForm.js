import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Field, reduxForm } from 'redux-form';
import { SubmissionError } from 'redux-form';
import isValidEmail from 'sane-email-validation';

// import { withTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
// import Fade from 'material-ui/transitions/Fade';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import UploadComponent, { uploader } from './Upload';

import * as actions from '../actions';
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
);

// return axios
//   .post('http://localhost:5000/formsubmit', values)
//   .then(response => {
//     console.log('response from server:', response);

//     window.alert(`You submitted:\n\n${JSON.stringify(values, null, 2)}`);
//   })
//   .catch(err => {
//     console.log(err);
//     this.setState({ open: true });
//
// TODO: take a look at SubmissionError()
//     throw new SubmissionError({
//       email: 'Email does not exist',
//       _error: 'Login failed!',
//     });
//   });

class TestForm extends Component {
  submitForm = values => {
    // console.log('uploader', uploader);
    // console.log('uploader-methods', uploader.methods);
    uploader.methods.log('adfadfadfadsfasdfasdfasdfadfa ==============');

    // trigger file upload
    // uploader.methods.uploadStoredFiles();

    this.props.submitFormRequest(values);
  };

  render() {
    console.log('TestForm:', this.props);
    const {
      error,
      handleSubmit,
      closeSnackbar,
      snackbarOpen,
      uploadSubmitting,
      uploadResponse,
      uploadError,
      classes,
    } = this.props;

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
            disabled={uploadSubmitting}
          >
            Submit
          </Button>
        </div>
        <Snackbar
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          open={snackbarOpen}
          // autoHideDuration={4000}
          onClose={closeSnackbar}
          // transition={Fade}
          ContentProps={{
            'aria-describedby': 'snackbar-message-id',
            className: classes.snackbarContent,
          }}
          message={<span id="snackbar-message-id">{uploadError}</span>}
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

const mapStateToProps = ({ upload }) => {
  return {
    uploadSubmitting: upload.submitting,
    uploadError: upload.error,
    uploadResponse: upload.response,
    snackbarOpen: upload.snackbarOpen,
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    actions
  )(
    reduxForm({
      form: 'testForm',
      validate,
      onSubmitFail,
    })(TestForm)
  )
);
