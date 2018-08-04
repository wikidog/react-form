import React, { Component } from 'react';

// import FineUploaderTraditional from 'fine-uploader-wrappers';
import Gallery from 'react-fine-uploader';

// ...or load this specific CSS file using a <link> tag in your document
import 'react-fine-uploader/gallery/gallery.css';
// import CancelButton from 'react-fine-uploader/cancel-button';

class UploadComponent extends Component {
  handleOnClick = () => {
    console.log('dropzone clicked');
    console.log('this.props', this.props);

    const uploader = this.props.uploader;

    let uploads = uploader.methods.getUploads();
    console.log('uploads:', uploads);
  };

  handleOnBlur = () => {
    console.log('on blur');
  };

  render() {
    // TODO: console.log()
    console.log('in uploader', this.props);

    const {
      uploader,
      input: { value, onChange, onBlur },
    } = this.props;

    const fileInputChildren = <span>Select a file</span>;

    const dropzoneContent = (
      <span className="react-fine-uploader-gallery-dropzone-content">
        Drop a file here
      </span>
    );

    return (
      <div onClick={this.handleOnClick} onBlur={this.handleOnBlur}>
        <Gallery
          fileInput-children={fileInputChildren}
          dropzone-content={dropzoneContent}
          uploader={uploader}
        />
        {/* {touched ? error : ''} */}
      </div>
    );
  }
}

export default UploadComponent;
