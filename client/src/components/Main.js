import React, { Component } from 'react';
// import { connect } from 'react-redux';

import TestForm from './TestForm';

class Main extends Component {
  render() {
    return (
      <div>
        <h2>My Test Form:</h2>
        <TestForm />
      </div>
    );
  }
}

export default Main;
