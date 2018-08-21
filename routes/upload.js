//
// middleware for handling multipart/form-data
// Multer won't process any form which is not multipart (multipart/form-data).
const multer = require('multer');

//
const upload = multer({ dest: 'uploads/' });

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
    console.log(req.body);
    console.log(req.file);

    req.file.mv(`uploads/${req.file.filename}`, err => {
      if (err) {
        return res.status(500).send(err);
      }
    });
    res.send({ success: true });
  });
};
