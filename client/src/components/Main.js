import React, { Component } from 'react';
// import { connect } from 'react-redux';

import { withTheme } from '@material-ui/core/styles';
import { withStyles } from '@material-ui/core/styles';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';

import TestForm from './TestForm';

const styles = theme => ({
  //
  // TODO: why use "theme.mixins.getters()????"
  //
  // root: theme.mixins.gutters({
  //   paddingTop: 80,
  //   flex: '1 1 100%',
  //   maxWidth: '100%',
  //   margin: '0 auto',
  // }),
  root: {
    paddingTop: 80,
    flex: '1 1 100%',
    maxWidth: '100%',
    margin: '0 auto',
  },
  //
  // set the maxWidth to 960px
  //
  [theme.breakpoints.up('md')]: {
    root: {
      maxWidth: theme.breakpoints.values.md, // maxWidth = 960px
    },
  },
  // container: {
  //   display: 'grid',
  //   gridTemplateColumns: 'repeat(12, 1fr)',
  //   gridGap: `${theme.spacing.unit * 3}px`,
  // },
  // form: {
  //   margin: theme.spacing.unit * 4,
  //   padding: theme.spacing.unit * 2,
  //   textAlign: 'center',
  //   height: 400,
  //   width: 400,
  // },
});

class Main extends Component {
  render() {
    // console.log('Main: ', this.props);
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Typography variant="title" color="inherit">
              My Test Form
            </Typography>
            <TestForm />
          </Grid>
        </Grid>
      </div>
    );
  }
}

// withTheme(): we need to access the 'theme' variable in this component
export default withTheme()(withStyles(styles)(Main));
