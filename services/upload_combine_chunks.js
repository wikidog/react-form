const fs = require('fs-extra');

// ---------------------------------------------------------------------
const mergeParts = (
  index,
  totalPartsInt,
  fromDir,
  toFile,
  toStream,
  success,
  req,
  res,
  next
) => {
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
      mergeParts(
        index + 1,
        totalPartsInt,
        fromDir,
        toFile,
        toStream,
        success,
        req,
        res,
        next
      );
    });

    fromStream.pipe(
      toStream,
      { end: false }
    );
  } else {
    // only close the destination stream when all parts are merged
    toStream.end();
    // TODO: done; return results
    success(req, res, next, toFile); // invoke the function "combineChunksCallback"
  }
};

// ---------------------------------------------------------------------
const combineChunks = (
  totalPartsInt,
  fromDir,
  toFile,
  success,
  req,
  res,
  next
) => {
  // console.log('----- combineChunks -------');
  const toStream = fs.createWriteStream(toFile, { flags: 'a' });

  toStream.on('error', error => {
    console.log('!!!!!! problem appending chunk !!!!!!', error);
    toStream.end();
    // TODO: return error??????
    next(error);
  });

  mergeParts(
    0,
    totalPartsInt,
    fromDir,
    toFile,
    toStream,
    success,
    req,
    res,
    next
  );
};

module.exports = combineChunks;
