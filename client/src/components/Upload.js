import React, { Component } from 'react';

import FineUploaderTraditional from 'fine-uploader-wrappers';
import Gallery from 'react-fine-uploader';

// ...or load this specific CSS file using a <link> tag in your document
import 'react-fine-uploader/gallery/gallery.css';
// import CancelButton from 'react-fine-uploader/cancel-button';

export const uploader = new FineUploaderTraditional({
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
  },
});

class UploadComponent extends Component {
  //
  // fine-uploader -------------------------------------------------
  //
  handleOnStatusChange = (id, oldStatus, newStatus) => {
    console.log('id:', id);
    console.log('oldStatus:', oldStatus);
    console.log('newStatus:', newStatus);
    if (newStatus === 'canceled') {
      this.props.change(
        this.props.input.name,
        // uploader.methods.getUploads({ status: 'submitted' })
        { errMsg: '', storedFiles: uploader.methods.getUploads() }
      );
      this.props.touch(this.props.input.name);
    }
  };

  handleOnValidate = obj => {
    console.log('=========== onValidate =============');
    console.log('file obj', obj);
  };

  handleOnValidateBatch = files => {
    uploader.methods.clearStoredFiles();
    // uploader.methods.cancelAll();
    console.log('=========== onValidateBatch =============');
    console.log('options:', uploader.options);
    console.log('files:', files);
  };

  handleOnSubmitted = (id, name) => {
    console.log('=============== onSubmitted ===================');
    console.log('id:', id);
    console.log('name:', name);
    this.props.change(
      this.props.input.name,
      // uploader.methods.getUploads({ status: 'submitted' })
      // uploader.methods.getUploads()
      { errMsg: '', storedFiles: uploader.methods.getUploads() }
    );
  };

  handleOnError = (id, name, errorReason) => {
    console.log('bbbbbbbbb == onError ======');
    // console.log('id', id);
    // console.log('name', name);
    console.log('errorReason', errorReason);

    this.props.change(
      this.props.input.name,
      // uploader.methods.getUploads({ status: 'submitted' })
      // uploader.methods.getUploads()
      { errMsg: errorReason, storedFiles: uploader.methods.getUploads() }
    );

    this.props.touch(this.props.input.name);
  };

  componentDidMount() {
    uploader.on('validate', this.handleOnValidate);
    uploader.on('validateBatch', this.handleOnValidateBatch);
    uploader.on('error', this.handleOnError);
    uploader.on('statusChange', this.handleOnStatusChange);
    uploader.on('submitted', this.handleOnSubmitted);

    uploader.on('cancel', (id, name) => {
      console.log('=============== onCancel ===================');
      console.log('id:', id);
      console.log('name:', name);
    });
  }

  componentWillUnmount() {
    uploader.off('statusChange', this.handleOnStatusChange);
  }
  // ================================================================

  // handleOnClick = () => {
  //   console.log('dropzone clicked');
  //   console.log('this.props', this.props);

  //   const uploader = this.props.uploader;

  //   const uploads = uploader.methods.getUploads();
  //   // const uploads = uploader.methods.getUploads({ status: 'submitted' });
  //   this.props.change(this.props.input.name, uploads);
  //   // this.props.touch(this.props.input.name);
  // };

  // handleOnBlur = () => {
  //   console.log('on blur');
  //   this.props.touch(this.props.input.name);
  // };

  render() {
    // TODO: console.log()
    console.log('in uploader', this.props);

    // const {
    //   uploader,
    //   input: { value, onChange, onBlur },
    // } = this.props;

    const fileInputChildren = <span>Select a file</span>;

    const dropzoneContent = (
      <span className="react-fine-uploader-gallery-dropzone-content">
        Drop a file here
      </span>
    );

    // <div onClick={this.handleOnClick}></div>
    return (
      <Gallery
        fileInput-children={fileInputChildren}
        // fileInput-onBlur={this.handleOnBlur}
        dropzone-content={dropzoneContent}
        uploader={uploader}
      />
    );
  }
}

export default UploadComponent;
