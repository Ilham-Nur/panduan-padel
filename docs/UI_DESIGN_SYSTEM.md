# UI Design System

## Sumber Referensi

Referensi yang ditemukan di repository:

1. `beranda_padel_score/screen.png`
   - Screenshot portrait 609x1600.
   - Menampilkan header, CTA utama, menu cards, empty state, dan bottom navigation.
2. `scoreboard_skor_21_landscape/screen.png`
   - Screenshot 706x1600 yang menampilkan guard "Mohon Putar Perangkat".
   - Menjadi referensi halaman portrait warning.
3. `beranda_padel_score/code.html`, `scoreboard_skor_21_landscape/code.html`, dan `kinetic_court/DESIGN.md`
   - Menjadi referensi struktur scoreboard landscape, token warna, typography, spacing, radius, dan pola interaksi.

Catatan: nilai warna dan typography di bawah berasal dari file HTML dan `DESIGN.md` saat tersedia. Observasi seperti ukuran kartu dari screenshot dicatat sebagai interpretasi visual, bukan pengukuran pixel-perfect.

## Analisis Visual

### Beranda

- Latar menggunakan abu-abu sangat muda.
- Header putih dengan logo/icon kiri, judul hijau di tengah, info aplikasi di kanan.
- CTA utama sangat menonjol: hijau terang, tinggi besar, rounded besar, icon olahraga di kiri teks.
- Menu sekunder berupa kartu putih rounded, icon tile lavender muda, judul gelap, deskripsi abu/navy.
- Empty state menggunakan border dashed lembut, icon ekspresif, teks utama dan teks pendukung.
- Bottom navigation fixed dengan item aktif berupa pill hijau terang.

### Mohon Putar Perangkat

- Layout sangat minimal dan centered.
- Icon rotasi besar berwarna hijau tua.
- Judul besar Montserrat hitam/navy.
- Deskripsi body lebih kecil, warna hijau/navy redup.
- Tidak ada kartu pembungkus, sehingga pesan terasa langsung dan jelas.

### Scoreboard Landscape

- Layout tiga kolom: Tim A, informasi pertandingan, Tim B.
- Kartu Tim A dan Tim B mengisi ruang paling besar.
- Skor memakai typography sangat besar.
- Nama tim dan pemain berada di bagian atas kartu.
- Area kartu adalah target tap untuk tambah poin.
- Kolom tengah berisi progress, servis/status, dan tombol aksi.
- Tombol Undo, Rules, dan Menu mudah dijangkau di bawah.

## Design Tokens

Token harus dipusatkan di satu tempat, misalnya `src/styles/tokens.css` atau konfigurasi Tailwind. Jangan mengulang nilai hardcoded di banyak komponen.

### Warna

| Token | Nilai Awal | Penggunaan |
| --- | --- | --- |
| `color.background` | `#f7f9fb` atau `#f8fafc` | Latar aplikasi |
| `color.surface` | `#ffffff` | Kartu dan modal |
| `color.surfaceLow` | `#f2f4f6` | Area sekunder |
| `color.surfaceContainer` | `#eceef0` | Bottom nav dan container |
| `color.surfaceHigh` | `#e6e8ea` | Secondary button |
| `color.surfaceHighest` | `#e0e3e5` | Active neutral layer |
| `color.primary` | `#446900` | Icon hijau tua, progress, teks brand |
| `color.primaryAccent` | `#a3e635` | CTA utama, item aktif, highlight |
| `color.primaryAccentDim` | `#98da27` | Alternatif accent |
| `color.text` | `#191c1e` | Teks utama |
| `color.textStrong` | `#0f172a` | Teks pada CTA dan headline kuat |
| `color.textMuted` | `#565e74` | Deskripsi |
| `color.textVariant` | `#424936` | Label sekunder |
| `color.secondaryContainer` | `#dae2fd` | Tile icon dan chip lembut |
| `color.error` | `#ba1a1a` | Error |
| `color.errorContainer` | `#ffdad6` | Background error |
| `color.outline` | `#727a64` | Border penting |
| `color.outlineVariant` | `#c2cab0` | Border dashed dan divider lembut |

### Tipografi

Gunakan Montserrat untuk headline dan skor. Gunakan Inter untuk body, label, dan teks UI.

| Token | Font | Size | Line Height | Weight | Penggunaan |
| --- | --- | --- | --- | --- | --- |
| `scoreDisplay` | Montserrat | 96px | 100px | 800 | Skor landscape |
| `scoreDisplayMobile` | Montserrat | 64px | 64px | 800 | Skor fallback kecil |
| `headlineLg` | Montserrat | 32px | 40px | 700 | Judul besar |
| `headlineMobile` | Montserrat | 24px | 32px | 700 | Judul portrait |
| `headlineMd` | Montserrat | 20px | 28px | 700 | Header dan card title |
| `bodyLg` | Inter | 18px | 28px | 500 | Teks kartu penting |
| `bodyMd` | Inter | 16px | 24px | 400 | Deskripsi |
| `labelCaps` | Inter | 12px | 16px | 700 | Label status uppercase |

Untuk implementasi, hindari letter spacing negatif di CSS umum. Jika skor membutuhkan karakter rapat, batasi hanya pada token skor dan pastikan tidak merusak keterbacaan.

### Spacing

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `space.1` | 4px | Detail kecil |
| `space.2` | 8px | Gap kecil |
| `space.3` | 12px | Padding compact |
| `space.4` | 16px | Gap antar komponen |
| `space.5` | 20px | Padding container mobile |
| `space.6` | 24px | Padding kartu besar |
| `space.8` | 32px | Section gap |
| `touchTargetMin` | 48px | Minimum area sentuh |
| `bottomNavHeight` | 72px | Bottom navigation |

### Radius

| Token | Nilai | Penggunaan |
| --- | --- | --- |
| `radius.sm` | 4px | Detail kecil |
| `radius.md` | 8px | Control kecil |
| `radius.lg` | 12px | Chip dan input compact |
| `radius.card` | 16px | Kartu, tombol utama, scoreboard cards |
| `radius.sheet` | 24px | Modal atau bottom sheet |
| `radius.full` | 9999px | Pill dan circular buttons |

### Shadow

| Token | Nilai Awal | Penggunaan |
| --- | --- | --- |
| `shadow.sm` | `0 1px 3px rgba(15, 23, 42, 0.08)` | Header dan control kecil |
| `shadow.ambient` | `0 8px 30px rgba(15, 23, 42, 0.06)` | Kartu |
| `shadow.elevated` | `0 16px 40px rgba(15, 23, 42, 0.12)` | Modal, action penting |
| `shadow.bottomNav` | `0 -4px 10px rgba(0, 0, 0, 0.05)` | Bottom nav |

Bayangan harus lembut. Hindari shadow gelap yang membuat UI terasa berat.

### Transition

- Durasi cepat: 100ms untuk pressed feedback.
- Durasi normal: 150ms sampai 200ms untuk button, card, dan panel.
- Durasi progress: 300ms.
- Gunakan transform `scale(0.98)` untuk pressed state.

## Header

Header portrait:

- Tinggi minimum 48px, boleh 56px jika konten butuh ruang.
- Background surface putih.
- Kiri: logo atau icon.
- Tengah: judul aplikasi berwarna primary.
- Kanan: info aplikasi atau aksi terkait.
- Sticky di halaman umum.

Header scoreboard:

- Tetap compact.
- Kiri: back.
- Tengah: nama mode skor.
- Kanan: settings/menu.
- Tidak boleh menghabiskan ruang vertikal landscape secara berlebihan.

## Kartu

- Background putih.
- Radius 16px sampai 24px sesuai konteks.
- Padding minimum 16px.
- Shadow ambient lembut.
- Kartu menu: icon tile kiri, teks kanan.
- Kartu skor: area besar, skor sangat dominan, nama pemain bisa diedit tanpa menambah poin.

## Tombol

Primary button:

- Background `primaryAccent`.
- Teks `textStrong` atau `onPrimaryContainer`.
- Radius 16px.
- Tinggi minimum 56px untuk CTA utama.
- Icon kiri dan label tebal.

Secondary button:

- Background surface atau surfaceHigh.
- Border lembut jika perlu.
- Teks `textVariant`.
- Tinggi minimum 48px.

Icon button:

- Minimum 48px.
- Radius full atau 12px.
- Icon harus punya accessible name.

Danger action:

- Gunakan error atau errorContainer.
- Reset dan akhiri pertandingan wajib konfirmasi.

## Bottom Navigation

- Fixed di bawah untuk halaman portrait.
- Tinggi 72px plus safe area.
- Background `surfaceContainer`.
- Empat item utama: Beranda, Pertandingan, Rules, Riwayat.
- Item aktif memakai pill `primaryAccent`.
- Inactive item memakai icon outline dan label muted.
- Jangan tampilkan bottom navigation di scoreboard landscape jika mengurangi ruang skor.

## Empty State

Empty state mengikuti screenshot:

- Container rounded besar.
- Background surfaceLow atau surface.
- Border dashed `outlineVariant`.
- Icon besar 40px sampai 48px.
- Teks utama bodyLg atau headlineMd.
- Teks pendukung bodyMd muted.
- Copy harus ringkas dan memberi aksi berikutnya.

## Portrait dan Landscape

Portrait:

- Digunakan untuk halaman umum.
- Konten dapat scroll.
- Bottom navigation aktif.
- CTA utama berada di atas fold.

Landscape scoreboard:

- Wajib muat satu layar.
- Tidak perlu vertical scrolling.
- Gunakan tiga area utama: Tim A, Informasi pertandingan, Tim B.
- Skor harus sangat besar dan tetap terbaca dari jarak lapangan.
- Gunakan responsive constraints untuk smartphone landscape kecil.

Portrait pada route scoreboard:

- Tampilkan halaman "Mohon Putar Perangkat".
- Jangan render scoreboard tersembunyi yang bisa terganggu layoutnya.

## Touch Target

- Semua control minimal 48px.
- Area kartu skor adalah target tap utama.
- Nama pemain, tombol edit, dan control menu harus menghentikan event agar tidak menambah poin.
- Jangan mengandalkan hover.

## States

Normal:

- Warna surface bersih, teks gelap, border lembut.

Selected:

- Gunakan `primaryAccent` atau chip primary.
- Pastikan selected state tetap jelas tanpa hanya mengandalkan warna.

Pressed:

- Gunakan scale 0.98, overlay lembut, atau shadow aktif.
- Vibration API boleh dipakai jika tersedia.

Disabled:

- Kurangi opacity dan hilangkan pressed feedback.
- Area tambah poin disabled setelah match selesai.

Loading:

- Gunakan skeleton atau spinner minimal.
- Jangan menggeser layout utama.

Error:

- Gunakan errorContainer dan teks error.
- Berikan tindakan pemulihan.

Success:

- Gunakan aksen hijau secara hemat.
- Untuk pemenang, boleh gunakan highlight primaryAccent pada kartu tim.

## Gaya Keseluruhan

Nama gaya: Clean Modern-Sport.

Prinsip:

- Terang, bersih, high contrast.
- Sporty tanpa dekorasi berlebihan.
- Komponen besar dan mudah disentuh.
- Informasi pertandingan langsung terlihat.
- Konsisten dengan referensi Stitch, bukan redesign baru.
