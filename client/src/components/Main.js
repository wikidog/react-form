import React, { Component } from 'react';
// import { connect } from 'react-redux';

// import { withTheme } from 'material-ui/styles';
import { withStyles } from 'material-ui/styles';

import { Grid, Typography } from 'material-ui';

import TestForm from './TestForm';

const styles = theme => ({
  root: theme.mixins.gutters({
    paddingTop: 80,
    flex: '1 1 100%',
    maxWidth: '100%',
    margin: '0 auto',
  }),
  [theme.breakpoints.up('md')]: {
    root: {
      maxWidth: theme.breakpoints.values.md, // maxWidth = 960px
    },
  },
  // form: {
  //   margin: theme.spacing.unit * 4,
  //   padding: theme.spacing.unit * 2,
  //   textAlign: 'center',
  //   height: 400,
  //   width: 400,
  // },
});

class Main extends Component {
  render() {
    // console.log('Main: ', this.props);
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            {/* <Grid container justify="center"> */}
            {/* <Grid item> */}
            {/* <Paper className={classes.form}> */}
            <Typography variant="title" color="inherit">
              My Test Form
            </Typography>
            <TestForm />
            {/* </Paper> */}
            {/* </Grid> */}
            {/* </Grid> */}
          </Grid>
        </Grid>
      </div>
    );
  }
}

export default withStyles(styles)(Main);
// export default withTheme()(Main);

// return (
//   <Grid container className={classes.root} spacing={16}>
//     <Grid item xs={12}>
//       <Grid container justify="center">
//         <Grid item>
//           <Paper className={classes.form}>
//             <Grid container>
//               <Grid item>
//                 <h2>My Test Form:</h2>
//                 <TestForm />
//               </Grid>
//             </Grid>
//           </Paper>
//         </Grid>
//       </Grid>
//     </Grid>
//   </Grid>
// );
