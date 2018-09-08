import React, { Component } from 'react';
// import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import TestForm from './TestForm';

const styles = theme => ({
  root: {
    paddingTop: 80,
    width: 'auto',
    marginLeft: theme.spacing.unit * 3,
    marginRight: theme.spacing.unit * 3,
    [theme.breakpoints.up(960 + theme.spacing.unit * 3 * 2)]: {
      width: 960,
      marginLeft: 'auto',
      marginRight: 'auto',
    },
  },
});

class Main extends Component {
  render() {
    // console.log('Main: ', this.props);
    const { classes } = this.props;

    return (
      <main>
        <div className={classes.root}>
          <Typography variant="title" color="inherit">
            My Test Form
          </Typography>
          <TestForm />
        </div>
      </main>
    );
  }
}

export default withStyles(styles)(Main);
