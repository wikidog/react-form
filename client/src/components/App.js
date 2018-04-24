import React, { Component } from 'react';

import withRoot from './withRoot';

import Header from './Header';
import Main from './Main';

class App extends Component {
  render() {
    return (
      <div className="App">
        <Header />
        <Main />
      </div>
    );
  }
}

// apply the 'mui theme' to the root component
//
export default withRoot(App);
