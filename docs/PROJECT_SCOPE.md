# Project Scope

## Tujuan Produk

Produk ini adalah PWA mobile-first untuk scoring dan panduan rules padel pemula. Aplikasi harus cepat dipakai di lapangan, tetap bekerja secara offline, dan konsisten dengan referensi UI Stitch.

Nama aplikasi saat ini: **SkorPadelKu**.

## Target Pengguna

- Pemain padel pemula.
- Komunitas padel.
- Pemain yang membutuhkan score counter cepat.
- Pengguna smartphone di lapangan indoor atau outdoor.
- Pengguna yang ingin membaca rules singkat sebelum atau saat bermain.

## Masalah yang Diselesaikan

- Pemain pemula sering bingung tentang skor, servis, deuce, advantage, dan tie-break.
- Komunitas membutuhkan penghitung skor cepat tanpa setup panjang.
- Pengguna di lapangan butuh tampilan skor besar dan terbaca.
- Koneksi internet di lapangan tidak selalu stabil.
- Riwayat pertandingan perlu tersimpan tanpa akun atau backend.

## Ruang Lingkup MVP

MVP mencakup:

- Beranda.
- Pilih Sistem Skor.
- Guard orientasi untuk scoreboard.
- Scoreboard Skor 21 landscape.
- Scoreboard Padel Standar landscape.
- Edit nama pemain langsung di scoreboard.
- Pilih servis pertama langsung di scoreboard.
- Tambah poin melalui tap area kartu tim.
- Undo, reset, akhiri pertandingan, dan timer.
- Pergantian servis otomatis.
- Rules cepat di dalam scoreboard.
- Halaman belajar rules padel.
- Riwayat pertandingan offline.
- IndexedDB untuk active match, history, dan preferences.
- Offline dasar, manifest, service worker, dan installable PWA.
- Responsive smartphone dan tablet.

## Out of Scope

Tidak termasuk MVP:

- Login, registrasi, backend, REST API, database server, cloud synchronization.
- Booking lapangan, pembayaran, ranking pemain, tournament management.
- Chat, social feed, AI chatbot, push notification online.
- Integrasi smartwatch, Play Store, App Store, multi-club management.
- Statistik pemain tingkat lanjut.

## Asumsi

- Repository saat ini masih berupa website statis HTML, CSS, dan JavaScript vanilla.
- Belum ada `package.json`, sehingga belum ada framework aktif.
- Implementasi berikutnya boleh menggunakan React, TypeScript, Vite, React Router, IndexedDB, dan plugin PWA Vite.
- Materi rules dari website lama dapat digunakan sebagai sumber konten awal.
- Referensi Stitch yang tersedia terdiri dari dua screenshot, dua mockup HTML, dan satu `DESIGN.md`.
- APK native belum dibuat pada MVP ini; PWA installable disiapkan agar bisa dipaketkan sebagai APK wrapper pada tahap terpisah.

## Batasan Teknis

- Tidak ada backend.
- Semua data MVP disimpan lokal.
- IndexedDB adalah penyimpanan utama untuk active match, history, dan preferences.
- LocalStorage hanya untuk preferensi sangat kecil jika memang diperlukan.
- Scoreboard tidak boleh membutuhkan vertical scrolling dalam landscape.
- Scoreboard harus bisa pulih setelah refresh, app tertutup, atau orientasi berubah.
- Jangan mengunci orientasi seluruh aplikasi.

## Kriteria Penerimaan

MVP dapat diterima jika:

- Pengguna bisa memulai match Skor 21 dan Padel Standar.
- Scoreboard hanya tampil saat landscape.
- Saat portrait pada route scoreboard, halaman "Mohon Putar Perangkat" tampil.
- Poin dapat ditambah dengan tap kartu Tim A atau Tim B.
- Nama pemain dan servis pertama dapat diatur langsung di scoreboard.
- Undo mengembalikan state lengkap.
- Match selesai dapat disimpan ke riwayat.
- Active match pulih setelah reload.
- Aplikasi bisa dibuka offline setelah load pertama.
- UI konsisten dengan Stitch Kinetic Court.

## Risiko Pengembangan

- Aturan Padel Standar lebih kompleks dari Skor 21 dan harus diuji sebagai domain engine terpisah.
- Perbedaan ukuran smartphone landscape dapat menyebabkan overflow jika layout tidak diuji sejak awal.
- IndexedDB dan service worker dapat membuat bug state stale jika strategi cache tidak jelas.
- Migrasi dari website statis ke React perlu menjaga konten rules lama agar tidak hilang.
- Font dan icon dari CDN dapat mengganggu offline jika tidak dipaketkan atau diberi fallback.
- Scope creep mudah terjadi karena aplikasi scoring bisa berkembang ke booking, ranking, atau turnamen. Fitur tersebut tetap out of scope.
