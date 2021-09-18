const Jimp = require("jimp");

module.exports = (source, dest, caption) => {
  return new Promise((resolve, reject) => {
    Jimp.read(source, (err, image) => {
      if (err) reject(err);
      image.contain(500, 500).write(dest);
      if (caption) {
        Jimp.loadFont(Jimp.FONT_SANS_128_WHITE)
          .then((font) => {
            image.print(font, 0, 0, {
              text: caption,
              alignmentX: Jimp.HORIZONTAL_ALIGN_CENTER,
              alignmentY: Jimp.VERTICAL_ALIGN_MIDDLE,
            });
            resolve(image);
          })
          .catch((e) => reject(e));
      } else {
        resolve(image);
      }
    });
  });
};
