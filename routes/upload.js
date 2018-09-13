const fs = require('fs-extra');

//* middleware for handling multipart/form-data
//* Multer won't process any request body which is not multipart/form-data
const multer = require('multer');

const UPLOAD_DIR = 'uploads';

// ==================================================================
// multer disStorage configuration
//
const destination = async (req, file, next) => {
  const partIndex = req.body.qqpartindex;
  // console.log('####### in destination ########');
  // console.log(req.body);
  // console.log(file);
  if (partIndex == null) {
    // console.log('----- no chunking -----');
    next(null, UPLOAD_DIR);
  } else {
    // console.log('******* chunking ******');
    const destDir = `${UPLOAD_DIR}/${req.body.qquuid}`;
    await fs.ensureDir(destDir);
    next(null, destDir);
  }
};

const filename = (req, file, next) => {
  const partIndex = req.body.qqpartindex;
  // console.log('====== in filename =======');
  // console.log(req.body);
  // console.log(file);
  if (partIndex == null) {
    // console.log('----- no chunking -----');
    next(null, `upload_${Date.now()}-${file.originalname}`);
  } else {
    // console.log('******* chunking ******');
    const totalParts = req.body.qqtotalparts;
    // 0 left padding
    // padding length depends on the length of total parts
    next(null, partIndex.padStart(totalParts.length, '0'));
  }
};

const storage = multer.diskStorage({
  destination,
  filename,
});

// const upload = multer({ dest: 'uploads/' });
const upload = multer({ storage });

// ====================================================================

const mergeParts = (index, totalPartsInt, fromDir, toStream, success, next) => {
  if (index < totalPartsInt) {
    const paddedFilename = ('' + index).padStart(
      ('' + totalPartsInt).length,
      '0'
    );
    const fromStream = fs.createReadStream(`${fromDir}/${paddedFilename}`);
    // console.log('reading:', `${fromDir}/${paddedFilename}`);

    // if an error occurred while reding the source stream
    fromStream.on('error', error => {
      console.log('!!!!!! problem appending chunk !!!!!!', error);
      toStream.end();
      // TODO: return error??????
      next(error);
    });

    fromStream.on('end', () => {
      // console.log('=== on end');
      // * recursive
      mergeParts(index + 1, totalPartsInt, fromDir, toStream, success, next);
    });

    fromStream.pipe(
      toStream,
      { end: false }
    );
  } else {
    // only close the destination stream when all parts are merged
    toStream.end();
    // TODO: done; return results
    success();
  }
};

const combineChunks = (fromDir, totalPartsInt, toFile, success, next) => {
  // console.log('----- combineChunks -------');
  const toStream = fs.createWriteStream(toFile, { flags: 'a' });

  toStream.on('error', error => {
    console.log('!!!!!! problem appending chunk !!!!!!', error);
    toStream.end();
    // TODO: return error??????
    next(error);
  });

  mergeParts(0, totalPartsInt, fromDir, toStream, success, next);
};

// ====================================================================

module.exports = app => {
  app.get('/upload', (req, res) => {
    res.send({ message: 'secret code 123456' });
    return;

    // req.setTimeout(10000);

    // setTimeout(() => {
    //   res.send({ message: 'secret code 123456' });
    // }, 180000);
  });

  app.post('/formsubmit', (req, res, next) => {
    console.log(req.body);
    res.send({ success: true });
    // res.status(422).send({ error: 'Wrong password' });
  });

  // for this request, we need
  //    app.use(bodyParser.urlencoded({ extended: true }));
  app.post('/chunksdone', (req, res, next) => {
    console.log('======== chunksdone ==========');
    console.log(req.body);

    // res.send({ success: true });
    // // res.status(422).send({ error: 'Wrong password' });
    // return;

    const uuid = req.body.qquuid;
    const filename = req.body.qqfilename;
    const totalSize = req.body.qqtotalfilesizes;
    const totalParts = req.body.qqtotalparts;
    const totalPartsInt = parseInt(totalParts);
    //
    const fromDir = `${UPLOAD_DIR}/${uuid}`;
    // const files = await fs.readdir(destDir);
    const toFile = `${UPLOAD_DIR}/upload_${Date.now()}-${filename}`;

    //! Node has default 2 minute timeout for the request
    //! if the uploaded file is very big, merging could take long time
    //! we must extend the timeout value for this request
    combineChunks(
      fromDir,
      totalPartsInt,
      toFile,
      () => res.send({ success: true }),
      next
    );
  });

  app.post('/uploads', upload.single('qqfile'), (req, res, next) => {
    // res.status(420).send({ success: false });
    console.log('========= one upload done ==========');
    console.log(req.body);
    res.send({ success: true });
  });
};
