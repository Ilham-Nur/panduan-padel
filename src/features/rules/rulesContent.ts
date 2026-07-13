export type RuleCategory = {
  id: string;
  icon: string;
  title: string;
  summary: string;
  points: string[];
};

export type QuickRule = {
  title: string;
  text: string;
};

export const ruleCategories: RuleCategory[] = [
  {
    id: "dasar",
    icon: "sports_tennis",
    title: "Dasar permainan",
    summary: "Padel dimainkan 2 lawan 2 di lapangan tertutup dengan dinding kaca dan pagar.",
    points: [
      "Bola boleh memantul satu kali di lantai sebelum dikembalikan.",
      "Setelah memantul di lantai, bola boleh mengenai kaca sendiri dan tetap bisa dimainkan.",
      "Poin dimulai dari servis dan berakhir saat bola mati atau terjadi pelanggaran."
    ]
  },
  {
    id: "servis",
    icon: "front_hand",
    title: "Servis",
    summary: "Servis dilakukan dari belakang garis servis dan diarahkan silang ke kotak lawan.",
    points: [
      "Servis dilakukan underhand, kontak bola tidak boleh di atas pinggang.",
      "Bola harus memantul di lantai dulu sebelum dipukul saat servis.",
      "Servis sah jika masuk kotak servis diagonal lawan dan tidak langsung mengenai pagar."
    ]
  },
  {
    id: "kaca-pagar",
    icon: "grid_on",
    title: "Kaca dan pagar",
    summary: "Kaca bisa membantu reli, tetapi pagar punya batasan tergantung arah bola.",
    points: [
      "Bola yang memantul di lantai lalu mengenai kaca lawan masih hidup.",
      "Bola yang langsung mengenai kaca atau pagar lawan tanpa memantul di lantai adalah out.",
      "Pemain boleh memakai kaca sendiri untuk mengembalikan bola ke area lawan."
    ]
  },
  {
    id: "skor",
    icon: "scoreboard",
    title: "Skor",
    summary: "Aplikasi mendukung Skor 21 komunitas dan mode Padel Standar.",
    points: [
      "Skor 21: setiap reli bernilai 1 poin dan match selesai saat total reli mencapai 21.",
      "Padel Standar: memakai urutan 0, 15, 30, 40, deuce, advantage, game, dan set.",
      "Servis Skor 21 berpindah setiap 5 reli berdasarkan total reli, bukan pemenang reli."
    ]
  },
  {
    id: "kesalahan",
    icon: "warning",
    title: "Kesalahan umum",
    summary: "Beberapa kesalahan kecil sering terjadi saat pemain baru mulai bermain.",
    points: [
      "Memukul bola setelah dua kali pantul di lantai sendiri.",
      "Servis terlalu tinggi atau tidak diarahkan silang ke kotak lawan.",
      "Menganggap semua bola yang menyentuh kaca sebagai out, padahal setelah pantul lantai bola masih bisa hidup."
    ]
  },
  {
    id: "faq",
    icon: "help",
    title: "FAQ pemula",
    summary: "Jawaban cepat untuk kebingungan paling umum di lapangan.",
    points: [
      "Boleh volley, kecuali saat menerima servis sebelum bola memantul.",
      "Bola boleh mengenai kaca sendiri setelah dipukul, selama akhirnya masuk ke area lawan.",
      "Jika ragu, ulangi poin hanya jika semua pemain sepakat."
    ]
  }
];

export const quickScore21Rules: QuickRule[] = [
  {
    title: "Tambah poin",
    text: "Ketuk kartu Tim A atau Tim B. Setiap reli selalu bernilai 1 poin."
  },
  {
    title: "Target match",
    text: "Match Skor 21 selesai saat total skor kedua tim mencapai 21 reli."
  },
  {
    title: "Giliran servis",
    text: "Servis berpindah setiap 5 reli: 1-5, 6-10, 11-15, 16-20, lalu reli ke-21 kembali ke server pertama."
  },
  {
    title: "Undo",
    text: "Tombol Batal mengembalikan skor, reli, server, sisa servis, dan status match ke poin sebelumnya."
  },
  {
    title: "Simpan hasil",
    text: "Setelah match selesai, tekan Simpan & Main Lagi agar hasil masuk ke Riwayat dan scoreboard kembali baru."
  }
];

export const quickStandardRules: QuickRule[] = [
  {
    title: "Tambah poin",
    text: "Ketuk kartu Tim A atau Tim B. Skor poin berjalan 0, 15, 30, 40, lalu game."
  },
  {
    title: "Deuce dan advantage",
    text: "Pada mode Advantage, skor 40-40 menjadi Deuce. Tim harus ambil Advantage lalu menang satu poin lagi untuk mengambil game."
  },
  {
    title: "Golden point",
    text: "Pada mode Golden, saat Deuce poin berikutnya langsung menentukan pemenang game."
  },
  {
    title: "Game, set, dan tie-break",
    text: "Set dimenangkan saat unggul minimal 2 game. Jika 6-6, tie-break dimainkan sampai minimal 7 poin dan unggul 2 poin."
  },
  {
    title: "Servis",
    text: "Servis berpindah setelah game selesai. Saat tie-break, giliran server mengikuti hitungan poin tie-break."
  },
  {
    title: "Undo dan simpan",
    text: "Tombol Batal mengembalikan poin terakhir. Setelah selesai, Simpan & Main Lagi memasukkan hasil ke Riwayat dan membuka match baru."
  }
];
