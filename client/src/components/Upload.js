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
        'uploader',
        uploader.methods.getUploads({ status: 'submitted' })
      );
      this.props.touch(this.props.input.name);
    }
  };

  componentDidMount() {
    uploader.on('validate', () =>
      console.log('aaaaaaaaa == onValidate ======')
    );
    uploader.on('validateBatch', () =>
      console.log('aaaaaaaaa == onValidateBatch ======')
    );
    uploader.on('error', (id, name, errorReason) => {
      console.log('bbbbbbbbb == onError ======');
      // console.log('id', id);
      // console.log('name', name);
      console.log('errorReason', errorReason);
    });

    uploader.on('statusChange', this.handleOnStatusChange);

    uploader.on('cancel', (id, name) => {
      console.log('=============== onCancel ===================');
      console.log('id:', id);
      console.log('name:', name);
    });

    uploader.on('submitted', (id, name) => {
      console.log('=============== onSubmitted ===================');
      console.log('id:', id);
      console.log('name:', name);
      this.props.change(
        'uploader',
        uploader.methods.getUploads({ status: 'submitted' })
      );
    });
  }

  componentWillUnmount() {
    uploader.off('statusChange', this.handleOnStatusChange);
  }
  // ================================================================

  handleOnClick = () => {
    console.log('dropzone clicked');
    console.log('this.props', this.props);

    const uploader = this.props.uploader;

    const uploads = uploader.methods.getUploads({ status: 'submitted' });
    this.props.change(this.props.input.name, uploads);
    // this.props.touch(this.props.input.name);
  };

  handleOnBlur = () => {
    console.log('on blur');
    this.props.touch(this.props.input.name);
  };

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
