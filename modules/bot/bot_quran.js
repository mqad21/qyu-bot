const { MessageType } = require("@adiwajshing/baileys");
const { default: axios } = require("axios");
const { VERSES, SURAH } = require("../../commons/constants");
const _ = require("lodash");
const db = require("../database");
const sendDonationMessage = require("../send_donation_message");

module.exports = async (message, conn) => {
  const jid = message.key.remoteJid;
  if (message.message) {
    try {
      const conversation = message.message.conversation.toLowerCase();
      key = "/qs";
      if (_.startsWith(conversation, key)) {
        key = conversation.split(" ")[0];
        const query = _.trimStart(conversation, key).trim();
        let separator = " ";
        if (query.includes("ayat")) {
          separator = "ayat";
        } else if (query.includes(":")) {
          separator = ":";
        }
        const splitted = query.split(separator);

        const ayah = splitted.pop().trim();
        if (isNaN(ayah)) throw "wrongformat";

        const surah = splitted.join("").trim();
        let surahNumber = surah;
        if (isNaN(surah)) {
          surahNumber = SURAH[surah];
        }
        if (!surahNumber) throw "wrongformat";

        if (ayah > VERSES[surahNumber].ayah) throw "notfound";

        const data = require(`../../commons/quran/${surahNumber}.json`)[
          surahNumber
        ];

        const quran = {
          description: `Quran Surah ${VERSES[surahNumber].name} ayat ${ayah}`,
          arabic: data.text[ayah],
          indonesian: data.translations.id.text[ayah],
          tafsir: data.tafsir.id.kemenag.text[ayah].replace(/‘/g, "'"),
        };

        if (conversation.includes("/qsa") || conversation.includes("/qsta")) {
          const response = await axios(
            `http://api.alquran.cloud/v1/ayah/${surahNumber}:${ayah}/ar.alafasy`
          );
          quran.audio = response.data.data.audio.replace("https", "http");
        }

        const message = `${quran.description}\n\n${quran.arabic}\n\n${quran.indonesian}`;

        await conn.sendMessage(jid, message, MessageType.text);

        if (conversation.includes("/qst") || conversation.includes("/qsat")) {
          await conn.sendMessage(
            jid,
            `Tafsir:\n\n${quran.tafsir}\n\n_- Tafsir Tahlili Kemenag RI_`,
            MessageType.text
          );
        }

        if (conversation.includes("/qsa") || conversation.includes("/qsta")) {
          await conn.sendMessage(jid, { url: quran.audio }, MessageType.audio);
        }

        // Send donation message.
        await sendDonationMessage(jid, conn);
      }
    } catch (e) {
      if (e == "notfound") {
        await conn.sendMessage(jid, "Ayat tidak ditemukan.", MessageType.text);
      } else if (e == "wrongformat") {
        await conn.sendMessage(
          jid,
          "Format yang dimasukkan salah.",
          MessageType.text
        );
      }
      console.error(e);
    }
  }
};
