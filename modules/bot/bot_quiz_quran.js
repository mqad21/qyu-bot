const { MessageType } = require("@adiwajshing/baileys");
const { VERSES } = require("../../commons/constants");
const { QURAN_QUIZ } = require("../../configs/bot");
const random = require("../random_number");
const removeStopwords = require("../remove_stopwords");
const _ = require("lodash");
const hideWord = require("../hide_word");
const sendDonationMessage = require("../send_donation_message");

const users = {};
module.exports = async (message, conn) => {
  const jid = message.key.remoteJid;
  if (message.message) {
    try {
      const conversation = message.message.conversation;
      if (conversation == "/qq") {
        // Get random ayah.
        const surah = random(1, 114);
        const ayah = random(1, VERSES[surah].ayah);
        const data = require(`../../commons/quran/${surah}.json`)[surah];
        let quran = {
          description: `Quran Surah ${VERSES[surah].name} ayat ${ayah}`,
          arabic: data.text[ayah],
          indonesian: data.translations.id.text[ayah],
        };

        // Make question.
        const words = _.words(removeStopwords(quran.indonesian), /['-\w]+/g);
        const selectedWord = _.sample(words);
        const replacedWord = hideWord(selectedWord, 0.7);
        const question = quran.indonesian.replace(selectedWord, ".....");
        const message = `${quran.description}\n\n${quran.arabic}\n\n${question}\n\nPetunjuk: ${replacedWord}`;

        await conn.sendMessage(jid, message, MessageType.text);
        users[jid] = selectedWord;

        // Send donation message.
        await sendDonationMessage(jid, conn);
      } else if (users[jid]) {
        const isTrue = conversation.toLowerCase() == users[jid].toLowerCase();
        if (isTrue) {
          await conn.sendMessage(jid, QURAN_QUIZ.TEXT.TRUE, MessageType.text);
        } else {
          await conn.sendMessage(
            jid,
            QURAN_QUIZ.TEXT.FALSE(users[jid]),
            MessageType.text
          );
        }

        delete users[jid];
      }
    } catch (e) {
      console.error(e);
    }
  }
};
