exports.KEYWORDS = {
  INTRO: '/mulai',
  QURAN: '/qs',
  QURAN_QUIZ: '/qq'
}

exports.STICKER = {
  FAILED: 'Gagal membuat sticker.'
}

exports.INTRO = {
  LINK: 'https://mqad21.com/qyu-bot',
  get MESSAGE() {
    return `*[Selamat Datang di Qyu-Bot]*\n\nHarap baca syarat dan ketentuan sebelum menggunakan bot ini melalui tautan berikut:\n${this.LINK}`
  },
  GUIDE: {
    TEXT: 'Fitur Qyu-Bot',
    POSTER: './assets/poster.png'
  },
  ERROR: {
    TEXT: 'Ketik */mulai* untuk menggunakan bot ini.'
  }
}

exports.DELAY = {
  IMAGE: 0.5 * 60,
  VIDEO: 3 * 60,
  ALERT(type, minutes, seconds) {
    return `Sticker ${type} dapat dibuat lagi dalam ${minutes} menit ${seconds} detik.`
  }
}

exports.DONATE = {
  get TEXT() {
    return `Kamu suka dengan bot ini? Ayo dukung Qyu-Bot untuk terus berkembang melalui tautan berikut.\n\n${this.LINK}\n\nKamu juga dapat membagikan link bot ini ke teman-teman kamu (wa.me/6289653482393).`
  },
  LINK: 'https://saweria.co/mqad21',
  DELAY: 10 // modulus
}

exports.QURAN_QUIZ = {
  TEXT: {
    TRUE: 'Selamat jawaban Anda benar.\nبارك الله فيكم',
    FALSE(answer) {
      return `Maaf jawaban Anda kurang tepat. Jawaban yang benar adalah *"${answer}"*.\nبارك الله فيكم`
    }
  }
}
