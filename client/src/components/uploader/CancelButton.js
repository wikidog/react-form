import React, { Component } from 'react';
// import PropTypes from 'prop-types';

import { withStyles } from '@material-ui/core/styles';
import IconButton from '@material-ui/core/IconButton';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

const styles = theme => ({
  iconButton: {
    // margin: theme.spacing.unit,
    // fontSize: 22,
    width: theme.spacing.unit * 5,
    height: theme.spacing.unit * 5,
  },
});

class CancelButton extends Component {
  //
  state = { cancelable: true };

  handleOnStatusChange = (id, oldStatus, newStatus) => {
    //
    console.log('----- in CancelButton ------');
    const statusEnum = this.props.uploader.qq.status;

    if (id === this.props.id && !this._unmounted) {
      if (!isCancelable(newStatus, statusEnum) && this.state.cancelable) {
        this.setState({ cancelable: false });
      } else if (
        isCancelable(newStatus, statusEnum) &&
        !this.state.cancelable
      ) {
        this.setState({ cancelable: true });
      } else if (
        newStatus === statusEnum.DELETED ||
        newStatus === statusEnum.CANCELED
      ) {
        this.unregisterStatusChangeHandler();
      }
    }
  };

  handleOnClick = () => this.props.uploader.methods.cancel(this.props.id);

  componentDidMount() {
    this.props.uploader.on('statusChange', this.handleOnStatusChange);
  }

  componentWillUnmount() {
    this._unmounted = true;
    this.unregisterStatusChangeHandler();
  }

  unregisterStatusChangeHandler() {
    this.props.uploader.off('statusChange', this.handleOnStatusChange);
  }

  render() {
    const { classes } = this.props; // eslint-disable-line no-unused-vars

    if (this.state.cancelable) {
      return (
        <IconButton
          classes={{ root: classes.iconButton }}
          aria-label="Cancel"
          onClick={this.state.cancelable && this.handleOnClick}
          disableRipple={true}
          disabled={!this.state.cancelable}
        >
          <DeleteForeverIcon />
        </IconButton>
      );
    }

    return null;
  }
}

const isCancelable = (statusToCheck, statusEnum) => {
  return (
    [
      statusEnum.DELETE_FAILED,
      statusEnum.PAUSED,
      statusEnum.QUEUED,
      statusEnum.UPLOAD_RETRYING,
      statusEnum.SUBMITTED,
      statusEnum.UPLOADING,
      statusEnum.UPLOAD_FAILED,
    ].indexOf(statusToCheck) >= 0
  );
};

export default withStyles(styles)(CancelButton);
