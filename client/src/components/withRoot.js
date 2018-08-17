import React from 'react';

// to custom the theme
//
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
// import purple from 'material-ui/colors/purple';
import blue from '@material-ui/core/colors/blue';
import grey from '@material-ui/core/colors/grey';
import green from '@material-ui/core/colors/green';
import orange from '@material-ui/core/colors/orange';
// import pink from 'material-ui/colors/pink';
import CssBaseline from '@material-ui/core/CssBaseline';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: {
      light: blue[500],
      main: blue[700],
      dark: blue[900],
    },
    secondary: {
      light: grey[500],
      main: grey[700],
      dark: grey[900],
    },
    // type: 'light',     // cannot specify 'main'; either 'light' or 'dark'
  },
  status: {
    danger: orange,
    succeed: green,
  },
  // mixins: {
  //   toolbar: {
  //     minHeight: 64,
  //   },
  // },
});

function withRoot(Component) {
  function WithRoot(props) {
    // MuiThemeProvider makes the theme available down the React tree
    // thanks to React context.
    return (
      <MuiThemeProvider theme={theme}>
        {/* CssBaseline kickstart an elegant, consistent, and simple baseline to build upon. */}
        <CssBaseline />
        <Component {...props} />
      </MuiThemeProvider>
    );
  }

  return WithRoot;
}

export default withRoot;
