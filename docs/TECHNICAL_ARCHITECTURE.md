# Technical Architecture

## Audit Repository Saat Ini

Repository saat ini berisi:

- `index.html`, `styles.css`, dan `script.js` sebagai website edukasi statis.
- Halaman HTML pendukung: `dasar.html`, `servis.html`, `kaca-pagar.html`, `skor.html`, `kesalahan.html`, `faq.html`.
- `assets/the-padel$-logo.jpeg`.
- Folder `stitch_padel_score_pwa_interface/` berisi referensi desain.
- Belum ada `package.json`.
- Belum ada struktur React, TypeScript, test runner, atau build system.
- Belum ada folder `docs/` sebelum tahap dokumentasi ini.

Implikasi: implementasi aplikasi PWA React berikutnya akan menjadi scaffolding baru, tetapi tidak boleh menghapus konten lama tanpa instruksi eksplisit.

## Stack Target

Jika implementasi dimulai dari repo saat ini, gunakan:

- React.
- TypeScript strict mode.
- Vite.
- React Router.
- IndexedDB untuk persistence.
- Web app manifest dan service worker statis melalui Vite `public/`.
- Test runner untuk unit test scoring engine.
- Styling system konsisten, misalnya CSS Modules, Tailwind, atau token CSS terpusat.

Package manager belum dipilih karena belum ada lockfile. Pilih satu saat scaffolding dan dokumentasikan alasannya.

## Struktur Folder Target

```text
src/
  app/
    App.tsx
    router.tsx
    providers.tsx
  pages/
    HomePage/
    NewMatchPage/
    Score21Page/
    StandardScorePage/
    RulesPage/
    HistoryPage/
    SettingsPage/
  components/
    AppHeader/
    BottomNav/
    OrientationGuard/
    Button/
    Card/
    Modal/
    Sheet/
  features/
    match/
    score21/
    standard-score/
    rules/
    history/
  domain/
    scoring/
      score21Engine.ts
      standardEngine.ts
      types.ts
  storage/
    indexedDb.ts
    activeMatchRepository.ts
    matchHistoryRepository.ts
    preferencesRepository.ts
  hooks/
    useOrientation.ts
    useActiveMatch.ts
    useTimer.ts
  stores/
    activeMatchStore.ts
    preferencesStore.ts
  types/
  styles/
    tokens.css
    globals.css
```

## Layering

### Domain

- Pure scoring functions.
- No React imports.
- No DOM, IndexedDB, localStorage, service worker, or browser-specific API.
- Fully unit-testable.

### Storage

- IndexedDB wrapper and repositories.
- Handles migrations and serialization.
- Returns typed data.

### Features

- Feature-specific components and hooks.
- Coordinates UI actions with domain engine and storage.

### Pages

- Route-level composition.
- No complex scoring logic.

### Components

- Reusable UI primitives.
- Use design tokens.
- No match rule logic.

## State Management

Pisahkan tiga jenis state:

1. UI state
   - Panel rules terbuka atau tertutup.
   - Modal konfirmasi.
   - Field edit nama.
   - Loading dan error transient.
2. Active match state
   - Match saat ini.
   - Score, server, timer, settings, history.
   - Persist ke IndexedDB.
3. Persistent history state
   - Match selesai.
   - Ringkasan riwayat.
   - Detail match jika diperlukan.

State active match harus bisa dipulihkan setelah reload, app tertutup, dan orientasi berubah.

## IndexedDB

Object store awal:

- `activeMatch`
  - Key: `active`
  - Value: active match state.
- `matchHistory`
  - Key: match ID.
  - Index: `finishedAt`, `mode`, `winner`.
- `preferences`
  - Key-value untuk preferensi kecil.

Gunakan schema versioning sejak awal agar migrasi aman.

## PWA

PWA MVP membutuhkan:

- `manifest.webmanifest`.
- Service worker.
- Offline reload untuk shell aplikasi.
- Cache aset statis inti.
- Fallback offline untuk route aplikasi.
- Installability pada Android Chrome.

Strategi cache:

- App shell: service worker statis `public/sw.js` dengan cache versioning.
- Data match: IndexedDB, bukan cache.
- Rules content statis: bisa precache jika sudah masuk bundle.

Implementasi saat ini tidak menambah dependency PWA. Manifest, ikon, dan service worker ditempatkan di `public/`, lalu service worker didaftarkan dari entry React hanya saat build produksi.

## Styling

Gunakan design token terpusat:

- Warna.
- Font family.
- Font size.
- Font weight.
- Radius.
- Spacing.
- Shadow.
- Transition.
- Touch target minimum.

Jangan hardcode style berulang. Komponen Button, Card, Header, BottomNav, dan Sheet harus memakai token.

## Migration dari Website Lama

Konten rules lama dapat dimigrasikan dari:

- `dasar.html`
- `servis.html`
- `kaca-pagar.html`
- `skor.html`
- `kesalahan.html`
- `faq.html`
- bagian rules di `index.html`

Jangan hapus file lama saat fase awal React kecuali ada instruksi eksplisit. Jika dibuat React app baru, tentukan strategi:

- Menjaga file lama sebagai arsip sementara, atau
- Memindahkan konten rules ke data terstruktur dengan commit terpisah.

## Quality Gates

Setelah implementasi kode:

- Lint berhasil.
- Typecheck berhasil.
- Unit test berhasil.
- Build produksi berhasil.
- PWA smoke test berhasil.
- Tidak ada console error utama.
- Responsive portrait dan landscape diperiksa.

Pada tahap dokumentasi ini, dependency tidak diubah dan build tidak dijalankan karena belum ada build system.
