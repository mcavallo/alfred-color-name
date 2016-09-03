var fs = require('fs'),
    path = require('path'),
    PNG = require('pngjs').PNG,
    Q = require('q');


module.exports = {
  dirExists: dirExists,
  generateIcon: generateIcon
};


function dirExists(filePath) {
  try {
    return fs.statSync(filePath).isDirectory();
  } catch(e) {
    return false;
  }
};


function generateIcon(baseImage, destinationDir, color) {
  var defered = Q.defer(),
      outImage = path.join(destinationDir, Date.now() + '.png');

  fs.createReadStream(baseImage)
    .pipe(new PNG({
      filterType: -1
    }))
    .on('parsed', function() {
      var half = this.width / 2;
      for (var y = 0; y < this.height; y++) {
        for (var x = 0; x < this.width; x++) {
          var idx = (this.width * y + x) << 2;
          if (x < half) {
            this.data[idx] = color.queriedRgbParts[0];
            this.data[idx + 1] = color.queriedRgbParts[1];
            this.data[idx + 2] = color.queriedRgbParts[2];
          } else {
            this.data[idx] = color.rgbParts[0];
            this.data[idx + 1] = color.rgbParts[1];
            this.data[idx + 2] = color.rgbParts[2];
          }
        }
      }

      this.pack().pipe(fs.createWriteStream(outImage).on('close', function() {
        defered.resolve(outImage);
      }));
    });

  return defered.promise;
};
