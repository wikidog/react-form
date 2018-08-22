//
// middleware for handling multipart/form-data
// Multer won't process any form which is not multipart (multipart/form-data).
const multer = require('multer');

//
const storage = multer.diskStorage({
  destination: (req, file, next) => next(null, 'uploads'),
  filename: (req, file, next) => {
    console.log(req.body);
    console.log(file);
    next(null, `upload_${Date.now()}-${file.originalname}`);
  },
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

  app.post('/uploads', upload.single('qqfile'), (req, res, next) => {
    res.send({ success: true });
  });
};
