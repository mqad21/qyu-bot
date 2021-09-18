const fs = require("fs");

module.exports = async () => {
  const stickerPackID =
    "com.etheral.waifuhub.android.stickercontentprovider b5e7275f-f1de-4137-961f-57becfad34f2";
  const json = {
    "sticker-pack-id": stickerPackID,
    "sticker-pack-name": "Sticker Qyu-Bot",
    "sticker-pack-publisher": "wa.me/6289653482393",
  };
  let length = new TextEncoder("utf-8").encode(JSON.stringify(json)).length;
  const f = Buffer.from([
    0x49, 0x49, 0x2a, 0x00, 0x08, 0x00, 0x00, 0x00, 0x01, 0x00, 0x41, 0x57,
    0x07, 0x00,
  ]);
  const code = [0x00, 0x00, 0x16, 0x00, 0x00, 0x00];
  if (length > 256) {
    length = length - 256;
    code.unshift(0x01);
  } else {
    code.unshift(0x00);
  }
  const fff = Buffer.from(code);
  const ffff = Buffer.from(JSON.stringify(json), "utf-8");
  let len;
  if (length < 16) {
    len = length.toString(16);
    len = "0" + length;
  } else {
    len = length.toString(16);
  }
  const ff = Buffer.from(len, "hex");
  const buffer = Buffer.concat([f, ff, fff, ffff]);
  const fn = `./pictures/${Math.random().toString()}.exif`;
  fs.writeFileSync(fn, buffer);
  return fn;
};
