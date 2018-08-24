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
  console.log('====== in destination =======');

  if (partIndex == null) {
    console.log('----- no chunking -----');
    next(null, UPLOAD_DIR);
  } else {
    console.log('******* chunking ******');
    const dest = `${UPLOAD_DIR}/${req.body.qquuid}`;
    await fse.ensureDir(dest);
    next(null, dest);
  }
};

const filename = (req, file, next) => {
  console.log('====== in filename =======');
  console.log(req.body);
  console.log(file);
  const partIndex = req.body.qqpartindex;
  if (partIndex == null) {
    console.log('----- no chunking -----');
    next(null, `upload_${Date.now()}-${file.originalname}`);
  } else {
    console.log('******* chunking ******');
    const totalParts = req.body.qqtotalparts;
    next(null, partIndex.padStart(totalParts.length, '0'));
  }
};

const getChunkFilename = (index, count) => {
  const digits = ('' + count).length;
  const zeros = new Array(digits + 1).join('0');
  return (zeros + index).slice(-digits);
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
  app.post('/chunksdone', (req, res, next) => {
    console.log('======== chunksdone ==========');
    console.log(req.body);
    res.send({ success: true });
    // res.status(422).send({ error: 'Wrong password' });
  });

  app.post('/uploads', upload.single('qqfile'), (req, res, next) => {
    res.send({ success: true });
  });
};
