const scraperjs = require("scraperjs");
const axios = require("axios").default;
const FormData = require("form-data");
const cheerio = require("cheerio");
const fs = require("fs");
const https = require("https");
const baseUrl = "https://ezgif.com/add-text?url=";

module.exports = (videoLink, targetFile, text) => {
  return new Promise((resolve, reject) => {
    scraperjs.StaticScraper.create(baseUrl + videoLink)
      .scrape(function ($) {
        const file = $("#main > form > input[type=hidden]:nth-child(1)")[0]
          .attribs.value;
        const token = $("#main > form > input[type=hidden]:nth-child(2)")[0]
          .attribs.value;
        const frameInputs = $("#main > form > #st-frames")
          .find("input")
          .map(function () {
            const key = $(this).attr("name");
            const value = $(this).attr("value");
            return { key, value };
          })
          .get();
        const action = $("#main > form").attr("action");
        return { file, token, action, frameInputs };
      })
      .then(async ({ file, token, action, frameInputs }) => {
        // Edit frame 1.
        const formData = new FormData();
        formData.append("fnum", 1);
        formData.append("text", text);
        formData.append("size", 32);
        formData.append("font", "Impact");
        formData.append("align", "center");
        formData.append("color", "White");
        formData.append("border", 2);
        formData.append("file", file);

        const { data } = await axios.post(action, formData, {
          headers: formData.getHeaders(),
        });

        // Render.
        const formData_ = new FormData();
        formData_.append("file", file);
        formData_.append("token", token);
        frameInputs.forEach((input) => {
          formData_.append(input.key, input.value);
        });
        formData_.append("f1[left]", data.left);
        formData_.append("f1[top]", data.top);
        formData_.append("f1[file]", data.file);

        axios
          .post(action + "?ajax=true", formData_, {
            headers: formData_.getHeaders(),
          })
          .then((response) => response.data)
          .then((content) => {
            const $ = cheerio.load(content);
            return $(".outfile img").attr("src");
          })
          .then((webp) => {
            const file = fs.createWriteStream(targetFile);
            webp = "https:" + webp;
            https.get(webp, function (response) {
              response.pipe(file);
            });
            file.on("finish", () => resolve(webp));
          })
          .catch((e) => {
            throw e;
          });
      })
      .catch((e) => reject(e));
  });
};
