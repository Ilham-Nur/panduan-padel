# Testing Checklist

Checklist ini menjadi acuan testing untuk MVP. Jangan menyatakan task selesai jika test yang relevan belum dijalankan atau kegagalannya belum dilaporkan.

## Test Level

- Unit test: scoring engine, helper, repository mapper.
- Integration test: page flow, scoreboard interaction, persistence.
- E2E atau manual test: PWA, orientation, installability, responsive.
- Accessibility test: keyboard, focus, label, contrast, touch target.

## Skor 21

- [ ] Servis pertama Tim A.
- [ ] Servis pertama Tim B.
- [ ] Pergantian servis setelah 5 reli.
- [ ] Reli ke-21 kembali ke tim pertama.
- [ ] Hasil 11-10 menyelesaikan match.
- [ ] Hasil 13-8 menyelesaikan match.
- [ ] Total reli tidak boleh melebihi 21.
- [ ] Tap Tim A menambah skor Tim A.
- [ ] Tap Tim B menambah skor Tim B.
- [ ] Menekan nama pemain tidak menambah poin.
- [ ] Undo sebelum pergantian servis.
- [ ] Undo setelah pergantian servis.
- [ ] Undo dari kondisi selesai.
- [ ] Reset membutuhkan konfirmasi.
- [ ] Akhiri pertandingan membutuhkan konfirmasi.
- [ ] Area tambah poin disabled setelah match selesai.
- [ ] Timer tetap masuk akal setelah reload.

## Padel Standar

- [ ] 0 ke 15 ke 30 ke 40.
- [ ] Memenangkan game dari 40 jika lawan belum 40.
- [ ] Deuce saat 40-40 dalam mode Advantage.
- [ ] Advantage setelah poin dari Deuce.
- [ ] Kembali ke Deuce jika lawan memenangkan poin saat Advantage.
- [ ] Memenangkan game dari Advantage.
- [ ] Golden Point saat 40-40 dalam mode Golden Point.
- [ ] Memenangkan set 6-0.
- [ ] Memenangkan set 6-1.
- [ ] Memenangkan set 6-2.
- [ ] Memenangkan set 6-3.
- [ ] Memenangkan set 6-4.
- [ ] Set 7-5.
- [ ] Tie-break aktif pada 6-6.
- [ ] Tie-break minimal 7 poin dan unggul 2 poin.
- [ ] Best of 3 selesai saat satu tim menang 2 set.
- [ ] Settings terkunci setelah poin pertama.
- [ ] Servis berpindah setelah game selesai.
- [ ] Undo dari point biasa.
- [ ] Undo dari Deuce.
- [ ] Undo dari Advantage.
- [ ] Undo dari game.
- [ ] Undo dari set.
- [ ] Undo dari match selesai.
- [ ] Rules cepat Padel Standar bisa dibuka dan ditutup tanpa mereset skor.

## PWA

- [ ] Manifest tersedia.
- [ ] Manifest memiliki name dan short_name.
- [ ] Manifest memiliki icons yang valid.
- [ ] Manifest memiliki start_url.
- [ ] Manifest memiliki display mode yang sesuai.
- [ ] Service worker terdaftar.
- [ ] Offline reload berhasil setelah load pertama.
- [ ] App shell muncul offline.
- [ ] Rules content bisa dibuka offline.
- [ ] Active match pulih setelah refresh.
- [ ] Active match pulih setelah app ditutup dan dibuka.
- [ ] Perubahan portrait ke landscape pada scoreboard menampilkan scoreboard otomatis.
- [ ] Perubahan landscape ke portrait pada scoreboard menampilkan warning.
- [ ] Update service worker tidak merusak data IndexedDB.

## UI dan Responsive

- [ ] Beranda sesuai referensi Stitch.
- [ ] Beranda menampilkan pertandingan aktif yang bisa dilanjutkan jika ada skor tersimpan.
- [ ] Beranda menampilkan pertandingan terakhir jika riwayat sudah tersimpan.
- [ ] Header portrait sesuai referensi.
- [ ] Bottom navigation sesuai referensi.
- [ ] Empty state sesuai referensi.
- [ ] CTA utama hijau terang dan mudah disentuh.
- [ ] Scoreboard landscape memakai tiga area utama.
- [ ] Scoreboard landscape muat dalam satu layar.
- [ ] Score tetap sangat besar dan terbaca.
- [ ] Layar smartphone landscape kecil tidak overflow.
- [ ] Layar tablet tetap proporsional.
- [ ] Tidak ada vertical scrolling di scoreboard.
- [ ] Tombol dapat digunakan dengan sentuhan.
- [ ] Touch target minimal 48px.
- [ ] Teks tidak keluar dari container.
- [ ] State pressed terlihat.
- [ ] State disabled terlihat.
- [ ] State selected tidak hanya bergantung pada warna.
- [ ] Kontras teks cukup.

## Accessibility

- [ ] Semua tombol punya accessible name.
- [ ] Icon-only button memiliki `aria-label`.
- [ ] Edit nama pemain dapat dipakai dengan keyboard.
- [ ] Fokus keyboard terlihat.
- [ ] Modal konfirmasi fokus pada tindakan yang benar.
- [ ] Panel rules cepat bisa ditutup dengan tombol eksplisit.
- [ ] Panel rules cepat tidak menjebak user tanpa escape.
- [ ] Heading hierarchy logis.
- [ ] Tidak ada interaksi yang hanya bergantung pada hover.
- [ ] Reduced motion dihormati jika animasi ditambahkan.

## Storage

- [ ] Active match tersimpan di IndexedDB.
- [ ] Match history tersimpan di IndexedDB.
- [ ] Preferences tersimpan di IndexedDB atau localStorage hanya untuk data sangat kecil.
- [ ] Data active match serializable.
- [ ] Data history memiliki ID unik.
- [ ] Repository menangani data kosong.
- [ ] Repository menangani schema version.
- [ ] Tidak ada secret atau data sensitif tersimpan.

## Quality Gate Perubahan Kode

- [ ] Lint berhasil.
- [ ] Typecheck berhasil.
- [ ] Unit test berhasil.
- [ ] Integration test relevan berhasil.
- [ ] Build produksi berhasil.
- [ ] Tidak ada console error utama.
- [ ] Dokumentasi diperbarui.
- [ ] File yang diubah dilaporkan.
- [ ] Kegagalan test, jika ada, dilaporkan dengan jelas dan task tidak dinyatakan selesai.
