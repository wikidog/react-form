import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import { Hidden } from '@material-ui/core';

const styles = theme => ({
  root: {
    display: 'flex',
    minWidth: theme.spacing.unit * 8,
    overflow: 'hidden',
    fontStyle: 'italic',
  },
});

const text = {
  canceled: 'Canceled',
  deleted: 'Deleted',
  deleting: 'Deleting...',
  paused: 'Paused',
  queued: 'Queued',
  retrying_upload: 'Retrying...',
  submitting: 'Submitting...',
  uploading: 'Uploading...',
  upload_finalizing: 'Merging...',
  upload_failed: 'Failed',
  upload_successful: 'Completed',
};

const Status = ({ status, classes }) => {
  if (!status) {
    return null;
  }

  const newStatusToDisplay = getStatusToDisplay({ displayMap: text, status });
  return (
    <Typography
      variant="caption"
      component="div"
      align="left"
      classes={{ root: classes.root }}
    >
      {newStatusToDisplay}
    </Typography>
  );
};

const getStatusToDisplay = ({ displayMap, status }) => {
  let key;

  if (status.indexOf(' ') > 0) {
    const statusParts = status.split(' ');

    key = `${statusParts[0]}_${statusParts[1]}`;
  } else {
    key = status;
  }

  return displayMap[key];
};

export default withStyles(styles)(Status);
