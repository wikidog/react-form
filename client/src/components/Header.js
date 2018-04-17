import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as actions from '../actions';

class Header extends Component {
  render() {
    return (
      <div>
        <h1>Header</h1>
      </div>
    );
  }
}

function mapStateToProps({ auth }) {
  return { authenticated: auth };
}

export default connect(mapStateToProps, actions)(Header);
