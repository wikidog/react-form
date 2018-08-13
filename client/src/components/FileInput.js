import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const styles = theme => ({
  button: {
    margin: theme.spacing.unit,
  },
  leftIcon: {
    marginRight: theme.spacing.unit,
  },
  rightIcon: {
    marginLeft: theme.spacing.unit,
  },
  iconSmall: {
    fontSize: 20,
  },
  input: {
    display: 'none',
  },
});

const newKey = () => Date.now();

class FileInput extends Component {
  //
  state = { key: newKey() };

  resetInput = () => {
    this.setState({ key: newKey() });
  };

  handleOnFilesSelected = event => {
    this.props.uploader.methods.addFiles(event.target);
    this.resetInput();
  };

  render() {
    const { classes, multiple, disabled } = this.props;

    return (
      <div key={this.state.key}>
        <input
          className={classes.input}
          id="contained-button-file"
          onChange={this.handleOnFilesSelected}
          multiple={multiple}
          disabled={disabled}
          type="file"
        />
        <label htmlFor="contained-button-file">
          <Button
            variant="contained"
            size="small"
            color="default"
            component="span"
            disabled={disabled}
            className={classes.button}
          >
            <CloudUploadIcon
              className={classNames(classes.leftIcon, classes.iconSmall)}
            />
            {multiple ? 'Select Files' : 'Select a File'}
          </Button>
        </label>
      </div>
    );
  }
}

export default withStyles(styles)(FileInput);
