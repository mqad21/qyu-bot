const baileys = require("@adiwajshing/baileys");
const { WA_STATUS } = require("../commons/constants.js");
const states = require("../commons/states.js");
const { MessageType } = baileys;

const sendText = (id, text) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (states.connection.status !== WA_STATUS.CONNECTED)
        throw "WhatsApp is disconnected.";
      const { conn } = require("./wa_connection.js");
      const result = await conn.sendMessage(id, text, MessageType.text);
      resolve(result);
    } catch (e) {
      if (e.hasOwnProperty("context")) e = e.context.message;
      reject(e);
    }
  });
};

module.exports = sendText;
