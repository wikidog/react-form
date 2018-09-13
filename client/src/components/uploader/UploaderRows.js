import React, { Component } from 'react';
import classNames from 'classnames';
// import PropTypes from 'prop-types';
// import { CSSTransitionGroup as ReactCssTransitionGroup } from 'react-transition-group'

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';
import DoneIcon from '@material-ui/icons/Done';
import ErrorIcon from '@material-ui/icons/Error';
import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import FineUploaderTraditional from 'fine-uploader-wrappers';
// import Gallery from 'react-fine-uploader';
// import Dropzone from 'react-fine-uploader/dropzone';
import Dropzone from './Dropzone';
// import FileInput from 'react-fine-uploader/file-input';
import Filename from 'react-fine-uploader/filename';
import Filesize from 'react-fine-uploader/filesize';
// import ProgressBar from 'react-fine-uploader/progress-bar';

// import Status from 'react-fine-uploader/status';
import Status from './Status';

// import DeleteButton from 'react-fine-uploader/delete-button';
// import RetryButton from 'react-fine-uploader/retry-button';
// import PauseResumeButton from 'react-fine-uploader/pause-resume-button';

// import UploadIcon from 'react-fine-uploader/gallery/upload-icon';
// import PauseIcon from 'react-fine-uploader/gallery/pause-icon';
// import PlayIcon from 'react-fine-uploader/gallery/play-icon';
// import UploadFailedIcon from 'react-fine-uploader/gallery/upload-failed-icon';
// import UploadSuccessIcon from 'react-fine-uploader/gallery/upload-success-icon';
// import XIcon from 'react-fine-uploader/gallery/x-icon';

// import './gallery.css';

import FileInput from './FileInput';
import CancelButton from './CancelButton';
import ProgressBar from './ProgressBar';

const styles = theme => ({
  // ==== dropzone styles ===============
  dropzone: {
    borderRadius: 4,
    // maxHeight: 490,
    // minHeight: 410,
    height: 400,
    overflowY: 'auto',
    padding: theme.spacing.unit * 2,
    position: 'relative',
  },
  dropzoneEnabled: {
    border: '2px dashed #00ABC7',
  },
  dropzoneActive: {
    // background: '#FDFDFD',
    background: '#FEFEFE',
    border: '2px solid #00ABC7',
  },
  dropzoneDisabled: {
    border: '2px solid #00ABC7',
  },
  dropzoneBackgroundContent: {
    position: 'absolute',
    top: '40%',
    left: '0',
    opacity: '0.25',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dropzoneBackgroundIcon: {
    marginRight: theme.spacing.unit,
    fontSize: 32,
    // color: theme.status.succeed,
  },
  // ==== file select button =============
  fileInput: {
    marginBottom: theme.spacing.unit * 2,
  },
  // ==== file list item =================
  uploadItem: {
    padding: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
  },
  // ==== file information ===============
  filename: {
    fontSize: 16,
  },
  filesize: {
    fontSize: 14,
  },
  fileStatus: {
    display: 'flex',
    width: theme.spacing.unit * 5,
    height: theme.spacing.unit * 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fileStatusIcon: {
    margin: 0,
    // fontSize: 24,
    // color: theme.status.succeed,
  },
});

// this is to overwrite styles of <Grid item />
const inlineStyleGridItem = {
  paddingTop: 0,
  paddingBottom: 0,
};

// ==================================================================
// Uploader
export const uploader = new FineUploaderTraditional({
  options: {
    debug: true,
    autoUpload: false,
    multiple: true,
    validation: {
      itemLimit: 15,
    },
    messages: {
      tooManyItemsError: 'one file a time',
    },
    chunking: {
      enabled: true,
      partSize: 10000000,
      concurrent: {
        enabled: true,
      },
      success: {
        endpoint: '/chunksdone',
      },
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
  state = {
    visibleFiles: [],
  };

  // this function is for Redux-Form <Field /> component
  handleOnFieldValueChange = value => {
    // this will dispatch a CHANGE action on Redux-Form
    this.props.change(
      this.props.input.name,
      // uploader.methods.getUploads({ status: 'submitted' })
      uploader.methods.getUploads({ status: statusEnum.SUBMITTED }).length
      // uploader.methods.getUploads()
      // value
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
      // * we only display these statuses
      newStatus === statusEnum.UPLOAD_SUCCESSFUL ||
      newStatus === statusEnum.UPLOAD_FAILED ||
      newStatus === statusEnum.UPLOAD_FINALIZING ||
      newStatus === statusEnum.UPLOADING
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

    this.props.endProcess();
    // alert(
    //   uploader.qq.format(
    //     'Error on file number {} - {}.  Reason: {}',
    //     id,
    //     name,
    //     errorReason
    //   )
    // );
  };

  handleOnComplete = (id, name, responseJSON, xhr) => {
    console.log('=========== onComplete =============');
    console.log('id:', id);
    console.log('name:', name);
  };

  handleOnAllComplete = (succeeded, failed) => {
    console.log('=========== onAllComplete =============');
    console.log('dispatch action');
    this.props.endProcess();
  };

  componentDidMount() {
    uploader.on('statusChange', this.handleOnStatusChange);
    uploader.on('validateBatch', this.handleOnValidateBatch);
    uploader.on('error', this.handleOnError);
    uploader.on('complete', this.handleOnComplete);
    uploader.on('allComplete', this.handleOnAllComplete);
  }

  componentWillUnmount() {
    uploader.off('statusChange', this.handleOnStatusChange);
    uploader.off('validateBatch', this.handleOnValidateBatch);
    uploader.off('error', this.handleOnError);
    uploader.off('complete', this.handleOnComplete);
    uploader.off('allComplete', this.handleOnAllComplete);
  }

  render() {
    const { classes } = this.props;

    // console.log(statusEnum);

    // const chunkingEnabled =
    //   uploader.options.chunking && uploader.options.chunking.enabled;
    // const deleteEnabled =
    //   uploader.options.deleteFile && uploader.options.deleteFile.enabled;
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
        classes={classes}
        dropActiveClassName={classes.dropzoneActive}
        multiple={true}
      >
        <div className={classes.fileInput}>
          <FileInput
            uploader={uploader}
            multiple={uploader.options.multiple}
            disabled={fileInputDisabled}
          />
        </div>

        {this.state.visibleFiles.map(({ id, status, fromServer }) => (
          <Paper key={id} className={classes.uploadItem}>
            <Grid container spacing={16} alignItems={'center'}>
              <Grid item xs={12} sm style={inlineStyleGridItem}>
                <Typography variant="title" className={classes.filename}>
                  <Filename id={id} uploader={uploader} />
                </Typography>
              </Grid>
              <Grid item style={inlineStyleGridItem}>
                <Typography variant="subheading" className={classes.filesize}>
                  <Filesize id={id} uploader={uploader} />
                </Typography>
              </Grid>
              <Grid
                item
                style={{ paddingTop: 0, paddingBottom: 0, paddingRight: 0 }}
              >
                <div className={classes.fileStatus}>
                  {!status && <CancelButton id={id} uploader={uploader} />}
                  {(status === statusEnum.UPLOADING ||
                    status === statusEnum.UPLOAD_FINALIZING) && (
                    <CircularProgress color="primary" size={20} />
                  )}
                  {status === statusEnum.UPLOAD_SUCCESSFUL && (
                    <DoneIcon
                      className={classes.fileStatusIcon}
                      color="primary"
                    />
                  )}
                  {status === statusEnum.UPLOAD_FAILED && (
                    <ErrorIcon
                      className={classes.fileStatusIcon}
                      color="error"
                    />
                  )}
                </div>
              </Grid>
            </Grid>

            <div hidden={!status} style={{ marginBottom: 4 }}>
              <Grid container spacing={16} alignItems={'center'}>
                <Grid item style={{ paddingTop: 0, paddingBottom: 0 }}>
                  <Status status={status} />
                </Grid>
                <Grid
                  item
                  xs={12}
                  sm
                  style={{ paddingTop: 0, paddingBottom: 0 }}
                >
                  <ProgressBar
                    id={id}
                    uploader={uploader}
                    hideBeforeStart={true}
                    hideOnComplete={true}
                  />
                </Grid>
              </Grid>
            </div>
          </Paper>
        ))}
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
      return false;
    });
  }

  _findFileIndex(id) {
    let visibleFileIndex = -1;

    this.state.visibleFiles.some((file, index) => {
      if (file.id === id) {
        visibleFileIndex = index;
        return true;
      }
      return false;
    });

    return visibleFileIndex;
  }
}

// ========================================================================
const MaybeDropzone = ({
  children,
  content,
  hasVisibleFiles,
  disabled,
  classes,
  ...rest
}) => {
  let dropzoneDisabled = disabled;
  if (!dropzoneDisabled) {
    dropzoneDisabled = !uploader.qq.supportedFeatures.fileDrop;
  }

  if (hasVisibleFiles) {
    content = null;
  } else {
    content =
      content ||
      getDefaultMaybeDropzoneContent({
        content,
        classes,
        disabled: dropzoneDisabled,
      });
  }

  if (dropzoneDisabled) {
    return (
      <div className={classNames(classes.dropzone, classes.dropzoneDisabled)}>
        {content}
        {children}
      </div>
    );
  }

  return (
    <Dropzone
      className={classNames(classes.dropzone, classes.dropzoneEnabled)}
      uploader={uploader}
      {...rest}
    >
      {content}
      {children}
    </Dropzone>
  );
};

// ========================================================================

const getDefaultMaybeDropzoneContent = ({ content, classes, disabled }) => {
  const className = classes.dropzoneBackgroundContent;

  // if (disabled && !content) {
  //   return <span className={className}>Upload files</span>;
  // } else if (content) {
  //   return <span className={className}>{content}</span>;
  // } else if (!disabled) {
  //   return (
  //     <div className={className}>
  //       <CloudUploadIcon />
  //       <Typography variant="display2" component="span">
  //         Drop files here AAAA
  //       </Typography>
  //     </div>
  //   );
  // }

  return (
    <div className={className}>
      <CloudUploadIcon className={classes.dropzoneBackgroundIcon} />
      <Typography variant="display2" component="span">
        Drop Files Here
      </Typography>
    </div>
  );
};

const isFileGone = (statusToCheck, statusEnum) => {
  return [statusEnum.CANCELED, statusEnum.DELETED].indexOf(statusToCheck) >= 0;
};

export default withStyles(styles)(UploaderRows);
