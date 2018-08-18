import React from 'react';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';

const styles = {
  root: {
    fontStyle: 'italic',
  },
};

const text = {
  canceled: 'Canceled',
  deleted: 'Deleted',
  deleting: 'Deleting...',
  paused: 'Paused',
  queued: 'Queued',
  retrying_upload: 'Retrying...',
  submitting: 'Submitting...',
  uploading: 'Uploading...',
  upload_failed: 'Failed',
  upload_successful: 'Completed',
};

const Status = ({ status, classes }) => {
  const newStatusToDisplay = getStatusToDisplay({ displayMap: text, status });
  return (
    <Typography variant="caption" align="left" classes={{ root: classes.root }}>
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
