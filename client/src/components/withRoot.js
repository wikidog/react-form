import React from 'react';

// to custom the theme
//
import { MuiThemeProvider, createMuiTheme } from 'material-ui/styles';
// import purple from 'material-ui/colors/purple';
import green from 'material-ui/colors/green';
import blue from 'material-ui/colors/blue';
// import pink from 'material-ui/colors/pink';
import CssBaseline from 'material-ui/CssBaseline';

// A theme with custom primary and secondary color.
// It's optional.
const theme = createMuiTheme({
  palette: {
    primary: blue,
    secondary: {
      light: green[300],
      main: green[500],
      dark: green[700],
    },
    type: 'light',
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
