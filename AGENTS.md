# AGENTS.md

Dokumen ini adalah aturan utama untuk semua agent AI yang bekerja di repository ini. Sebelum mengedit kode, baca file ini dan dokumen terkait di `docs/`.

## 1. Tujuan Aplikasi

Aplikasi ini adalah PWA mobile-first untuk komunitas padel pemula. Fokus produk:

- Menghitung skor pertandingan padel dengan cepat di lapangan.
- Menyediakan panduan rules padel yang mudah dipahami pemula.
- Menyimpan riwayat pertandingan secara offline.
- Menjadi dasar yang bisa dipaketkan sebagai APK wrapper PWA di tahap berikutnya.

## 2. Ruang Lingkup MVP

Fitur MVP:

- Halaman Beranda.
- Halaman Pilih Sistem Skor.
- Halaman Mohon Putar Perangkat.
- Scoreboard Skor 21 dalam orientasi landscape.
- Scoreboard Padel Standar dalam orientasi landscape.
- Edit nama pemain langsung di scoreboard.
- Pilih servis pertama langsung di scoreboard.
- Tambah poin dengan menekan area kartu Tim A atau Tim B.
- Undo poin terakhir.
- Reset pertandingan.
- Akhiri pertandingan.
- Timer pertandingan.
- Pergantian servis otomatis.
- Rules cepat yang dapat dibuka saat pertandingan.
- Halaman belajar rules padel.
- Riwayat pertandingan.
- Penyimpanan lokal menggunakan IndexedDB.
- Dukungan offline dasar.
- Web app manifest.
- Service worker.
- Installable PWA.
- Responsive untuk smartphone dan tablet.

## 3. Fitur yang Dilarang Ditambahkan Tanpa Instruksi Eksplisit

Jangan menambahkan:

- Login, registrasi, backend, REST API, database server, atau cloud synchronization.
- Booking lapangan, pembayaran, ranking pemain, tournament management, chat, social feed, atau AI chatbot.
- Push notification online, integrasi smartwatch, integrasi Play Store/App Store, multi-club management, atau statistik pemain tingkat lanjut.

Jangan mengarang requirement. Jika requirement ambigu, catat asumsi secara eksplisit dan batasi implementasi pada MVP.

## 4. Referensi UI Wajib

Gunakan referensi dalam folder `stitch_padel_score_pwa_interface/stitch_padel_score_pwa_interface/`:

- `beranda_padel_score/screen.png`
- `scoreboard_skor_21_landscape/screen.png`
- `scoreboard_skor_21_landscape/code.html`
- `beranda_padel_score/code.html`
- `kinetic_court/DESIGN.md`

Catatan audit: repository saat ini memiliki dua file `screen.png`. Referensi ketiga untuk sistem desain berasal dari mockup HTML scoreboard dan `kinetic_court/DESIGN.md`.

Jangan mengubah arah desain menjadi desain baru. Pertahankan gaya clean modern-sport, latar putih atau abu-abu sangat muda, aksen hijau terang, teks utama navy gelap, kartu rounded, bayangan lembut, tombol besar, dan hierarchy teks yang jelas.

## 5. Aturan Orientasi

- Halaman umum menggunakan portrait: Beranda, Pilih Sistem Skor, Rules, Riwayat, Pengaturan.
- Scoreboard wajib menggunakan landscape: Skor 21 dan Padel Standar.
- Jika scoreboard dibuka dalam portrait, tampilkan halaman "Mohon Putar Perangkat".
- Jangan menampilkan scoreboard yang dipaksakan dalam portrait.
- Setelah perangkat diputar ke landscape, scoreboard muncul otomatis tanpa kehilangan state.
- Jangan mengunci orientasi seluruh aplikasi.
- Orientasi landscape hanya diwajibkan pada route scoreboard.

## 6. Aturan Skor 21

Mode Skor 21 adalah aturan komunitas:

- Setiap reli menghasilkan 1 poin.
- Total reli adalah skor Tim A + skor Tim B.
- Pertandingan selesai saat total reli mencapai 21.
- Tidak ada deuce, game, atau set.
- Area Tim A menambah poin Tim A.
- Area Tim B menambah poin Tim B.
- Servis berganti berdasarkan jumlah reli, bukan pemenang reli.
- Jika Tim A servis pertama: reli 1-5 Tim A, 6-10 Tim B, 11-15 Tim A, 16-20 Tim B, 21 Tim A.
- Jika Tim B servis pertama, urutan dibalik.
- Undo wajib mengembalikan skor, total reli, server, sisa servis, status pertandingan, dan pemenang.
- Simpan riwayat setiap poin sebagai event history atau snapshot history.

## 7. Aturan Padel Standar

Mode standar mendukung:

- 0, 15, 30, 40, Deuce, Advantage, Game, Set.
- Tie-break saat 6-6, minimal 7 poin dan unggul 2 poin.
- Golden Point sebagai opsi.
- Format pertandingan: 1 Set dan Best of 3 Set.
- Pengaturan awal dilakukan langsung dari scoreboard sebelum poin pertama.
- Setelah poin pertama dicatat, pengaturan pertandingan dikunci.
- Servis berpindah setelah satu game selesai.
- Undo wajib mengembalikan point, deuce, advantage, game, set, tie-break, server, dan status pertandingan.

Pisahkan scoring engine dari komponen tampilan. Scoring engine harus berupa pure functions atau domain module yang dapat diuji tanpa browser.

## 8. Prinsip Arsitektur

Jika framework belum ada, gunakan:

- React
- TypeScript
- Vite
- React Router
- IndexedDB
- Plugin PWA yang kompatibel dengan Vite
- CSS Modules, Tailwind, atau sistem styling yang dipilih secara konsisten

Struktur target:

```text
src/
  app/
  pages/
  components/
  features/
    match/
    score21/
    standard-score/
    rules/
    history/
  domain/
    scoring/
  storage/
  hooks/
  stores/
  types/
  styles/
```

Jangan menyimpan seluruh logika pertandingan di satu komponen React. Pisahkan UI state, active match state, dan persistent history state.

## 9. Aturan TypeScript

- Utamakan TypeScript strict mode.
- Hindari `any` kecuali ada alasan eksplisit dan diberi catatan.
- Gunakan union type untuk mode skor, status match, dan status server.
- Domain scoring harus pure dan deterministic.
- Jangan mengandalkan DOM atau browser API di domain scoring.
- Validasi input user sebelum disimpan ke state aktif atau IndexedDB.

## 10. Aturan Testing

Setiap perubahan fitur harus disertai test yang sepadan dengan risiko:

- Unit test untuk scoring engine.
- Integration test untuk flow scoreboard dan persistence.
- PWA test untuk service worker, manifest, offline reload, dan pemulihan active match.
- Responsive dan accessibility review untuk portrait, landscape kecil, dan tablet.

Setelah perubahan kode, jalankan lint, typecheck, test, dan build. Jangan menyatakan selesai jika salah satu gagal.

## 11. Aturan Aksesibilitas

- Semua tombol harus punya nama aksesibel.
- Touch target minimum 48px.
- Jangan membuat interaksi yang hanya bergantung pada hover.
- Form edit nama pemain harus bisa dipakai dengan keyboard.
- Konfirmasi reset dan akhiri pertandingan harus jelas.
- Gunakan fokus yang terlihat untuk keyboard navigation.
- Pastikan kontras teks cukup pada latar terang dan kartu putih.
- Panel rules cepat harus bisa ditutup dengan tombol eksplisit dan keyboard.

## 12. Aturan Perubahan Dependency

- Jangan menambah dependency tanpa memeriksa apakah solusi sudah tersedia.
- Jangan mengganti framework, package manager, atau struktur proyek tanpa alasan kuat.
- Karena repository saat ini belum memiliki `package.json`, keputusan package manager dibuat saat fase scaffolding React.
- Dokumentasikan alasan setiap dependency baru.
- Jangan memasukkan secret, credential, token, atau file konfigurasi privat ke repository.

## 13. Aturan Dokumentasi

- Perbarui dokumen terkait jika requirement, flow, design token, arsitektur, atau scoring rule berubah.
- Catat asumsi secara eksplisit.
- Jangan menghapus fitur lama tanpa instruksi.
- Laporkan file yang diubah dan hasil pengujian.

## 14. Definition of Done

Sebuah task hanya selesai jika:

- Sesuai ruang lingkup MVP.
- Tidak merusak flow yang sudah ada.
- Tidak menyimpang dari desain referensi.
- TypeScript tidak memiliki error.
- Lint berhasil.
- Test berhasil.
- Build produksi berhasil.
- Tidak ada secret.
- Tidak ada console error utama.
- Responsive sudah diperiksa.
- Dokumentasi diperbarui.
- Perubahan diringkas dengan jelas.

## 15. Larangan Desain dan Refactor

- Jangan mengubah desain tanpa alasan yang jelas dan terdokumentasi.
- Jangan melakukan refactor besar yang tidak berkaitan dengan tugas.
- Jangan hardcode style yang sama berulang kali di banyak komponen.
- Gunakan design token terpusat untuk warna, spacing, radius, shadow, typography, transition, dan minimum touch target.

## 16. Urutan Kerja Wajib

Sebelum coding:

1. Baca `AGENTS.md`.
2. Baca dokumen terkait di `docs/`.
3. Audit file yang akan disentuh.
4. Catat asumsi jika requirement ambigu.
5. Buat perubahan kecil dan terarah.
6. Jalankan lint, typecheck, test, dan build.
7. Laporkan file yang diubah dan hasil verifikasi.
