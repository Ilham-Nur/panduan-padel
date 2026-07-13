import { useEffect, useState } from "react";
import { Card } from "../../components/Card/Card";
import { Icon } from "../../components/Icon/Icon";
import { loadMatchHistory } from "../../storage/matchHistoryRepository";
import type { MatchHistoryRecord } from "../../storage/matchHistoryRepository";

export function HistoryPage() {
  const [records, setRecords] = useState<MatchHistoryRecord[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let isMounted = true;

    loadMatchHistory()
      .then((matchHistory) => {
        if (isMounted) {
          setRecords(matchHistory);
        }
      })
      .catch(() => {
        if (isMounted) {
          setRecords([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoaded(true);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="page-stack">
      <section className="page-heading">
        <p className="eyebrow">Riwayat</p>
        <h2>Pertandingan tersimpan</h2>
        <p>Hasil pertandingan offline akan muncul di sini.</p>
      </section>

      {records.length > 0 ? (
        <section className="simple-list" aria-label="Daftar riwayat pertandingan">
          {records.map((record) => (
            <Card as="article" className="history-card" key={record.id}>
              <div>
                <span className="eyebrow">{getModeLabel(record)}</span>
                <strong>{getScoreLine(record)}</strong>
                <span>{getWinnerText(record)}</span>
              </div>
              <dl>
                <div>
                  <dt>{record.mode === "score21" ? "Reli" : "Format"}</dt>
                  <dd>{record.mode === "score21" ? record.totalReli : getFormatLabel(record.settings.format)}</dd>
                </div>
                <div>
                  <dt>Durasi</dt>
                  <dd>{formatDuration(record.durationSeconds)}</dd>
                </div>
                <div>
                  <dt>Selesai</dt>
                  <dd>{formatDate(record.finishedAt)}</dd>
                </div>
              </dl>
            </Card>
          ))}
        </section>
      ) : (
        <Card as="div" className="empty-state">
          <Icon className="empty-state__icon" name="history" />
          <strong>{isLoaded ? "Belum ada riwayat pertandingan." : "Memuat riwayat pertandingan..."}</strong>
          <span>Mulai pertandingan untuk menyimpan hasil pertama.</span>
        </Card>
      )}
    </div>
  );
}

function getModeLabel(record: MatchHistoryRecord): string {
  return record.mode === "score21" ? "Skor 21" : "Padel Standar";
}

function getScoreLine(record: MatchHistoryRecord): string {
  if (record.mode === "score21") {
    return `${record.teamA.name} ${record.teamA.score} - ${record.teamB.score} ${record.teamB.name}`;
  }

  const setLine =
    record.sets.length > 0
      ? record.sets.map((set) => `${set.teamA}-${set.teamB}`).join(", ")
      : `Game ${record.games.teamA}-${record.games.teamB}`;

  return `${record.teamA.name} ${setLine} ${record.teamB.name}`;
}

function getWinnerText(record: MatchHistoryRecord): string {
  if (record.winner === "teamA") {
    return `Pemenang: ${record.teamA.name}`;
  }

  if (record.winner === "teamB") {
    return `Pemenang: ${record.teamB.name}`;
  }

  return "Pertandingan diakhiri tanpa pemenang";
}

function getFormatLabel(format: string): string {
  return format === "bestOfThree" ? "Best of 3" : "1 Set";
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}m ${seconds}s`;
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("id-ID", {
    dateStyle: "medium",
    timeStyle: "short"
  }).format(new Date(value));
}
