# Scoring Rules

Scoring engine harus dipisahkan dari komponen React. Implementasikan sebagai pure functions yang menerima state dan event, lalu mengembalikan state baru.

## Prinsip Umum

- UI tidak boleh menghitung skor sendiri.
- UI hanya mengirim event seperti `POINT_TO_TEAM_A`, `POINT_TO_TEAM_B`, `UNDO`, `RESET`, atau `END_MATCH`.
- Engine menentukan skor, server, status, dan pemenang.
- Simpan event history atau snapshot history agar Undo reliable.
- Semua state penting harus serializable untuk IndexedDB.

## Mode Skor 21

### Aturan

- Setiap reli menghasilkan 1 poin.
- Skor Tim A + skor Tim B selalu bertambah 1 setiap reli.
- Pertandingan selesai ketika total skor kedua tim mencapai 21.
- Total 21 ganjil, jadi pertandingan pasti memiliki pemenang.
- Tidak ada deuce.
- Tidak ada game dan set.
- Area Tim A ditekan untuk menambah poin Tim A.
- Area Tim B ditekan untuk menambah poin Tim B.

Rumus:

```text
totalReli = skorTimA + skorTimB
match selesai jika totalReli === 21
```

Contoh skor akhir:

- 11-10
- 12-9
- 13-8
- 15-6

### Pergantian Servis

Servis berganti berdasarkan jumlah reli, bukan pemenang reli.

Jika Tim A dipilih sebagai servis pertama:

- Reli 1-5: Tim A
- Reli 6-10: Tim B
- Reli 11-15: Tim A
- Reli 16-20: Tim B
- Reli 21: Tim A

Jika Tim B dipilih sebagai servis pertama, urutannya dibalik.

Untuk menentukan server reli berikutnya sebelum match selesai:

```text
serviceBlock = floor(totalReli / 5)
server = serviceBlock genap ? firstServer : otherTeam
```

Dengan total reli selesai:

- `0-4`: server pertama untuk reli berikutnya.
- `5-9`: server kedua untuk reli berikutnya.
- `10-14`: server pertama.
- `15-19`: server kedua.
- `20`: server pertama untuk reli ke-21.

Sisa servis:

```text
remainingServe = 5 - (totalReli % 5)
```

Jika `totalReli === 20`, sisa servis ditampilkan sebagai 1 karena hanya reli ke-21 yang tersisa. Jika match selesai, server aktif dapat ditampilkan sebagai selesai atau server terakhir sesuai kebutuhan UI, tetapi state pemenang tidak boleh berubah.

### Undo

Undo wajib mengembalikan:

- Skor Tim A.
- Skor Tim B.
- Total reli.
- Tim servis.
- Sisa servis.
- Status pertandingan.
- Status kemenangan.

Rekomendasi:

- Simpan snapshot sebelum setiap point event, atau
- Simpan event log dan derive state dari awal.

Untuk MVP, snapshot history lebih sederhana dan aman.

### State Minimal Skor 21

```text
mode: "score21"
teamA.score: number
teamB.score: number
firstServer: "teamA" | "teamB" | null
currentServer: "teamA" | "teamB" | null
totalReli: number
remainingServe: number
status: "setup" | "inProgress" | "finished"
winner: "teamA" | "teamB" | null
pointHistory: Score21Snapshot[]
startedAt: ISODateString | null
finishedAt: ISODateString | null
```

## Mode Padel Standar

### Aturan Dasar

Mode standar mendukung:

- 0
- 15
- 30
- 40
- Deuce
- Advantage
- Game
- Set
- Tie-break
- Golden Point sebagai pilihan

Pengaturan awal dilakukan langsung dari scoreboard sebelum poin pertama:

- Format pertandingan: 1 Set atau Best of 3 Set.
- Mode 40-40: Advantage atau Golden Point.
- Tie-break aktif saat 6-6.

Setelah poin pertama dicatat, pengaturan pertandingan dikunci.

### Point Progression

Urutan normal:

```text
0 -> 15 -> 30 -> 40 -> Game
```

Jika kedua tim 40-40:

- Mode Advantage: masuk Deuce.
- Mode Golden Point: poin berikutnya langsung memenangkan game.

### Advantage Mode

Aturan:

- Saat 40-40, status adalah Deuce.
- Tim yang memenangkan poin dari Deuce mendapat Advantage.
- Jika tim dengan Advantage memenangkan poin berikutnya, tim tersebut memenangkan game.
- Jika lawan memenangkan poin saat Advantage, kembali ke Deuce.

### Golden Point Mode

Aturan:

- Saat 40-40, poin berikutnya langsung memenangkan game.
- Tidak ada Advantage.
- UI harus menampilkan status Golden Point dengan jelas.

### Game, Set, dan Match

Game:

- Tim memenangkan game setelah memenuhi aturan point progression.
- Setelah game selesai, poin game reset ke 0-0.
- Servis berpindah setelah satu game selesai.

Set:

- Tim memenangkan set jika mencapai minimal 6 game dan unggul minimal 2 game.
- Contoh set normal: 6-0, 6-1, 6-2, 6-3, 6-4.
- Skor 7-5 valid jika sebelumnya 5-5 lalu satu tim unggul dua game.

Tie-break:

- Aktif saat game 6-6.
- Pemenang tie-break minimal 7 poin dan unggul 2 poin.
- Pemenang tie-break memenangkan set 7-6.

Asumsi servis tie-break untuk MVP:

- Tie-break dimulai oleh server game berikutnya setelah skor game mencapai 6-6.
- Poin pertama tie-break dilayani oleh server pembuka tie-break.
- Setelah poin pertama, servis berpindah ke tim lawan untuk 2 poin, lalu berganti setiap 2 poin.
- Jika match berlanjut ke set berikutnya, game pertama set berikutnya dilayani oleh lawan dari server pembuka tie-break.

Match:

- Format 1 Set: match selesai saat satu tim memenangkan 1 set.
- Best of 3 Set: match selesai saat satu tim memenangkan 2 set.

### Servis

- Servis awal dipilih langsung di scoreboard sebelum poin pertama.
- Pada game normal, server berpindah setelah satu game selesai.
- Pada tie-break, engine harus memiliki aturan server yang eksplisit dan diuji. Jika detail tie-break server belum disepakati, catat asumsi sebelum implementasi.

### Undo

Undo harus mengembalikan state lengkap:

- Point.
- Deuce.
- Advantage.
- Game.
- Set.
- Tie-break.
- Server.
- Status pertandingan.
- Pemenang.
- Pengaturan yang terkunci.

### State Minimal Padel Standar

```text
mode: "standard"
settings.format: "oneSet" | "bestOfThree"
settings.deuceMode: "advantage" | "goldenPoint"
settings.tieBreakAtSixAll: true
settingsLocked: boolean
teamA.points: 0 | 15 | 30 | 40
teamB.points: 0 | 15 | 30 | 40
deuce: boolean
advantage: "teamA" | "teamB" | null
games: { teamA: number, teamB: number }
sets: Array<{ teamA: number, teamB: number, tieBreak?: TieBreakScore }>
currentServer: "teamA" | "teamB" | null
firstServer: "teamA" | "teamB" | null
tieBreak: TieBreakState | null
status: "setup" | "inProgress" | "finished"
winner: "teamA" | "teamB" | null
history: StandardScoreSnapshot[]
```

## Domain Events

Event awal yang disarankan:

```text
SELECT_FIRST_SERVER
UPDATE_TEAM_NAMES
POINT_TO_TEAM_A
POINT_TO_TEAM_B
UNDO_POINT
RESET_MATCH
END_MATCH
SAVE_MATCH
TICK_TIMER
```

Timer boleh dikelola di layer app/store, tetapi timestamp start dan finish harus masuk ke active match state agar bisa dipulihkan.
