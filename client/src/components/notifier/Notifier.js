import React, { Component } from 'react';
import { connect } from 'react-redux';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
// import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import SnackbarContent from '@material-ui/core/SnackbarContent';
import Fade from '@material-ui/core/Fade';
// import Slide from '@material-ui/core/Slide';
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import green from '@material-ui/core/colors/green';
import amber from '@material-ui/core/colors/amber';
import IconButton from '@material-ui/core/IconButton';
import WarningIcon from '@material-ui/icons/Warning';

import * as actions from './actions';

const variantIcon = {
  success: CheckCircleIcon,
  warning: WarningIcon,
  error: ErrorIcon,
  info: InfoIcon,
};

const styles1 = theme => ({
  success: {
    backgroundColor: green[600],
  },
  error: {
    backgroundColor: theme.palette.error.dark,
  },
  info: {
    backgroundColor: theme.palette.primary.dark,
  },
  warning: {
    backgroundColor: amber[700],
  },
  icon: {
    fontSize: 20,
  },
  iconVariant: {
    opacity: 0.9,
    marginRight: theme.spacing.unit,
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
});

const MySnackbarContent = props => {
  const { classes, className, message, onClose, variant, ...other } = props;
  const Icon = variantIcon[variant];

  return (
    <SnackbarContent
      className={classNames(classes[variant], className)}
      aria-describedby="client-snackbar"
      message={
        <span id="client-snackbar" className={classes.message}>
          <Icon className={classNames(classes.icon, classes.iconVariant)} />
          {message}
        </span>
      }
      action={[
        <IconButton
          key="close"
          aria-label="Close"
          color="inherit"
          disableRipple={true}
          className={classes.close}
          onClick={onClose}
        >
          <CloseIcon className={classes.icon} />
        </IconButton>,
      ]}
      //
      // this is just a workaround
      // headlineMapping={{
      //   body1: 'div',
      //   body2: 'div',
      // }}
      //
      {...other}
    />
  );
};

const MySnackbarContentWrapper = withStyles(styles1)(MySnackbarContent);

// ======================================================================

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
    const { open, message, variant, classes } = this.props;

    return (
      <Snackbar
        className={classes.root}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        open={open}
        // autoHideDuration={4000}
        onClose={this.handleClose}
        // TransitionComponent={Slide}
        TransitionComponent={Fade}
      >
        <MySnackbarContentWrapper
          onClose={this.handleClose}
          variant={variant}
          message={message}
        />
      </Snackbar>
    );
  }
}

const mapStateToProps = ({ notifier }) => {
  return {
    open: notifier.open,
    variant: notifier.variant,
    message: notifier.message,
  };
};

export default withStyles(styles)(
  connect(
    mapStateToProps,
    actions
  )(Notifier)
);
