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

import FineUploaderTraditional from 'fine-uploader-wrappers';

import UploadComponent from './Upload';

import * as myActions from '../actions';
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

// initialize
// const uploader = new FineUploaderTraditional({
//   options: {
//     debug: true,
//     autoUpload: false,
//     multiple: false,
//     validation: {
//       itemLimit: 1,
//     },
//     messages: {
//       tooManyItemsError: 'one file a time',
//     },
//     chunking: {
//       enabled: false,
//     },
//     deleteFile: {
//       enabled: false,
//       endpoint: '/uploads',
//     },
//     request: {
//       endpoint: '/uploads',
//     },
//     retry: {
//       enableAuto: false,
//     },
//     callbacks: {
//       onValidate: () => console.log('aaaaaaaaa == onValidate ======'),
//       onValidateBatch: () => console.log('aaaaaaaaa == onValidateBatch ======'),
//       onError: (id, name, errorReason) => {
//         console.log('bbbbbbbbb == onError ======');
//         // console.log('id', id);
//         // console.log('name', name);
//         console.log('errorReason', errorReason);
//       },
//       onStatusChange: (id, oldStatus, newStatus) => {
//         console.log('id:', id);
//         console.log('oldStatus:', oldStatus);
//         console.log('newStatus:', newStatus);
//       },
//       onSubmit: (id, name) => {
//         console.log('=============== onSubmit ===================');
//         console.log('id:', id);
//         console.log('name:', name);
//       },
//     },
//   },
// });

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
  uploader = new FineUploaderTraditional({
    options: {
      debug: true,
      autoUpload: false,
      multiple: false,
      validation: {
        itemLimit: 1,
      },
      messages: {
        tooManyItemsError: 'one file a time',
      },
      chunking: {
        enabled: false,
      },
      deleteFile: {
        enabled: false,
        endpoint: '/uploads',
      },
      request: {
        endpoint: '/uploads',
      },
      retry: {
        enableAuto: false,
      },
      callbacks: {
        onValidate: () => console.log('aaaaaaaaa == onValidate ======'),
        onValidateBatch: () =>
          console.log('aaaaaaaaa == onValidateBatch ======'),
        onError: (id, name, errorReason) => {
          console.log('bbbbbbbbb == onError ======');
          // console.log('id', id);
          // console.log('name', name);
          console.log('errorReason', errorReason);
        },
        onStatusChange: (id, oldStatus, newStatus) => {
          console.log('id:', id);
          console.log('oldStatus:', oldStatus);
          console.log('newStatus:', newStatus);
        },
        onSubmit: (id, name) => {
          console.log('=============== onSubmit ===================');
          console.log('id:', id);
          console.log('name:', name);
          this.props.change('uploader', this.uploader.methods.getUploads());
        },
      },
    },
  });

  renderUploaderField = fields => (
    <FormControl
      fullWidth
      error={fields.meta.touched && fields.meta.error ? true : false}
    >
      {/* <InputLabel htmlFor={input.name}>{label}</InputLabel> */}
      {/* <Input id={input.name} {...input} {...custom} /> */}
      <UploadComponent uploader={this.uploader} {...fields} />
      <FormHelperText id={`${fields.input.name}-text`}>
        {fields.meta.touched ? fields.meta.error : ''}
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

  submitForm = values => {
    // console.log('uploader', uploader);
    // console.log('uploader-methods', uploader.methods);
    this.uploader.methods.log('adfadfadfadsfasdfasdfasdfadfa ==============');

    // trigger file upload
    this.uploader.methods.uploadStoredFiles();

    this.props.submitFormRequest(values);
  };

  render() {
    // TODO: console.log()
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
            component={this.renderTextField}
            label="First Name *"
          />
        </div>
        <div>
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
        </div>
        {/* <div className={classes.fineUploader}>
          <UploadComponent />
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
  console.log('form values:', values);

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

  if (!values.uploader) {
    errors.uploader = 'Please select a file';
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
    myActions
  )(
    reduxForm({
      form: 'testForm',
      validate,
      onSubmitFail,
    })(TestForm)
  )
);
