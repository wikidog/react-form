import React, { Component } from 'react';

// import FineUploaderTraditional from 'fine-uploader-wrappers';
import Gallery from 'react-fine-uploader';

// ...or load this specific CSS file using a <link> tag in your document
import 'react-fine-uploader/gallery/gallery.css';
// import CancelButton from 'react-fine-uploader/cancel-button';

class UploadComponent extends Component {
  render() {
    console.log('in uploader', this.props);

    const fileInputChildren = <span>Select a file</span>;

    const dropzoneContent = (
      <span className="react-fine-uploader-gallery-dropzone-content">
        Drop a file here
      </span>
    );

    return (
      <div>
        <Gallery
          fileInput-children={fileInputChildren}
          dropzone-content={dropzoneContent}
          uploader={this.props.uploader}
        />
        {/* {touched ? error : ''} */}
      </div>
    );
  }
}

export default UploadComponent;
