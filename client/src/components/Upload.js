import React, { Component } from 'react';

import FineUploaderTraditional from 'fine-uploader-wrappers';
// import Gallery from 'react-fine-uploader';
import Dropzone from 'react-fine-uploader/dropzone';
import FileInput from 'react-fine-uploader/file-input';
import Filename from 'react-fine-uploader/filename';
import Filesize from 'react-fine-uploader/filesize';
import ProgressBar from 'react-fine-uploader/progress-bar';
import Status from 'react-fine-uploader/status';
import XIcon from 'react-fine-uploader/gallery/x-icon';

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

const statusEnum = uploader.qq.status;

class UploadComponent extends Component {
  //
  state = {
    visibleFiles: [],
  };

  //
  // fine-uploader -------------------------------------------------
  //
  handleOnStatusChange = (id, oldStatus, newStatus) => {
    console.log('=========== onStatusChange =============');
    console.log('id:', id);
    console.log('oldStatus:', oldStatus);
    console.log('newStatus:', newStatus);

    if (newStatus === statusEnum.CANCELED) {
      this.props.change(
        this.props.input.name,
        uploader.methods.getUploads({ status: statusEnum.SUBMITTED })
        // uploader.methods.getUploads({ status: 'submitted' })
        // uploader.methods.getUploads()
      );
      // this.props.touch(this.props.input.name);
    }

    const visibleFiles = this.state.visibleFiles;

    if (newStatus === statusEnum.SUBMITTED) {
      visibleFiles.push({ id });
      this.setState({ visibleFiles });
    } else if (isFileGone(status, statusEnum)) {
      this._removeVisibleFile(id);
    } else if (
      status === statusEnum.UPLOAD_SUCCESSFUL ||
      status === statusEnum.UPLOAD_FAILED
    ) {
      if (status === statusEnum.UPLOAD_SUCCESSFUL) {
        const visibleFileIndex = this._findFileIndex(id);
        if (visibleFileIndex < 0) {
          visibleFiles.push({ id, fromServer: true });
        }
      }
      this._updateVisibleFileStatus(id, status);
    }
  };

  handleOnValidate = obj => {
    console.log('=========== onValidate =============');
    console.log('file obj', obj);
  };

  handleOnValidateBatch = files => {
    console.log('=========== onValidateBatch =============');
    console.log('options:', uploader.options);
    console.log('files:', files);
    // uploader.methods.clearStoredFiles();
    // uploader.methods.cancelAll();
    this.props.touch(this.props.input.name);
  };

  handleOnSubmitted = (id, name) => {
    console.log('=============== onSubmitted ===================');
    console.log('id:', id);
    console.log('name:', name);

    this.setState({ submittedFiles: [...this.state.submittedFiles, id] });

    this.props.change(
      this.props.input.name,
      // uploader.methods.getUploads({ status: 'submitted' })
      uploader.methods.getUploads({ status: statusEnum.SUBMITTED })
      // uploader.methods.getUploads()
    );
  };

  handleOnError = (id, name, errorReason) => {
    console.log('============== onError ==================');
    // console.log('id', id);
    // console.log('name', name);
    console.log('errorReason:', errorReason);

    // this.props.input.onBlur('aaaaaaaaaa');
    alert(errorReason);
    // alert(
    //   uploader.qq.format(
    //     'Error on file number {} - {}.  Reason: {}',
    //     id,
    //     name,
    //     errorReason
    //   )
    // );

    // this.props.change(
    //   this.props.input.name,
    //   { errMsg: errorReason, storedFiles: null }
    // );
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
    // return (
    //   <Gallery
    //     fileInput-children={fileInputChildren}
    //     // fileInput-onBlur={this.handleOnBlur}
    //     dropzone-content={dropzoneContent}
    //     uploader={uploader}
    //   />
    // );
    return (
      <div>
        <FileInput multiple uploader={uploader}>
          <span className="icon icon-upload">Choose Files</span>
        </FileInput>
        <Dropzone
          style={{ border: '1px dotted', height: 200, width: 200 }}
          uploader={uploader}
        >
          <span>Drop Files Here</span>
        </Dropzone>
        {this.state.submittedFiles.map(id => (
          <div key={id}>
            <Filename key={`filename-${id}`} id={id} uploader={uploader} />
            <Filesize key={`filesize-${id}`} id={id} uploader={uploader} />
          </div>
        ))}
      </div>
    );
  }
}

export default UploadComponent;
