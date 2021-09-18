const nodemailer = require("nodemailer");
const MAIL = require("../configs/mail.js");

module.exports = nodemailer.createTransport({
  host: MAIL.HOST,
  port: MAIL.PORT,
  secure: MAIL.SECURE,
  requireTLS: MAIL.TLS,
  auth: {
    user: MAIL.AUTH_USER,
    pass: MAIL.AUTH_PASS,
  },
});
