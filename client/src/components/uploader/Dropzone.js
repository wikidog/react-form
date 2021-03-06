import React, { Component } from 'react';
import qq from 'fine-uploader/lib/dnd';
// import PropTypes from 'prop-types';

class DropzoneElement extends Component {
  // static propTypes = {
  //   children: PropTypes.node,
  //   dropActiveClassName: PropTypes.string,
  //   element: PropTypes.object,
  //   multiple: PropTypes.bool,
  //   onDropError: PropTypes.func,
  //   onProcessingDroppedFiles: PropTypes.func,
  //   onProcessingDroppedFilesComplete: PropTypes.func,
  //   uploader: PropTypes.object.isRequired,
  // };

  // static defaultProps = {
  //   dropActiveClassName: 'react-fine-uploader-dropzone-active',
  // };

  dropzoneRef = React.createRef();

  componentDidMount() {
    this._registerDropzone();
  }

  componentDidUpdate() {
    this._registerDropzone();
  }

  componentWillUnmount() {
    this._qqDropzone && this._qqDropzone.dispose();
  }

  render() {
    // const { uploader, ...elementProps } = this.props; // eslint-disable-line no-unused-vars

    return (
      <div
        // {...getElementProps(this.props)}
        className={this.props.className}
        // ref="dropZone"
        ref={this.dropzoneRef}
      >
        {this.props.children}
      </div>
    );
  }

  _onDropError(errorCode, errorData) {
    // console.error(errorCode, errorData);
    this.props.onDropError && this.props.onDropError(errorCode, errorData);
  }

  _onProcessingDroppedFilesComplete(files) {
    this.props.uploader.methods.addFiles(files);

    if (this.props.onProcessingDroppedFilesComplete) {
      this.props.onProcessingDroppedFilesComplete(files);
    }
  }

  _registerDropzone() {
    this._qqDropzone && this._qqDropzone.dispose();

    // const dropzoneEl = this.props.element || this.refs.dropZone;
    const dropzoneEl = this.props.element || this.dropzoneRef.current;

    this._qqDropzone = new qq.DragAndDrop({
      allowMultipleItems: !!this.props.multiple,
      callbacks: {
        dropError: this._onDropError.bind(this),
        processingDroppedFiles:
          this.props.onProcessingDroppedFiles || function() {},
        processingDroppedFilesComplete: this._onProcessingDroppedFilesComplete.bind(
          this
        ),
      },
      classes: {
        dropActive: this.props.dropActiveClassName || '',
      },
      dropZoneElements: [dropzoneEl],
    });
  }
}

// const getElementProps = actualProps => {
//   console.log('actualProps', actualProps);
//   const actualPropsCopy = { ...actualProps };
//   const expectedPropNames = Object.keys(DropzoneElement.propTypes);
//   console.log('expectedPropNames', expectedPropNames);

//   expectedPropNames.forEach(
//     expectedPropName => delete actualPropsCopy[expectedPropName]
//   );
//   console.log('actualPropsCopy', actualPropsCopy);
//   return actualPropsCopy;
// };

export default DropzoneElement;
