const fse = require('fs-extra');

// middleware for handling multipart/form-data
// Multer won't process any request body which is not multipart
//   (multipart/form-data).
const multer = require('multer');

const UPLOAD_DIR = 'uploads';

// multer disStorage configuration
//
const destination = async (req, file, next) => {
  const partIndex = req.body.qqpartindex;
  console.log('####### in destination ########');
  console.log(req.body);
  console.log(file);
  if (partIndex == null) {
    console.log('----- no chunking -----');
    next(null, UPLOAD_DIR);
  } else {
    console.log('******* chunking ******');
    const destDir = `${UPLOAD_DIR}/${req.body.qquuid}`;
    await fse.ensureDir(destDir);
    next(null, destDir);
  }
};

const filename = (req, file, next) => {
  const partIndex = req.body.qqpartindex;
  console.log('====== in filename =======');
  console.log(req.body);
  console.log(file);
  if (partIndex == null) {
    console.log('----- no chunking -----');
    next(null, `upload_${Date.now()}-${file.originalname}`);
  } else {
    console.log('******* chunking ******');
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

module.exports = app => {
  app.get('/upload', (req, res) => {
    res.send({ message: 'secret code 123456' });
  });

  app.post('/formsubmit', (req, res, next) => {
    console.log(req.body);
    res.send({ success: true });
    // res.status(422).send({ error: 'Wrong password' });
  });

  // for this request, we need
  //    app.use(bodyParser.urlencoded({ extended: true }));
  app.post('/chunksdone', async (req, res, next) => {
    console.log('======== chunksdone ==========');
    console.log(req.body);
    const uuid = req.body.qquuid;
    const filename = req.body.qqfilename;
    const totalSize = req.body.qqtotalfilesizes;
    const totalParts = req.body.qqtotalparts;
    const totalPartsInt = parseInt(totalParts);
    //
    const fromDir = `${UPLOAD_DIR}/${uuid}`;
    // const files = await fse.readdir(destDir);
    const toFile = `${UPLOAD_DIR}/upload_${Date.now()}-${filename}`;

    const toStream = await fse.createWriteStream(toFile, { flags: 'a' });

    let i = 0;
    while (i < totalPartsInt) {
      const paddedFilename = ('' + i).padStart(totalParts.length, '0');
      const fromStream = await fse.createReadStream(
        `${fromDir}/${paddedFilename}`
      );
      console.log('reading:', `${fromDir}/${paddedFilename}`);
      fromStream
        .on('error', error => {
          console.log('!!!!!! problem appending chunk !!!!!!', error);
          toStream.end();
          // TODO: throw error??????
        })
        .on('end', () => {
          i++;
        })
        .pipe(
          toStream,
          { end: false }
        );
    }
    toStream.end();

    res.send({ success: true });
    // res.status(422).send({ error: 'Wrong password' });
  });

  app.post('/uploads', upload.single('qqfile'), (req, res, next) => {
    res.send({ success: true });
  });
};
