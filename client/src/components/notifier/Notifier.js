import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
// import Fade from 'material-ui/transitions/Fade';

import * as actions from './actions';

const styles = {
  root: {
    position: 'absolute',
  },
};

class Nifitier extends Component {
  //
  render() {
    // console.log('TestForm:', this.props);
    const {
      // error,
      handleSubmit,
      closeSnackbar, // * my action creator
      snackbarOpen,
      uploaderUploading,
      uploaderWorkInProgress,
      // uploadResponse,
      uploadError,
      classes,
    } = this.props;

    handleClose = () => {
      this.props.closeNofitier(); // dispatch an action
    };

    return (
      <Snackbar
        className={classes.root}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        // autoHideDuration={4000}
        onClose={closeNofitier}
        // transition={Fade}
        ContentProps={{
          'aria-describedby': 'snackbar-message-id',
          className: classes.snackbarContent,
        }}
        message={<span id="snackbar-message-id">{message}</span>}
        action={
          <Button
            color="inherit"
            size="small"
            onClick={this.handleClose}
            disableFocusRipple={true}
            disableRipple={true}
          >
            Undo
          </Button>
        }
      />
    );
  }
}

const mapStateToProps = ({ notifier }) => {
  return {
    open: notifier.open,
    message: notifier.message,
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    actions
  )(Notifier)
);
