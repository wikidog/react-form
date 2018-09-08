import React, { Component } from 'react';
import { connect } from 'react-redux';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import AccountBox from '@material-ui/icons/AccountBox';

import * as actions from '../actions';

const styles = theme => ({
  root: {
    // flexGrow: 1,
    // transition: theme.transitions.create('width'),
    // '@media print': {
    //   position: 'absolute',
    // },
    // boxShadow: 'none',
    // background: 'transparent',
    // minHeight: 10,
  },
  title: {
    marginLeft: theme.spacing.unit * 2,
    // flex: '0 1 auto',
    flexGrow: 1,
  },
  grow: {
    // flex: '1 1 auto',
  },
});

class Header extends Component {
  render() {
    const { classes } = this.props;

    return (
      /**
       * * "static": default positioning; element in its normal position
       * *           in the document layout flow
       * * "fixed":  fixed in place - persisting navigation menu
       */
      <AppBar position="fixed">
        <Toolbar>
          <Typography
            className={classes.title}
            variant="title"
            color="inherit"
            noWrap
          >
            My App
          </Typography>
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

const mapStateToProps = state => {
  return {};
};

export default connect(
  mapStateToProps,
  actions
)(withStyles(styles)(Header));
