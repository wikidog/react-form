import React, { Component } from 'react';
// import { connect } from 'react-redux';

import { withTheme } from 'material-ui/styles';
// import { withStyles } from 'material-ui/styles';

import TestForm from './TestForm';

class Main extends Component {
  render() {
    console.log('Main: ', this.props);

    return (
      <div>
        <h2>My Test Form:</h2>
        <TestForm />
      </div>
    );
  }
}

export default withTheme()(Main);
