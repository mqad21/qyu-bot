const stopwords = require("../commons/stopwords-id.json");
const _ = require("lodash");

module.exports = (str) => {
  res = [];
  words = str.split(" ");
  for (i = 0; i < words.length; i++) {
    word_clean = words[i].split(".").join("");
    if (!stopwords.includes(_.lowerCase(word_clean))) {
      res.push(word_clean);
    }
  }
  return res.join(" ");
};
