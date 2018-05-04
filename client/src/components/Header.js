import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from 'material-ui/styles';
import { AppBar, Toolbar } from 'material-ui';
import Typography from 'material-ui/Typography';
import Tooltip from 'material-ui/Tooltip';
import IconButton from 'material-ui/IconButton';
import { AccountBox } from '@material-ui/icons';

import * as actions from '../actions';

const styles = theme => ({
  root: {
    // transition: theme.transitions.create('width'),
    '@media print': {
      position: 'absolute',
    },
    boxShadow: 'none',
    // background: 'transparent',
  },
  title: {
    marginLeft: 24,
    flex: '0 1 auto',
  },
  grow: {
    flex: '1 1 auto',
  },
});

class Header extends Component {
  render() {
    const { classes } = this.props;

    return (
      <AppBar className={classes.root}>
        <Toolbar>
          <Typography
            className={classes.title}
            variant="title"
            color="inherit"
            noWrap
          >
            My App
          </Typography>
          <div className={classes.grow} />
          <Tooltip
            id="appbar-account"
            title="GitHub repository"
            enterDelay={300}
          >
            <IconButton
              component="a"
              color="inherit"
              href="https://github.com/mui-org/material-ui"
              aria-labelledby="appbar-github"
            >
              <AccountBox />
            </IconButton>
          </Tooltip>
        </Toolbar>
      </AppBar>
    );
  }
}

function mapStateToProps({ auth }) {
  return { authenticated: auth };
}

export default connect(mapStateToProps, actions)(withStyles(styles)(Header));
