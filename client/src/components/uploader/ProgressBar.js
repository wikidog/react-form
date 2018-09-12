import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';
// import _debounce from 'lodash/debounce';
import _throttle from 'lodash/throttle';

const styles = {
  root: {
    flexGrow: 1,
  },
};

class ProgressBar extends Component {
  static propTypes = {
    id: PropTypes.number,
    hideBeforeStart: PropTypes.bool,
    hideOnComplete: PropTypes.bool,
    uploader: PropTypes.object.isRequired,
  };

  static defaultProps = {
    hideBeforeStart: true,
    hideOnComplete: true,
  };

  constructor(props) {
    super(props);

    this.state = {
      bytesUploaded: null,
      hidden: props.hideBeforeStart,
      totalSize: null,
    };

    this._createEventHandlers();
  }

  componentDidMount() {
    if (this._isTotalProgress) {
      this.props.uploader.on(
        'totalProgress',
        _throttle(this._trackProgressEventHandler, 80)
      );
    } else {
      this.props.uploader.on(
        'progress',
        _throttle(this._trackProgressEventHandler, 80)
      );
    }

    this.props.uploader.on('statusChange', this._trackStatusEventHandler);
  }

  componentWillUnmount() {
    this._unmounted = true;
    this._unregisterEventHandlers();
  }

  render() {
    // const className = this._isTotalProgress
    //   ? 'react-fine-uploader-total-progress-bar'
    //   : 'react-fine-uploader-file-progress-bar';
    // const customContainerClassName = this.props.className
    //   ? this.props.className + '-container'
    //   : '';

    const intPercent = Math.round(
      (this.state.bytesUploaded / this.state.totalSize) * 100 || 0
    );
    // const percentWidth = 10;

    const { classes } = this.props;
    return (
      <div className={classes.root} hidden={this.state.hidden}>
        {/* <span>{intPercent}</span> */}
        <LinearProgress variant="determinate" value={intPercent} />
      </div>
    );
  }

  _createEventHandlers() {
    if (this._isTotalProgress) {
      this._trackProgressEventHandler = (bytesUploaded, totalSize) => {
        this.setState({ bytesUploaded, totalSize });
      };
    } else {
      this._trackProgressEventHandler = (
        id,
        name,
        bytesUploaded,
        totalSize
      ) => {
        if (id === this.props.id) {
          // console.log('bytesUpload:', bytesUploaded);
          this.setState({ bytesUploaded, totalSize });
        }
      };
    }

    const statusEnum = this.props.uploader.qq.status;

    this._trackStatusEventHandler = (id, oldStatus, newStatus) => {
      console.log('-------------------- in progressBar -----------');
      console.log('oldStatus:', oldStatus);
      console.log('newStatus:', newStatus);
      if (!this._unmounted) {
        if (this._isTotalProgress) {
          if (
            !this.state.hidden &&
            this.props.hideOnComplete &&
            isUploadComplete(newStatus, statusEnum) &&
            !this.props.uploader.methods.getInProgress()
          ) {
            this.setState({ hidden: true });
          } else if (
            this.state.hidden &&
            this.props.uploader.methods.getInProgress()
          ) {
            this.setState({ hidden: false });
          }
        } else if (id === this.props.id) {
          if (this.state.hidden && newStatus === statusEnum.UPLOADING) {
            this.setState({ hidden: false });
          } else if (
            !this.state.hidden &&
            this.props.hideOnComplete &&
            isUploadComplete(newStatus, statusEnum)
          ) {
            this.setState({ hidden: true });
          }
        }
      }
    };
  }

  get _isTotalProgress() {
    return this.props.id == null;
  }

  _unregisterEventHandlers() {
    if (this._isTotalProgress) {
      this.props.uploader.off('totalProgress', this._trackProgressEventHandler);
    } else {
      this.props.uploader.off('progress', this._trackProgressEventHandler);
    }

    this.props.uploader.off('statusChange', this._trackStatusEventHandler);
  }
}

const isUploadComplete = (statusToCheck, statusEnum) =>
  statusToCheck === statusEnum.UPLOAD_FAILED ||
  statusToCheck === statusEnum.UPLOAD_SUCCESSFUL ||
  statusToCheck === statusEnum.CANCELED;

export default withStyles(styles)(ProgressBar);
