const { MessageType } = require("@adiwajshing/baileys");
const { DONATE } = require("../configs/bot");
const db = require("./database");

module.exports = async (jid, conn) => {
  const lastCount = db.getData(`/${jid}/count`) + 1;
  db.push(`/${jid}/count`, lastCount);
  if (lastCount > 0) {
    if (lastCount == 3 || (lastCount >= 8 && lastCount % DONATE.DELAY == 0)) {
      await conn.sendMessage(jid, DONATE.TEXT, MessageType.text);
    }
  }
};
