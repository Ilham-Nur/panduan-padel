# SkorPadelKu PWA

PWA mobile-first untuk penghitung skor pertandingan padel dan panduan rules pemula. Project ini sedang dimigrasikan dari website statis ke React + TypeScript + Vite.

## Stack

- React
- TypeScript strict mode
- Vite
- React Router
- CSS tokens terpusat

## Script

```bash
npm.cmd install
npm.cmd run dev
npm.cmd run lint
npm.cmd run typecheck
npm.cmd run test
npm.cmd run build
```

Gunakan `npm.cmd` di PowerShell Windows jika `npm.ps1` diblokir oleh execution policy.

## Struktur Penting

- `AGENTS.md` - aturan utama untuk agent AI.
- `docs/` - scope, design system, flow, scoring rules, arsitektur, plan, dan checklist testing.
- `src/` - source React.
- `assets/` - aset pendukung komunitas, termasuk logo The Padel$.
- `stitch_padel_score_pwa_interface/` - referensi desain Stitch yang wajib dipertahankan.

## Catatan Brand

- Nama aplikasi: SkorPadelKu.
- Logo utama aplikasi memakai `public/brand/skorpadelku-logo.png`.
- Icon PWA memakai turunan logo di `public/icons/skorpadelku-icon-192.png` dan `public/icons/skorpadelku-icon-512.png`.
- Logo komunitas The Padel$ ditampilkan di halaman Info sebagai community support.

## Catatan Phase 1

Phase 1 hanya membuat fondasi React:

- Routing dasar.
- Layout portrait.
- Halaman Beranda.
- Halaman Pilih Sistem Skor.
- Orientation Guard untuk route scoreboard.
- Placeholder visual scoreboard landscape tanpa scoring engine.

Scoring engine, IndexedDB, service worker, dan fitur match lengkap masuk phase berikutnya.
