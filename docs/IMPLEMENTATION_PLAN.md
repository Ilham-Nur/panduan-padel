# Implementation Plan

## Phase 0: Audit, Dokumentasi, Design Tokens, Domain Model

Tujuan:

- Menetapkan batas pengembangan sebelum coding fitur besar.
- Mendokumentasikan scope, UI, flow, rules, arsitektur, plan, dan testing.
- Menyiapkan domain model awal.

Task:

- Audit repository.
- Buat `AGENTS.md`.
- Buat dokumen di `docs/`.
- Ekstrak design token dari Stitch.
- Rancang tipe domain awal untuk match dan scoring.

Dependency:

- Referensi Stitch tersedia.
- Scope MVP disepakati.

Acceptance criteria:

- Semua dokumen wajib ada.
- Desain tidak menyimpang dari referensi.
- Tidak ada dependency yang diubah.
- Tidak ada fitur besar yang diimplementasikan.

Test requirement:

- Review manual dokumen.
- Pastikan file yang diminta tersedia.

## Phase 1: Scaffolding React, Routing, Layout Portrait, Orientation Guard

Tujuan:

- Membuat fondasi React PWA tanpa scoring kompleks.

Task:

- Setup React + TypeScript + Vite.
- Setup React Router.
- Setup design tokens dan global style.
- Buat layout portrait: header, bottom nav, card, button.
- Buat halaman Beranda.
- Buat halaman Pilih Sistem Skor.
- Buat halaman Mohon Putar Perangkat.
- Buat OrientationGuard untuk route scoreboard.

Dependency:

- Phase 0 selesai.
- Package manager dipilih.

Acceptance criteria:

- Route umum tampil portrait.
- Route scoreboard menampilkan warning saat portrait.
- Layout memakai token desain.
- Tidak ada fitur out of scope.

Test requirement:

- Typecheck.
- Build.
- Smoke test route.
- Manual responsive portrait dan landscape.

## Phase 2: Score 21 Engine, Scoreboard Landscape, Undo, Service Rotation, Persistence

Tujuan:

- Mengimplementasikan mode Skor 21 end to end.

Task:

- Buat pure scoring engine Skor 21.
- Buat unit test Skor 21.
- Buat scoreboard landscape tiga kolom.
- Implement tap kartu Tim A/Tim B.
- Implement edit nama pemain.
- Implement pilih servis pertama.
- Implement undo.
- Implement reset dan akhiri dengan konfirmasi.
- Implement timer.
- Simpan active match ke IndexedDB.
- Pulihkan active match setelah reload.

Dependency:

- Phase 1 selesai.
- IndexedDB repository dasar tersedia.

Acceptance criteria:

- Total reli mencapai 21 lalu match selesai.
- Servis berganti setiap 5 reli sesuai server pertama.
- Undo mengembalikan state lengkap.
- Scoreboard muat satu layar landscape.
- Portrait route scoreboard tetap menampilkan warning.

Test requirement:

- Unit test engine.
- Integration test basic scoreboard.
- Manual test landscape kecil dan tablet.
- Persistence reload test.

## Phase 3: Standard Scoring Engine dan Standard Landscape Scoreboard

Tujuan:

- Mengimplementasikan mode Padel Standar dengan aturan utama.

Task:

- Buat pure scoring engine Padel Standar.
- Implement 0, 15, 30, 40.
- Implement deuce dan advantage.
- Implement golden point.
- Implement game, set, match.
- Implement tie-break 6-6.
- Implement format 1 Set dan Best of 3 Set.
- Buat scoreboard landscape standar.
- Lock settings setelah poin pertama.
- Implement undo lengkap.

Dependency:

- Phase 2 selesai atau storage dan layout scoreboard sudah stabil.

Acceptance criteria:

- Engine lulus skenario deuce, advantage, golden point, game, set, tie-break.
- UI scoreboard standar memakai desain yang sama dengan Skor 21.
- Undo dari game, set, dan match selesai valid.

Test requirement:

- Unit test engine lengkap.
- Integration test scoreboard standar.
- Manual responsive landscape.

## Phase 4: Rules, Quick Rules, History, Preferences

Tujuan:

- Menambahkan materi belajar dan riwayat match.

Task:

- Migrasikan konten rules lama ke struktur data React.
- Buat halaman Rules dan detail kategori.
- Buat quick rules panel di scoreboard.
- Buat repository match history.
- Simpan hasil match selesai.
- Buat halaman Riwayat.
- Buat preferensi MVP sederhana.

Dependency:

- Phase 2 untuk match history Skor 21.
- Phase 3 untuk history Padel Standar.

Acceptance criteria:

- Rules dapat dibaca offline.
- Quick rules tidak mereset scoreboard.
- Match selesai tersimpan di riwayat.
- Riwayat tampil walau offline.

Test requirement:

- Integration test quick rules.
- Storage test match history.
- Manual offline read.

## Phase 5: PWA, Offline, Installation, Active Match Recovery

Tujuan:

- Membuat aplikasi installable dan reliable offline.

Task:

- Tambahkan web app manifest.
- Tambahkan service worker statis melalui Vite `public/`.
- Precache app shell dan rules content.
- Pastikan offline reload bekerja.
- Pastikan active match recovery bekerja.
- Tambahkan icon PWA yang sesuai brand.
- Review installability.

Dependency:

- Phase 1 sampai 4 cukup stabil.

Acceptance criteria:

- Browser mengenali aplikasi sebagai installable PWA.
- App bisa reload offline setelah load pertama.
- Active match pulih setelah refresh atau app ditutup.
- Manifest memiliki name, short_name, icons, start_url, display, theme_color, dan background_color.

Test requirement:

- PWA audit.
- Manual offline reload.
- Service worker update smoke test.
- Manifest validation.

## Phase 6: Testing, Accessibility, Responsive Review, Production Build

Tujuan:

- Menyiapkan MVP untuk review dan penggunaan awal.

Task:

- Lengkapi test coverage scoring engine.
- Review accessibility.
- Review landscape smartphone kecil.
- Review tablet.
- Cek keyboard accessibility edit nama.
- Cek console error.
- Jalankan lint, typecheck, test, dan build.
- Perbarui dokumentasi hasil.

Dependency:

- Phase 1 sampai 5 selesai.

Acceptance criteria:

- Semua quality gates pass.
- Tidak ada overflow utama.
- UI konsisten dengan Stitch.
- Dokumentasi up to date.

Test requirement:

- Lint.
- Typecheck.
- Unit test.
- Integration test.
- Production build.
- Manual PWA dan responsive checklist.
