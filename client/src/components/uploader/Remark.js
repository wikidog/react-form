import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = theme => ({
  root: {
    overflow: 'hidden',
    fontStyle: 'italic',
  },
});

const Remark = ({ status, remark, classes }) => {
  if (!remark) {
    return null;
  }

  let textColor = 'textSecondary';
  if (status === 'upload failed') {
    textColor = 'error';
  }

  return (
    <Typography
      variant="body1"
      color={textColor}
      component="div"
      align="left"
      classes={{ root: classes.root }}
    >
      {remark}
    </Typography>
  );
};

export default withStyles(styles)(Remark);
