import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  icon: {
    margin: theme.spacing.unit + 2,
    // fontSize: 24,
    // color: theme.status.succeed,
  },
  title: {
    // marginBottom: 16,
    fontSize: 16,
  },
  status: {
    fontStyle: 'italic',
  },
});

class IconStatus extends Component {}

export default withStyles(styles)(IconStatus);
