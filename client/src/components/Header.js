import React, { Component } from 'react';
import { connect } from 'react-redux';

import { AppBar, Toolbar } from 'material-ui';
import Typography from 'material-ui/Typography';

import * as actions from '../actions';

class Header extends Component {
  render() {
    return (
      <AppBar position="static" color="default">
        <Toolbar>
          <Typography variant="title" color="inherit">
            My App
          </Typography>
        </Toolbar>
      </AppBar>
    );
  }
}

function mapStateToProps({ auth }) {
  return { authenticated: auth };
}

export default connect(mapStateToProps, actions)(Header);
