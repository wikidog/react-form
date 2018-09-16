import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
// import Fade from '@material-ui/core/Fade';
import Button from '@material-ui/core/Button';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import WarningIcon from '@material-ui/icons/Warning';

import * as actions from './actions';

const styles = theme => ({
  root: {
    position: 'absolute',
  },
});

class Notifier extends Component {
  //
  handleClose = (event, reason) => {
    // if (reason === 'clickaway') {  // * this disables 'clickaway'
    //   return;
    // }
    this.props.closeNotifier(); // dispatch an action
  };

  render() {
    //
    const { open, message, classes } = this.props;

    return (
      <Snackbar
        className={classes.root}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        // autoHideDuration={4000}
        onClose={this.handleClose}
        TransitionComponent={Fade}
        ContentProps={{
          'aria-describedby': 'snackbar-message-id',
          className: classes.snackbarContent,
        }}
        message={<span id="snackbar-message-id">{message}</span>}
        action={
          // <Button
          //   color="inherit"
          //   size="small"
          //   onClick={this.handleClose}
          //   disableFocusRipple={true}
          //   disableRipple={true}
          // >
          //   Undo
          // </Button>
          <IconButton
            key="close"
            aria-label="Close"
            color="inherit"
            className={classes.close}
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>
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
