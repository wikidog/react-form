import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { CSSTransitionGroup as ReactCssTransitionGroup } from 'react-transition-group'

import FineUploaderTraditional from 'fine-uploader-wrappers';
// import Gallery from 'react-fine-uploader';
import Dropzone from 'react-fine-uploader/dropzone';
import FileInput from 'react-fine-uploader/file-input';
import Filename from 'react-fine-uploader/filename';
import Filesize from 'react-fine-uploader/filesize';
import ProgressBar from 'react-fine-uploader/progress-bar';
import Status from 'react-fine-uploader/status';
import CancelButton from 'react-fine-uploader/cancel-button';
import DeleteButton from 'react-fine-uploader/delete-button';
import RetryButton from 'react-fine-uploader/retry-button';
import PauseResumeButton from 'react-fine-uploader/pause-resume-button';

import UploadIcon from 'react-fine-uploader/gallery/upload-icon';
import PauseIcon from 'react-fine-uploader/gallery/pause-icon';
import PlayIcon from 'react-fine-uploader/gallery/play-icon';
import UploadFailedIcon from 'react-fine-uploader/gallery/upload-failed-icon';
import UploadSuccessIcon from 'react-fine-uploader/gallery/upload-success-icon';
import XIcon from 'react-fine-uploader/gallery/x-icon';

import './gallery.css';

export const uploader = new FineUploaderTraditional({
  options: {
    debug: true,
    autoUpload: false,
    multiple: true,
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

class Gallery extends Component {
  //
  static propTypes = {
    className: PropTypes.string,
    // uploader: PropTypes.object.isRequired,
  };

  static defaultProps = {
    className: '',
    'cancelButton-children': <XIcon />,
    'deleteButton-children': <XIcon />,
    'dropzone-disabled': false,
    'dropzone-dropActiveClassName':
      'react-fine-uploader-gallery-dropzone-active',
    'dropzone-multiple': true,
    'fileInput-multiple': true,
    'pauseResumeButton-pauseChildren': <PauseIcon />,
    'pauseResumeButton-resumeChildren': <PlayIcon />,
    'retryButton-children': <PlayIcon />,
    'thumbnail-maxSize': 130,
  };

  state = {
    visibleFiles: [],
  };

  handleOnStatusChange = (id, oldStatus, newStatus) => {
    const visibleFiles = this.state.visibleFiles;

    if (newStatus === statusEnum.SUBMITTED) {
      visibleFiles.push({ id });
      this.setState({ visibleFiles });
    } else if (isFileGone(newStatus, statusEnum)) {
      this._removeVisibleFile(id);
    } else if (
      newStatus === statusEnum.UPLOAD_SUCCESSFUL ||
      newStatus === statusEnum.UPLOAD_FAILED
    ) {
      if (newStatus === statusEnum.UPLOAD_SUCCESSFUL) {
        const visibleFileIndex = this._findFileIndex(id);
        if (visibleFileIndex < 0) {
          visibleFiles.push({ id, fromServer: true });
        }
      }
      this._updateVisibleFileStatus(id, newStatus);
    }
  };

  componentDidMount() {
    uploader.on('statusChange', this.handleOnStatusChange);
  }

  componentWillUnmount() {
    uploader.off('statusChange', this.handleOnStatusChange);
  }

  render() {
    const chunkingEnabled =
      uploader.options.chunking && uploader.options.chunking.enabled;
    const deleteEnabled =
      uploader.options.deleteFile && uploader.options.deleteFile.enabled;
    // const deleteButtonProps =
    //   deleteEnabled && getComponentProps('deleteButton', this.props);
    // const pauseResumeButtonProps =
    //   chunkingEnabled && getComponentProps('pauseResumeButton', this.props);

    const fileInputDisabled = false;

    return (
      <MaybeDropzone
        content={this.props.children}
        hasVisibleFiles={this.state.visibleFiles.length > 0}
      >
        {!fileInputDisabled && (
          <FileInputComponent
            uploader={uploader}
            multiple={uploader.options.multiple}
          />
        )}

        <ProgressBar
          className="react-fine-uploader-gallery-total-progress-bar"
          uploader={uploader}
        />

        {/* <ReactCssTransitionGroup
          className="react-fine-uploader-gallery-files"
          component="ul"
          transitionEnter={!this.props.animationsDisabled}
          transitionEnterTimeout={500}
          transitionLeave={!this.props.animationsDisabled}
          transitionLeaveTimeout={300}
          transitionName="react-fine-uploader-gallery-files"
        > */}
        {this.state.visibleFiles.map(({ id, status, fromServer }) => (
          <li key={id} className="react-fine-uploader-gallery-file">
            <ProgressBar
              className="react-fine-uploader-gallery-progress-bar"
              id={id}
              uploader={uploader}
            />

            {status === 'upload successful' && (
              <span>
                <UploadSuccessIcon className="react-fine-uploader-gallery-upload-success-icon" />
                <div className="react-fine-uploader-gallery-thumbnail-icon-backdrop" />
              </span>
            )}

            {status === 'upload failed' && (
              <span>
                <UploadFailedIcon className="react-fine-uploader-gallery-upload-failed-icon" />
                <div className="react-fine-uploader-gallery-thumbnail-icon-backdrop" />
              </span>
            )}

            <div className="react-fine-uploader-gallery-file-footer">
              <Filename
                className="react-fine-uploader-gallery-filename"
                id={id}
                uploader={uploader}
              />
              <Status
                className="react-fine-uploader-gallery-status"
                id={id}
                uploader={uploader}
              />
              <Filesize
                className="react-fine-uploader-gallery-filesize"
                id={id}
                uploader={uploader}
              />
            </div>

            <CancelButton
              className="react-fine-uploader-gallery-cancel-button"
              id={id}
              uploader={uploader}
            />

            <RetryButton
              className="react-fine-uploader-gallery-retry-button"
              id={id}
              uploader={uploader}
            />

            {deleteEnabled && (
              <DeleteButton
                className="react-fine-uploader-gallery-delete-button"
                id={id}
                uploader={uploader}
              />
            )}

            {chunkingEnabled && (
              <PauseResumeButton
                className="react-fine-uploader-gallery-pause-resume-button"
                id={id}
                uploader={uploader}
              />
            )}
          </li>
        ))}
        {/* </ReactCssTransitionGroup> */}
      </MaybeDropzone>
    );
  }

  _removeVisibleFile(id) {
    const visibleFileIndex = this._findFileIndex(id);

    if (visibleFileIndex >= 0) {
      const visibleFiles = this.state.visibleFiles;

      visibleFiles.splice(visibleFileIndex, 1);
      this.setState({ visibleFiles });
    }
  }

  _updateVisibleFileStatus(id, status) {
    this.state.visibleFiles.some(file => {
      if (file.id === id) {
        file.status = status;
        this.setState({ visibleFiles: this.state.visibleFiles });
        return true;
      }
    });
  }

  _findFileIndex(id) {
    let visibleFileIndex = -1;

    this.state.visibleFiles.some((file, index) => {
      if (file.id === id) {
        visibleFileIndex = index;
        return true;
      }
    });

    return visibleFileIndex;
  }
}

// ========================================================================
const MaybeDropzone = ({ children, content, hasVisibleFiles, ...props }) => {
  const { disabled, ...dropzoneProps } = props;

  let dropzoneDisabled = disabled;
  if (!dropzoneDisabled) {
    dropzoneDisabled = !uploader.qq.supportedFeatures.fileDrop;
  }

  if (hasVisibleFiles) {
    content = <span />;
  } else {
    content =
      content ||
      getDefaultMaybeDropzoneContent({ content, disabled: dropzoneDisabled });
  }

  if (dropzoneDisabled) {
    return (
      <div className="react-fine-uploader-gallery-nodrop-container">
        {content}
        {children}
      </div>
    );
  }

  return (
    <Dropzone
      className="react-fine-uploader-gallery-dropzone"
      uploader={uploader}
      {...dropzoneProps}
    >
      {content}
      {children}
    </Dropzone>
  );
};

// ========================================================================
const FileInputComponent = ({ uploader, ...props }) => {
  const { children, multiple, ...fileInputProps } = props;
  const content = children || (
    <span>
      <UploadIcon className="react-fine-uploader-gallery-file-input-upload-icon" />
      {multiple ? 'Select Files' : 'Select a File'}
    </span>
  );

  return (
    <FileInput
      className="react-fine-uploader-gallery-file-input-container"
      uploader={uploader}
      multiple={multiple}
      {...fileInputProps}
    >
      <span className="react-fine-uploader-gallery-file-input-content">
        {content}
      </span>
    </FileInput>
  );
};

// const getComponentProps = (componentName, allProps) => {
//   const componentProps = {};

//   Object.keys(allProps).forEach(propName => {
//     if (propName.indexOf(componentName + '-') === 0) {
//       const componentPropName = propName.substr(componentName.length + 1);
//       componentProps[componentPropName] = allProps[propName];
//     }
//   });

//   return componentProps;
// };

const getDefaultMaybeDropzoneContent = ({ content, disabled }) => {
  const className = disabled
    ? 'react-fine-uploader-gallery-nodrop-content'
    : 'react-fine-uploader-gallery-dropzone-content';

  if (disabled && !content) {
    return <span className={className}>Upload files</span>;
  } else if (content) {
    return <span className={className}>{content}</span>;
  } else if (!disabled) {
    return (
      <span className={className}>
        <UploadIcon className="react-fine-uploader-gallery-dropzone-upload-icon" />
        Drop files here
      </span>
    );
  }
};

const isFileGone = (statusToCheck, statusEnum) => {
  return [statusEnum.CANCELED, statusEnum.DELETED].indexOf(statusToCheck) >= 0;
};

export default Gallery;
