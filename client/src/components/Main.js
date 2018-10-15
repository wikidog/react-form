import React, { Component } from 'react';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import TestForm from './TestForm';
import Notifier from './notifier/Notifier';

const styles = theme => ({
  main: {
    // paddingTop: 80,
    marginTop: theme.spacing.unit * 3,
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(960 + theme.spacing.unit * 3 * 2)]: {
      width: 960,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
  // ---------------------------------------
  // fill the space of the Header (Appbar)
  filler: {
    height: 64,
  },
  // ---------------------------------------
  // set the position of the Notifier
  notifierWrapper: {
    position: 'relative',
  },
});

class Main extends Component {
  render() {
    // console.log('Main: ', this.props);
    const { classes } = this.props;

    return (
      <div>
        <div className={classes.filler} />
        <div className={classes.notifierWrapper}>
          <Notifier />
        </div>
        <div className={classes.main}>
          <Typography variant="h6" color="inherit">
            My Test Form
          </Typography>
          <TestForm />
        </div>
      </div>
    );
  }
}

export default withStyles(styles)(Main);
