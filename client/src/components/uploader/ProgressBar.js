import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import LinearProgress from '@material-ui/core/LinearProgress';

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
      completed: 0,
      // hidden: props.hideBeforeStart,
    };

    this.progressUpdateCounter = 0;

    this._createEventHandlers();
  }

  componentDidMount() {
    if (this._isTotalProgress) {
      this.props.uploader.on('totalProgress', this._trackProgressEventHandler);
    } else {
      this.props.uploader.on('progress', this._trackProgressEventHandler);
    }

    // this.props.uploader.on('statusChange', this._trackStatusEventHandler);
  }

  componentWillUnmount() {
    this._unmounted = true;
    this._unregisterEventHandlers();
  }

  _createEventHandlers() {
    if (this._isTotalProgress) {
      this._trackProgressEventHandler = (bytesUploaded, totalSize) => {
        this.handleProgressStateUpdate({ bytesUploaded, totalSize });
      };
    } else {
      this._trackProgressEventHandler = (
        id,
        name,
        bytesUploaded,
        totalSize
      ) => {
        if (id === this.props.id) {
          this.handleProgressStateUpdate({ bytesUploaded, totalSize });
        }
      };
    }

    const statusEnum = this.props.uploader.qq.status;

    /**
     *
    this._trackStatusEventHandler = (id, oldStatus, newStatus) => {
      // console.log('-------------------- in progressBar -----------');
      // console.log('oldStatus:', oldStatus);
      // console.log('newStatus:', newStatus);
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
     */
  } // ---- end of "_createEventHandlers() {...}" ------------------------

  handleProgressStateUpdate = ({ bytesUploaded, totalSize }) => {
    //
    //* throttle the updates - no need to update so frequently
    //
    this.progressUpdateCounter++;

    if (bytesUploaded > 0 && totalSize > 0) {
      if (bytesUploaded < totalSize && this.progressUpdateCounter % 4 > 0) {
        return;
      }
      console.log('counter:', this.progressUpdateCounter);
      console.log('bytesUploaded:', bytesUploaded);
      console.log('totalize:', totalSize);
      let completed = 0;
      if (bytesUploaded > 0) {
        completed = Math.round((bytesUploaded / totalSize) * 100 || 0);
      }
      console.log('completed:', completed);
      this.setState({ completed });
    }
  };

  get _isTotalProgress() {
    return this.props.id == null;
  }

  _unregisterEventHandlers() {
    if (this._isTotalProgress) {
      this.props.uploader.off('totalProgress', this._trackProgressEventHandler);
    } else {
      this.props.uploader.off('progress', this._trackProgressEventHandler);
    }

    // this.props.uploader.off('statusChange', this._trackStatusEventHandler);
  }

  // ----------------------------------------------------------------------
  render() {
    // let the initial value be to be some value greater than 0
    //    this makes the initial rendering of progress bar nicer in IE 11
    //    some how, initial value 0 doesn't play well in IE 11
    // let intPercent = 0;
    // if (this.state.bytesUploaded > 0) {
    //   intPercent = Math.round(
    //     (this.state.bytesUploaded / this.state.totalSize) * 100 || 0
    //   );
    // }
    // if (intPercent < 1) {
    //   intPercent = 0;
    // }

    const { classes } = this.props;
    return (
      <div className={classes.root}>
        {/* <span>{intPercent}</span> */}
        <LinearProgress variant="determinate" value={this.state.completed} />
      </div>
    );
  }
} // ==== end of "class ProgressBar extends Component {...}" ==============

const isUploadComplete = (statusToCheck, statusEnum) =>
  statusToCheck === statusEnum.UPLOAD_FAILED ||
  statusToCheck === statusEnum.UPLOAD_SUCCESSFUL ||
  statusToCheck === statusEnum.CANCELED;

export default withStyles(styles)(ProgressBar);
