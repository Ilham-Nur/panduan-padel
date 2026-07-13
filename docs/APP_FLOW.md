# App Flow

## Prinsip Flow

Aplikasi harus cepat dipakai tanpa setup panjang. Nama pemain, servis pertama, dan pengaturan awal dilakukan langsung di scoreboard sebelum poin pertama.

Tidak perlu halaman terpisah untuk:

- Input nama pemain.
- Menentukan pemenang suit.
- Memilih tim yang mendapat poin.
- Memilih tim servis melalui setup panjang.

## Route Target

Route final dapat disesuaikan saat implementasi React, tetapi struktur awal yang disarankan:

| Route | Orientasi | Tujuan |
| --- | --- | --- |
| `/` | Portrait | Beranda |
| `/match/new` | Portrait | Pilih Sistem Skor |
| `/match/score-21` | Landscape wajib | Scoreboard Skor 21 |
| `/match/standard` | Landscape wajib | Scoreboard Padel Standar |
| `/rules` | Portrait | Daftar kategori rules |
| `/rules/:category` | Portrait | Detail rules |
| `/history` | Portrait | Riwayat pertandingan |
| `/info` | Portrait | Info aplikasi |
| `/settings` | Portrait | Redirect lama ke Info aplikasi |

## Flow Utama

```text
Beranda
-> Mulai Pertandingan
-> Pilih Sistem Skor
-> Pilih Skor 21 atau Padel Standar
-> Jika portrait: Mohon Putar Perangkat
-> Jika landscape: Scoreboard
-> Pertandingan selesai
-> Simpan hasil atau main lagi
-> Riwayat pertandingan
```

## Flow Rules

```text
Beranda
-> Belajar Rules
-> Pilih kategori
-> Baca penjelasan
```

Kategori awal yang disarankan:

- Dasar permainan.
- Servis.
- Kaca dan pagar.
- Skor.
- Kesalahan umum.
- FAQ pemula.

Konten awal dapat diambil dari halaman HTML lama di repository.

## Flow Rules Saat Pertandingan

```text
Scoreboard
-> Tekan Rules
-> Buka panel rules cepat
-> Tutup panel
-> Kembali ke scoreboard tanpa kehilangan state
```

Rules cepat harus berupa panel atau sheet di route yang sama, bukan route terpisah. Active match state tidak boleh reset saat panel dibuka.

## Flow Scoreboard

1. Masuk scoreboard.
2. Jika belum ada active match untuk mode tersebut, buat draft match lokal.
3. Tampilkan nama default Tim A dan Tim B.
4. Izinkan edit nama pemain langsung di area nama.
5. Izinkan pilih servis pertama sebelum poin pertama.
6. Tap area Tim A atau Tim B menambah poin.
7. Timer mulai saat poin pertama atau saat user menekan start jika mode timer eksplisit dipilih.
8. Undo mengembalikan state poin terakhir.
9. Reset meminta konfirmasi dan membuat match kosong.
10. Akhiri pertandingan meminta konfirmasi.
11. Saat pertandingan selesai, area tambah poin disabled.
12. User bisa simpan hasil atau main lagi.

## Orientation Guard

Orientation guard hanya aktif di route scoreboard:

- Jika `window.matchMedia("(orientation: portrait)")` bernilai true, tampilkan warning.
- Jika berubah ke landscape, render scoreboard otomatis.
- State tetap ada di store dan IndexedDB.
- Jangan mengunci orientasi browser.

Halaman warning:

- Full viewport.
- Icon rotasi besar.
- Judul "Mohon Putar Perangkat".
- Deskripsi "Aplikasi ini dioptimalkan untuk tampilan lanskap (mendatar)."

## Active Match Recovery

Active match harus dipulihkan saat:

- Aplikasi ditutup lalu dibuka.
- Browser refresh.
- Perangkat berubah orientasi.
- Service worker melayani offline reload.

Saat membuka aplikasi dan ada active match belum selesai:

- Beranda boleh menampilkan card "Lanjutkan Pertandingan".
- Tombol lanjut membawa user ke route scoreboard mode terkait.
- Jika route scoreboard dibuka portrait, tetap tampilkan warning.

## Riwayat Pertandingan

Flow riwayat:

```text
Match selesai
-> Simpan hasil
-> IndexedDB match history
-> Riwayat pertandingan menampilkan ringkasan
-> User dapat membuka detail ringkas
```

Data minimal:

- ID match.
- Mode skor.
- Nama tim dan pemain.
- Skor akhir.
- Pemenang.
- Durasi.
- Waktu mulai dan selesai.
- Event history atau ringkasan event.

## Info Aplikasi

Halaman info MVP menampilkan:

- Logo dan nama aplikasi SkorPadelKu.
- Ringkasan fungsi utama aplikasi.
- Dukungan komunitas The Padel$.
- Catatan data lokal dan offline.

Jangan menambahkan pengaturan akun, sinkronisasi, klub, atau online service.
