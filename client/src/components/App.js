import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

import withRoot from './withRoot';

import Header from './Header';
import Main from './Main';

const styles = theme => ({
  root: {
    display: 'flex',
    alignItems: 'stretch',
    minHeight: '100vh',
    width: '100%',
  },
});

class App extends Component {
  render() {
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Header />
        <Main />
      </div>
    );
  }
}

// apply the 'mui theme' to the root component
//
export default withRoot(withStyles(styles)(App));
