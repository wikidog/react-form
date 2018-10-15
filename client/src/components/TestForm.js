import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Field, reduxForm } from 'redux-form';
// import { SubmissionError } from 'redux-form';
import isValidEmail from 'sane-email-validation';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import FormHelperText from '@material-ui/core/FormHelperText';

import UploaderRows, { uploader } from './uploader/UploaderRows';

import * as uploaderActions from './uploader/actions';
// we need these actions to open the Notifier component in this component
import * as notifierActions from './notifier/actions';

const styles = theme => ({
  uploader: {
    marginBottom: theme.spacing.unit * 2,
  },
});

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
  //
  renderTextField = ({ input, meta: { touched, error }, label, ...custom }) => (
    <FormControl fullWidth error={touched && error ? true : false}>
      <InputLabel htmlFor={input.name}>{label}</InputLabel>
      <Input id={input.name} {...input} {...custom} />
      <FormHelperText id={`${input.name}-text`}>
        {touched ? error : ''}
      </FormHelperText>
    </FormControl>
  );

  // =================================================================
  // form submission
  //
  submitForm = values => {
    // dispatch startProcess action
    this.props.startProcess();

    console.log('========= trigger upload... ==============');
    console.log('========= setParams ==============');
    uploader.methods.setParams(values);

    // trigger file upload
    //!! this function is asynchronous !!
    uploader.methods.uploadStoredFiles();
  };
  // =================================================================

  render() {
    // console.log('TestForm:', this.props);
    const {
      classes,
      handleSubmit,
      uploaderWorkInProgress, // my state
      uploaderSucceeded, // my state
      uploaderFailed, // my state
      endProcess, // my actin creator
      addSucceeded, // my actin creator
      addFailed, // my actin creator
      openNotifier, // my actin creator
    } = this.props;

    return (
      <form onSubmit={handleSubmit(this.submitForm)}>
        <div>
          <Field
            name="firstName"
            component={this.renderTextField}
            label="First Name *"
          />
        </div>
        {/* <div>
          <Field
            name="lastName"
            component={this.renderTextField}
            label="Last Name *"
          />
        </div>
        <div>
          <Field
            name="email"
            component={this.renderTextField}
            label="Email *"
          />
        </div> */}
        <div className={classes.uploader}>
          <UploaderRows
            endProcess={endProcess} // my action creator
            openNotifier={openNotifier} // my action creator
            addSucceeded={addSucceeded} // my action creator
            addFailed={addFailed} // my action creator
            uploaderSucceeded={uploaderSucceeded} // my state
            uploaderFailed={uploaderFailed} // my state
          />
        </div>
        <div>
          <Button
            // className={classes.button}
            variant="contained"
            color="primary"
            type="submit"
            disableFocusRipple={true}
            disableRipple={true}
            disabled={uploaderWorkInProgress}
          >
            Submit
          </Button>
        </div>
      </form>
    );
  }
}

const validate = values => {
  const errors = {};
  // console.log('********* form validation ****************');
  // console.log(values);

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

  // console.log(errors);
  return errors;
};

// const asyncValidate = values => {
//   console.log('in asyncValidate');
//   console.log('values:', values);
//   return new Promise(resolve => resolve(1)).then(() => {
//     const err = { uploader: 'too many files' };
//     throw err;
//   });
// };

function onSubmitFail(errors) {
  console.log('========= SubmissionError ==========');
  console.log(errors);
}

const mapStateToProps = ({ uploader }) => {
  return {
    uploaderWorkInProgress: uploader.workInProgress,
    uploaderSucceeded: uploader.succeeded,
    uploaderFailed: uploader.failed,
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    { ...uploaderActions, ...notifierActions }
  )(
    reduxForm({
      form: 'testForm',
      validate,
      onSubmitFail,
    })(TestForm)
  )
);
