import React, { Component } from 'react';

import FineUploaderTraditional from 'fine-uploader-wrappers';
import Gallery from 'react-fine-uploader';

// ...or load this specific CSS file using a <link> tag in your document
import 'react-fine-uploader/gallery/gallery.css';
// import CancelButton from 'react-fine-uploader/cancel-button';

const uploader = new FineUploaderTraditional({
  options: {
    debug: true,
    autoUpload: false,
    multiple: false,
    validation: {
      itemLimit: 1,
    },
    messages: {
      tooManyItemsError: 'one file a time',
    },
    chunking: {
      enabled: false,
    },
    deleteFile: {
      enabled: false,
      endpoint: '/uploads',
    },
    request: {
      endpoint: '/uploads',
    },
    retry: {
      enableAuto: false,
    },
    callbacks: {
      onValidate: () => console.log('aaaaaaaaa == onValidate ======'),
      onValidateBatch: () => console.log('aaaaaaaaa == onValidateBatch ======'),
      onError: () => console.log('bbbbbbbbb == onError ======'),
      onStatusChange: (id, oldStatus, newStatus) => {
        console.log('id:', id);
        console.log('oldStatus:', oldStatus);
        console.log('newStatus:', newStatus);
      },
      onSubmit: (id, name) => {
        console.log('=============== onSubmit ===================');
        console.log('id:', id);
        console.log('name:', name);
      },
    },
  },
});

class UploadComponent extends Component {
  render() {
    const fileInputChildren = <span>Select a file</span>;

    const dropzoneContent = (
      <span className="react-fine-uploader-gallery-dropzone-content">
        Drop a file here
      </span>
    );

    return (
      <Gallery
        fileInput-children={fileInputChildren}
        dropzone-content={dropzoneContent}
        uploader={uploader}
      />
    );
  }
}

export default UploadComponent;
