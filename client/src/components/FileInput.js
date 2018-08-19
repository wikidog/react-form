import React, { Component } from 'react';
import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import CloudUploadIcon from '@material-ui/icons/CloudUpload';

const styles = theme => ({
  button: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit * 2.5,
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

  resetFileInput = () => {
    this.setState({ key: newKey() });
  };

  handleOnFilesSelected = event => {
    this.props.uploader.methods.addFiles(event.target);
    this.resetFileInput();
  };

  render() {
    const { classes, multiple, disabled } = this.props;

    // !!! Important !!!
    // the "key" property is very important!!!!!!!!
    //   the key changes every time a file is selected or multiple files
    //   are selected, which forces React to re-render this component,
    //   which effectively resets the file input element.
    //   if we don't use the "key" property, the "onChange" event won't
    //   fire if the file selected at the 2nd time is the same as the file
    //   selected at the first time.
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
            disableFocusRipple={true}
            disableRipple={true}
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
