const dotenv = require("dotenv");
dotenv.config();

module.exports = {
  HOST: "smtp.gmail.com",
  PORT: 587,
  SECURE: false,
  AUTH_USER: process.env.EMAIL_USER,
  AUTH_PASS: process.env.EMAIL_PASS,
  TLS: true,
  DISCONNECT_MAIL: {
    FROM: `"Qyu Bot" <${process.env.EMAIL_USER}>`,
    TARGET: ["mqad21@gmail.com"],
    SUBJECT: "Koneksi WA Terputus",
    TEXT: (e) => `Koneksi WA telah terputus. Error: (${e})`,
  },
};
