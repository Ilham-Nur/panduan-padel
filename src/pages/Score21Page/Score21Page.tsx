import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { Icon } from "../../components/Icon/Icon";
import {
  addScore21Point,
  createScore21Match,
  endScore21Match,
  resetScore21Match,
  selectScore21FirstServer,
  undoScore21Point,
  updateScore21Teams
} from "../../domain/scoring/score21Engine";
import type { TeamId } from "../../domain/scoring/types";
import {
  loadActiveScore21Match,
  saveActiveScore21Match
} from "../../storage/activeMatchRepository";
import { quickScore21Rules } from "../../features/rules/rulesContent";
import {
  createScore21HistoryRecord,
  saveMatchHistoryRecord
} from "../../storage/matchHistoryRepository";
import "./Scoreboard.css";

type ConfirmationAction = "reset" | "end" | null;

export function Score21Page() {
  const navigate = useNavigate();
  const [match, setMatch] = useState(() => createScore21Match());
  const [isLoaded, setIsLoaded] = useState(false);
  const [now, setNow] = useState(() => Date.now());
  const [confirmationAction, setConfirmationAction] = useState<ConfirmationAction>(null);
  const [showServeReminder, setShowServeReminder] = useState(false);
  const [isSavingHistory, setIsSavingHistory] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isQuickRulesOpen, setIsQuickRulesOpen] = useState(false);
  const activeServeTeam = match.currentServer ?? match.firstServer;
  const progressWidth = `${Math.max(2, (match.totalReli / 21) * 100)}%`;
  const elapsedSeconds = getElapsedSeconds(match.startedAt, match.finishedAt, now);
  const statusLabel = useMemo(() => {
    if (match.status === "finished") {
      return match.winner === "teamA" ? "TIM A MENANG" : "TIM B MENANG";
    }

    if (match.firstServer === null) {
      return "AWAL PERTANDINGAN";
    }

    return match.currentServer === "teamA" ? "SERVIS TIM A" : "SERVIS TIM B";
  }, [match.currentServer, match.firstServer, match.status, match.winner]);

  useEffect(() => {
    let isMounted = true;

    loadActiveScore21Match()
      .then((activeMatch) => {
        if (isMounted && activeMatch !== null) {
          setMatch(activeMatch);
        }
      })
      .catch(() => {
        // Storage failure should not block scoring on court.
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

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    saveActiveScore21Match(match).catch(() => {
      // Scoring must stay usable even when IndexedDB is unavailable.
    });
  }, [isLoaded, match]);

  useEffect(() => {
    if (match.startedAt === null || match.status === "finished") {
      return;
    }

    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, [match.startedAt, match.status]);

  useEffect(() => {
    if (!isQuickRulesOpen) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsQuickRulesOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isQuickRulesOpen]);

  function handleSelectFirstServer(firstServer: TeamId) {
    setShowServeReminder(false);
    setMatch((currentMatch) => selectScore21FirstServer(currentMatch, firstServer));
  }

  function handleAddPoint(scoringTeam: TeamId) {
    if (match.firstServer === null) {
      setShowServeReminder(true);
      return;
    }

    setShowServeReminder(false);
    setMatch((currentMatch) => addScore21Point(currentMatch, scoringTeam, { occurredAt: new Date().toISOString() }));
  }

  function handleUndoPoint() {
    setSaveError(null);
    setMatch((currentMatch) => undoScore21Point(currentMatch));
  }

  function handleTeamInput(team: TeamId, field: "name" | "players", value: string) {
    setMatch((currentMatch) =>
      updateScore21Teams(currentMatch, {
        [team]: {
          [field]: value
        }
      })
    );
  }

  function handleConfirmAction() {
    const finishedAt = new Date().toISOString();

    if (confirmationAction === "reset") {
      setMatch((currentMatch) => resetScore21Match(currentMatch));
      setSaveError(null);
    }

    if (confirmationAction === "end") {
      setMatch((currentMatch) => endScore21Match(currentMatch, finishedAt));
    }

    setConfirmationAction(null);
  }

  async function handleSaveAndStartNewMatch() {
    const record = createScore21HistoryRecord(match);

    if (record === null) {
      setSaveError("Pertandingan belum siap disimpan.");
      return;
    }

    setIsSavingHistory(true);
    setSaveError(null);

    try {
      await saveMatchHistoryRecord(record);
      setMatch(createScore21Match());
      setShowServeReminder(false);
      setNow(Date.now());
    } catch {
      setSaveError("Gagal menyimpan riwayat. Coba tekan simpan sekali lagi.");
    } finally {
      setIsSavingHistory(false);
    }
  }

  async function handleBackToFormatMenu() {
    const freshMatch = createScore21Match();

    setMatch(freshMatch);
    setConfirmationAction(null);
    setShowServeReminder(false);
    setSaveError(null);
    setNow(Date.now());

    try {
      await saveActiveScore21Match(freshMatch);
    } catch {
      // Navigation should still work even if local persistence is unavailable.
    }

    navigate("/match/new");
  }

  return (
    <div className="scoreboard-shell">
      <header className="scoreboard-header">
        <button
          className="scoreboard-header__button"
          type="button"
          aria-label="Kembali ke pilih sistem skor dan reset pertandingan"
          onClick={handleBackToFormatMenu}
        >
          <Icon name="arrow_back" />
        </button>
        <h1>Skor 21</h1>
        <button
          className="scoreboard-header__button"
          type="button"
          aria-label="Reset pertandingan"
          onClick={() => setConfirmationAction("reset")}
        >
          <Icon name="restart_alt" />
        </button>
      </header>

      <main className="scoreboard-grid">
        <section className="score-card" aria-label="Tim A">
          <div className="score-card__team score-card__team--editable">
            <input
              aria-label="Nama Tim A"
              maxLength={24}
              placeholder="Tim A"
              value={match.teamA.name}
              onChange={(event) => handleTeamInput("teamA", "name", event.target.value)}
            />
            <input
              aria-label="Nama pemain Tim A"
              maxLength={40}
              placeholder="Nama pemain"
              value={match.teamA.players}
              onChange={(event) => handleTeamInput("teamA", "players", event.target.value)}
            />
          </div>
          <button
            className="score-card__tap"
            type="button"
            aria-label="Tambah poin untuk Tim A"
            disabled={match.status === "finished"}
            onClick={() => handleAddPoint("teamA")}
          >
            <span className="score-card__score">{match.teamA.score}</span>
            <span className="score-card__hint">{getScoreHint(match.firstServer, match.status)}</span>
          </button>
        </section>

        <section className="scoreboard-center" aria-label="Status pertandingan">
          <div className="match-progress">
            <div>
              <strong>Reli {match.totalReli} dari 21</strong>
              <span>{statusLabel}</span>
            </div>
            <div className="match-progress__track">
              <span style={{ width: progressWidth }} />
            </div>
            <dl className="match-stats">
              <div>
                <dt>Timer</dt>
                <dd>{formatDuration(elapsedSeconds)}</dd>
              </div>
              <div>
                <dt>Server</dt>
                <dd>{getServerLabel(match.currentServer)}</dd>
              </div>
            </dl>
          </div>

          <div className={`serve-picker ${showServeReminder && match.firstServer === null ? "serve-picker--attention" : ""}`.trim()}>
            <h2>
              {match.status === "finished"
                ? "Pertandingan selesai"
                : showServeReminder && match.firstServer === null
                ? "Pilih servis dulu"
                : match.firstServer === null
                  ? "Pilih Tim Servis Pertama"
                  : `Sisa servis: ${match.remainingServe}`}
            </h2>
            {match.status === "finished" ? (
              <>
                <p>{getFinishedSummary(match.winner)}</p>
                <div className="finish-actions">
                  <Button variant="primary" disabled={isSavingHistory} onClick={handleSaveAndStartNewMatch}>
                    <Icon name="save" />
                    {isSavingHistory ? "Menyimpan..." : "Simpan & Main Lagi"}
                  </Button>
                </div>
                {saveError !== null ? <span className="serve-picker__error">{saveError}</span> : null}
              </>
            ) : (
              <div>
                <Button
                  aria-pressed={activeServeTeam === "teamA"}
                  className="serve-picker__button"
                  variant={activeServeTeam === "teamA" ? "primary" : "secondary"}
                  disabled={match.totalReli > 0}
                  onClick={() => handleSelectFirstServer("teamA")}
                >
                  Tim A
                </Button>
                <Button
                  aria-pressed={activeServeTeam === "teamB"}
                  className="serve-picker__button"
                  variant={activeServeTeam === "teamB" ? "primary" : "secondary"}
                  disabled={match.totalReli > 0}
                  onClick={() => handleSelectFirstServer("teamB")}
                >
                  Tim B
                </Button>
              </div>
            )}
          </div>

          <div className="scoreboard-actions">
            <Button disabled={match.pointHistory.length === 0} onClick={handleUndoPoint}>
              <Icon name="undo" />
              Batal
            </Button>
            <Button onClick={() => setIsQuickRulesOpen(true)}>
              <Icon name="gavel" />
              Aturan
            </Button>
            <Button aria-label="Akhiri pertandingan" onClick={() => setConfirmationAction("end")}>
              <Icon name="flag" />
            </Button>
          </div>
        </section>

        <section className="score-card" aria-label="Tim B">
          <div className="score-card__team score-card__team--editable">
            <input
              aria-label="Nama Tim B"
              maxLength={24}
              placeholder="Tim B"
              value={match.teamB.name}
              onChange={(event) => handleTeamInput("teamB", "name", event.target.value)}
            />
            <input
              aria-label="Nama pemain Tim B"
              maxLength={40}
              placeholder="Nama pemain"
              value={match.teamB.players}
              onChange={(event) => handleTeamInput("teamB", "players", event.target.value)}
            />
          </div>
          <button
            className="score-card__tap"
            type="button"
            aria-label="Tambah poin untuk Tim B"
            disabled={match.status === "finished"}
            onClick={() => handleAddPoint("teamB")}
          >
            <span className="score-card__score">{match.teamB.score}</span>
            <span className="score-card__hint">{getScoreHint(match.firstServer, match.status)}</span>
          </button>
        </section>
      </main>

      {confirmationAction !== null ? (
        <div className="match-dialog" role="dialog" aria-modal="true" aria-labelledby="match-dialog-title">
          <div className="match-dialog__panel">
            <h2 id="match-dialog-title">
              {confirmationAction === "reset" ? "Reset pertandingan?" : "Akhiri pertandingan?"}
            </h2>
            <p>
              {confirmationAction === "reset"
                ? "Skor aktif akan dikosongkan dan pertandingan baru dimulai."
                : "Pertandingan akan ditandai selesai. Setelah itu kamu bisa menyimpan hasil ke riwayat."}
            </p>
            <div>
              <Button variant="ghost" onClick={() => setConfirmationAction(null)}>
                Batal
              </Button>
              <Button variant="primary" onClick={handleConfirmAction}>
                Ya
              </Button>
            </div>
          </div>
        </div>
      ) : null}

      {isQuickRulesOpen ? (
        <aside className="quick-rules" role="dialog" aria-modal="true" aria-labelledby="quick-rules-title">
          <div className="quick-rules__panel">
            <header>
              <div>
                <span className="eyebrow">Rules cepat</span>
                <h2 id="quick-rules-title">Skor 21</h2>
              </div>
              <button
                className="scoreboard-header__button"
                type="button"
                aria-label="Tutup rules cepat"
                onClick={() => setIsQuickRulesOpen(false)}
              >
                <Icon name="close" />
              </button>
            </header>
            <div className="quick-rules__list">
              {quickScore21Rules.map((rule) => (
                <article key={rule.title}>
                  <strong>{rule.title}</strong>
                  <p>{rule.text}</p>
                </article>
              ))}
            </div>
          </div>
        </aside>
      ) : null}
    </div>
  );
}

function getScoreHint(firstServer: TeamId | null, status: string): string {
  if (status === "finished") {
    return "Pertandingan selesai";
  }

  if (firstServer === null) {
    return "Pilih servis dulu";
  }

  return "Ketuk untuk tambah skor";
}

function getFinishedSummary(winner: TeamId | null): string {
  if (winner === "teamA") {
    return "Tim A menang. Simpan hasil untuk mulai pertandingan baru.";
  }

  if (winner === "teamB") {
    return "Tim B menang. Simpan hasil untuk mulai pertandingan baru.";
  }

  return "Simpan hasil untuk mulai pertandingan baru.";
}

function getServerLabel(server: TeamId | null): string {
  if (server === "teamA") {
    return "Tim A";
  }

  if (server === "teamB") {
    return "Tim B";
  }

  return "-";
}

function getElapsedSeconds(startedAt: string | null, finishedAt: string | null, now: number): number {
  if (startedAt === null) {
    return 0;
  }

  const endTime = finishedAt === null ? now : Date.parse(finishedAt);
  return Math.max(0, Math.floor((endTime - Date.parse(startedAt)) / 1000));
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
