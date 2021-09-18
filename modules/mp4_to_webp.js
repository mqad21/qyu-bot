const scraperjs = require("scraperjs");
const axios = require("axios").default;
const FormData = require("form-data");
const cheerio = require("cheerio");
const fs = require("fs");
const https = require("https");
const baseUrl = "https://ezgif.com/video-to-webp?url=";

module.exports = (videoLink, targetFile) => {
  return new Promise((resolve, reject) => {
    scraperjs.StaticScraper.create(baseUrl + videoLink)
      .scrape(function ($) {
        const file = $("#main > form > input[type=hidden]:nth-child(1)")[0]
          .attribs.value;
        const token = $("#main > form > input[type=hidden]:nth-child(2)")[0]
          .attribs.value;
        const action = $("#main > form").attr("action");
        return { file, token, action };
      })
      .then(function ({ file, token, action }) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("token", token);
        formData.append("start", "0");
        formData.append("end", "5");
        formData.append("size", "original");
        formData.append("fps", "10");
        formData.append("loop", "on");
        axios
          .post("https://ezgif.com" + action + "?ajax=true", formData, {
            headers: formData.getHeaders(),
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
