const mail = require("./mail.js");
const MAIL = require("../configs/mail.js");

module.exports = (error) => {
  mail
    .sendMail({
      from: MAIL.DISCONNECT_MAIL.FROM,
      to: MAIL.DISCONNECT_MAIL.TARGET.join(", "),
      subject: MAIL.DISCONNECT_MAIL.SUBJECT,
      text: MAIL.DISCONNECT_MAIL.TEXT(error),
    })
    .catch((e) => {
      console.log(e);
    });
};
