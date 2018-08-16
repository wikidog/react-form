import React, { Component } from 'react';
import PropTypes from 'prop-types';
// import { CSSTransitionGroup as ReactCssTransitionGroup } from 'react-transition-group'

import FineUploaderTraditional from 'fine-uploader-wrappers';
// import Gallery from 'react-fine-uploader';
import Dropzone from 'react-fine-uploader/dropzone';
// import FileInput from 'react-fine-uploader/file-input';
import Filename from 'react-fine-uploader/filename';
import Filesize from 'react-fine-uploader/filesize';
// import ProgressBar from 'react-fine-uploader/progress-bar';
import Status from 'react-fine-uploader/status';
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

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import Grid from '@material-ui/core/Grid';

import FileInput from './FileInput';
import CancelButton from './CancelButton';
import ProgressBar from './ProgressBar';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  card: {
    minWidth: 275,
    flexGrow: 1,
  },
  fileInput: {
    // marginBottom: 20,
  },
  icon: {
    // margin: theme.spacing.unit,
    fontSize: 24,
  },
  title: {
    // marginBottom: 16,
    fontSize: 16,
  },
});

export const uploader = new FineUploaderTraditional({
  options: {
    debug: true,
    autoUpload: false,
    multiple: true,
    validation: {
      itemLimit: 5,
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

class UploaderRows extends Component {
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

  // this function is for Redux-Form <Field /> component
  handleOnFieldValueChange = value => {
    // this will dispatch a CHANGE action on Redux-Form
    this.props.change(
      this.props.input.name,
      // uploader.methods.getUploads({ status: 'submitted' })
      // uploader.methods.getUploads({ status: statusEnum.SUBMITTED })
      // uploader.methods.getUploads()
      value
    );
  };

  handleOnStatusChange = (id, oldStatus, newStatus) => {
    console.log('=========== onStatusChange =============');
    console.log('id:', id);
    console.log('oldStatus:', oldStatus);
    console.log('newStatus:', newStatus);

    const visibleFiles = this.state.visibleFiles;

    if (newStatus === statusEnum.SUBMITTED) {
      visibleFiles.push({ id });
      this.setState({ visibleFiles });
      this.handleOnFieldValueChange(visibleFiles);
    } else if (isFileGone(newStatus, statusEnum)) {
      this._removeVisibleFile(id);
      this.handleOnFieldValueChange(visibleFiles);
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

  handleOnValidateBatch = files => {
    console.log('=========== onValidateBatch =============');
    console.log('options:', uploader.options);
    console.log('files:', files);
    // uploader.methods.clearStoredFiles();
    // uploader.methods.cancelAll();
    // for Redux-Form
    this.props.touch(this.props.input.name);
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
  };

  componentDidMount() {
    uploader.on('statusChange', this.handleOnStatusChange);
    uploader.on('validateBatch', this.handleOnValidateBatch);
    uploader.on('error', this.handleOnError);
  }

  componentWillUnmount() {
    uploader.off('statusChange', this.handleOnStatusChange);
    uploader.off('validateBatch', this.handleOnValidateBatch);
    uploader.off('error', this.handleOnError);
  }

  render() {
    const { classes } = this.props;

    const chunkingEnabled =
      uploader.options.chunking && uploader.options.chunking.enabled;
    const deleteEnabled =
      uploader.options.deleteFile && uploader.options.deleteFile.enabled;
    // const deleteButtonProps =
    //   deleteEnabled && getComponentProps('deleteButton', this.props);
    // const pauseResumeButtonProps =
    //   chunkingEnabled && getComponentProps('pauseResumeButton', this.props);

    const fileInputDisabled = false;
    const dropZoneDisabled = false;

    return (
      <MaybeDropzone
        content={this.props.children}
        hasVisibleFiles={this.state.visibleFiles.length > 0}
        disabled={dropZoneDisabled}
        dropActiveClassName={'react-fine-uploader-gallery-dropzone-active'}
        multiple={true}
      >
        <FileInput
          className={classes.fileInput}
          uploader={uploader}
          multiple={uploader.options.multiple}
          disabled={fileInputDisabled}
        />

        {/* <ProgressBar
            className="react-fine-uploader-gallery-total-progress-bar"
            uploader={uploader}
          /> */}

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
          <Paper key={id} className={classes.root}>
            <Grid container spacing={16} alignItems={'center'}>
              <Grid item xs={12} sm>
                <Typography variant="title" className={classes.title}>
                  <Filename id={id} uploader={uploader} />
                </Typography>
              </Grid>
              <Grid item>
                <Typography variant="subheading" className={classes.subheading}>
                  <Filesize id={id} uploader={uploader} />
                </Typography>
              </Grid>
              <Grid item>
                <CancelButton id={id} uploader={uploader} />
              </Grid>
            </Grid>
            <Grid container spacing={16} alignItems={'center'}>
              <Grid item>
                <Typography variant="subheading" className={classes.subheading}>
                  <Status
                    // className="react-fine-uploader-gallery-status"
                    id={id}
                    uploader={uploader}
                  />
                </Typography>
              </Grid>
              <Grid item xs={12} sm>
                <Typography variant="title" className={classes.title}>
                  <ProgressBar
                    // className="react-fine-uploader-gallery-progress-bar"
                    id={id}
                    uploader={uploader}
                    hideBeforeStart={false}
                  />
                </Typography>
              </Grid>
            </Grid>

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
              <Status
                className="react-fine-uploader-gallery-status"
                id={id}
                uploader={uploader}
              />
            </div>

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
              >
                <XIcon />
              </DeleteButton>
            )}

            {chunkingEnabled && (
              <PauseResumeButton
                className="react-fine-uploader-gallery-pause-resume-button"
                id={id}
                uploader={uploader}
              />
            )}
          </Paper>
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
        Drop files here AAAA
      </span>
    );
  }
};

const isFileGone = (statusToCheck, statusEnum) => {
  return [statusEnum.CANCELED, statusEnum.DELETED].indexOf(statusToCheck) >= 0;
};

export default withStyles(styles)(UploaderRows);
