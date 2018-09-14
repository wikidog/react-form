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

const styles = {};

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
  renderUploaderField = fields => (
    <FormControl
      fullWidth
      error={fields.meta.touched && fields.meta.error ? true : false}
    >
      {/* <InputLabel htmlFor={input.name}>{label}</InputLabel> */}
      {/* <Input id={input.name} {...input} {...custom} /> */}
      <UploaderRows
        change={this.props.change}
        touch={this.props.touch}
        endProcess={this.props.endProcess} // * my action creator
        openNotifier={this.props.openNotifier} // * my action creator
        // blur={this.props.blur}
        {...fields}
      />
      <FormHelperText id={`${fields.input.name}-text`}>
        {fields.meta.touched && fields.meta.error ? fields.meta.error : ''}
      </FormHelperText>
    </FormControl>
  );

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
      // error,
      handleSubmit,
      uploaderWorkInProgress,
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
        <div>
          <Field name="uploader" component={this.renderUploaderField} />
        </div>
        <div>
          <Button
            // className={classes.button}
            variant="raised"
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

  if (!values.uploader || values.uploader === 0) {
    errors.uploader = 'Please select a file';
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
    uploadError: uploader.error,
    uploadResponse: uploader.response,
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
