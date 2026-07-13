import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button/Button";
import { Icon } from "../../components/Icon/Icon";
import {
  addStandardPoint,
  createStandardMatch,
  endStandardMatch,
  resetStandardMatch,
  selectStandardFirstServer,
  undoStandardPoint,
  updateStandardSettings,
  updateStandardTeams
} from "../../domain/scoring/standardEngine";
import type { StandardDeuceMode, StandardMatchFormat, StandardState } from "../../domain/scoring/standardEngine";
import type { TeamId } from "../../domain/scoring/types";
import { quickStandardRules } from "../../features/rules/rulesContent";
import { loadActiveStandardMatch, saveActiveStandardMatch } from "../../storage/activeMatchRepository";
import { createStandardHistoryRecord, saveMatchHistoryRecord } from "../../storage/matchHistoryRepository";
import "../Score21Page/Scoreboard.css";

type ConfirmationAction = "reset" | "end" | null;

export function StandardScorePage() {
  const navigate = useNavigate();
  const [match, setMatch] = useState(() => createStandardMatch());
  const [isLoaded, setIsLoaded] = useState(false);
  const [confirmationAction, setConfirmationAction] = useState<ConfirmationAction>(null);
  const [showServeReminder, setShowServeReminder] = useState(false);
  const [isSavingHistory, setIsSavingHistory] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isQuickRulesOpen, setIsQuickRulesOpen] = useState(false);
  const activeServeTeam = match.currentServer ?? match.firstServer;
  const setWins = useMemo(() => getSetWins(match), [match]);
  const progressWidth = `${Math.max(2, getStandardProgress(match))}%`;
  const statusLabel = getStandardStatusLabel(match);

  useEffect(() => {
    let isMounted = true;

    loadActiveStandardMatch()
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

    saveActiveStandardMatch(match).catch(() => {
      // Scoring must stay usable even when IndexedDB is unavailable.
    });
  }, [isLoaded, match]);

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
    setMatch((currentMatch) => selectStandardFirstServer(currentMatch, firstServer));
  }

  function handleAddPoint(scoringTeam: TeamId) {
    if (match.firstServer === null) {
      setShowServeReminder(true);
      return;
    }

    setShowServeReminder(false);
    setMatch((currentMatch) => addStandardPoint(currentMatch, scoringTeam, { occurredAt: new Date().toISOString() }));
  }

  function handleTeamInput(team: TeamId, field: "name" | "players", value: string) {
    setMatch((currentMatch) =>
      updateStandardTeams(currentMatch, {
        [team]: {
          [field]: value
        }
      })
    );
  }

  function handleFormatChange(format: StandardMatchFormat) {
    setMatch((currentMatch) => updateStandardSettings(currentMatch, { format }));
  }

  function handleDeuceModeChange(deuceMode: StandardDeuceMode) {
    setMatch((currentMatch) => updateStandardSettings(currentMatch, { deuceMode }));
  }

  function handleConfirmAction() {
    const finishedAt = new Date().toISOString();

    if (confirmationAction === "reset") {
      setMatch((currentMatch) => resetStandardMatch(currentMatch));
      setShowServeReminder(false);
      setSaveError(null);
    }

    if (confirmationAction === "end") {
      setMatch((currentMatch) => endStandardMatch(currentMatch, finishedAt));
    }

    setConfirmationAction(null);
  }

  async function handleSaveAndStartNewMatch() {
    const record = createStandardHistoryRecord(match);

    if (record === null) {
      setSaveError("Pertandingan belum siap disimpan.");
      return;
    }

    setIsSavingHistory(true);
    setSaveError(null);

    try {
      const freshMatch = createStandardMatch();
      await saveMatchHistoryRecord(record);
      setMatch(freshMatch);
      setShowServeReminder(false);
      await saveActiveStandardMatch(freshMatch);
    } catch {
      setSaveError("Gagal menyimpan riwayat. Coba tekan simpan sekali lagi.");
    } finally {
      setIsSavingHistory(false);
    }
  }

  async function handleBackToFormatMenu() {
    const freshMatch = createStandardMatch();

    setMatch(freshMatch);
    setConfirmationAction(null);
    setShowServeReminder(false);
    setSaveError(null);

    try {
      await saveActiveStandardMatch(freshMatch);
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
        <h1>Padel Standar</h1>
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
            <span className="score-card__score score-card__score--standard">{getTeamPointLabel(match, "teamA")}</span>
            <span className="score-card__meta">
              Game {match.games.teamA} | Set {setWins.teamA}
            </span>
            <span className="score-card__hint">{getStandardScoreHint(match)}</span>
          </button>
        </section>

        <section className="scoreboard-center" aria-label="Status pertandingan">
          <div className="match-progress">
            <div>
              <strong>{getCenterTitle(match)}</strong>
              <span>{statusLabel}</span>
            </div>
            <div className="match-progress__track">
              <span style={{ width: progressWidth }} />
            </div>
            <dl className="match-stats match-stats--three">
              <div>
                <dt>Game</dt>
                <dd>
                  {match.games.teamA}-{match.games.teamB}
                </dd>
              </div>
              <div>
                <dt>Set</dt>
                <dd>
                  {setWins.teamA}-{setWins.teamB}
                </dd>
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
                    : getServePickerTitle(match)}
            </h2>

            {match.status === "finished" ? (
              <>
                <p>{getFinishedSummary(match)}</p>
                <div className="finish-actions">
                  <Button variant="primary" disabled={isSavingHistory} onClick={handleSaveAndStartNewMatch}>
                    <Icon name="save" />
                    {isSavingHistory ? "Menyimpan..." : "Simpan & Main Lagi"}
                  </Button>
                </div>
                {saveError !== null ? <span className="serve-picker__error">{saveError}</span> : null}
              </>
            ) : (
              <>
                <div>
                  <Button
                    aria-pressed={activeServeTeam === "teamA"}
                    className="serve-picker__button"
                    variant={activeServeTeam === "teamA" ? "primary" : "secondary"}
                    disabled={match.settingsLocked}
                    onClick={() => handleSelectFirstServer("teamA")}
                  >
                    Tim A
                  </Button>
                  <Button
                    aria-pressed={activeServeTeam === "teamB"}
                    className="serve-picker__button"
                    variant={activeServeTeam === "teamB" ? "primary" : "secondary"}
                    disabled={match.settingsLocked}
                    onClick={() => handleSelectFirstServer("teamB")}
                  >
                    Tim B
                  </Button>
                </div>

                {!match.settingsLocked ? (
                  <div className="standard-settings">
                    <Button
                      variant={match.settings.format === "oneSet" ? "primary" : "secondary"}
                      onClick={() => handleFormatChange("oneSet")}
                    >
                      1 Set
                    </Button>
                    <Button
                      variant={match.settings.format === "bestOfThree" ? "primary" : "secondary"}
                      onClick={() => handleFormatChange("bestOfThree")}
                    >
                      Best of 3
                    </Button>
                    <Button
                      variant={match.settings.deuceMode === "advantage" ? "primary" : "secondary"}
                      onClick={() => handleDeuceModeChange("advantage")}
                    >
                      Advantage
                    </Button>
                    <Button
                      variant={match.settings.deuceMode === "goldenPoint" ? "primary" : "secondary"}
                      onClick={() => handleDeuceModeChange("goldenPoint")}
                    >
                      Golden
                    </Button>
                  </div>
                ) : null}
              </>
            )}
          </div>

          <div className="scoreboard-actions">
            <Button disabled={match.history.length === 0} onClick={() => setMatch((currentMatch) => undoStandardPoint(currentMatch))}>
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
            <span className="score-card__score score-card__score--standard">{getTeamPointLabel(match, "teamB")}</span>
            <span className="score-card__meta">
              Game {match.games.teamB} | Set {setWins.teamB}
            </span>
            <span className="score-card__hint">{getStandardScoreHint(match)}</span>
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
        <aside className="quick-rules" role="dialog" aria-modal="true" aria-labelledby="quick-standard-rules-title">
          <div className="quick-rules__panel">
            <header>
              <div>
                <span className="eyebrow">Rules cepat</span>
                <h2 id="quick-standard-rules-title">Padel Standar</h2>
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
              {quickStandardRules.map((rule) => (
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

function getTeamPointLabel(match: StandardState, team: TeamId): string {
  if (match.tieBreak !== null) {
    return String(match.tieBreak.points[team]);
  }

  if (match.advantage === team) {
    return "AD";
  }

  return String(match[team].points);
}

function getCenterTitle(match: StandardState): string {
  if (match.tieBreak !== null) {
    return `Tie-break ${match.tieBreak.points.teamA}-${match.tieBreak.points.teamB}`;
  }

  return `Set ${match.sets.length + 1}`;
}

function getStandardStatusLabel(match: StandardState): string {
  if (match.status === "finished") {
    return match.winner === "teamA" ? "TIM A MENANG" : match.winner === "teamB" ? "TIM B MENANG" : "SELESAI";
  }

  if (match.tieBreak !== null) {
    return "TIE-BREAK";
  }

  if (match.deuce && match.settings.deuceMode === "goldenPoint") {
    return "GOLDEN POINT";
  }

  if (match.deuce && match.advantage !== null) {
    return match.advantage === "teamA" ? "ADV TIM A" : "ADV TIM B";
  }

  if (match.deuce) {
    return "DEUCE";
  }

  if (match.firstServer === null) {
    return "AWAL PERTANDINGAN";
  }

  return match.currentServer === "teamA" ? "SERVIS TIM A" : "SERVIS TIM B";
}

function getServePickerTitle(match: StandardState): string {
  if (match.tieBreak !== null) {
    return `Tie-break servis: ${getServerLabel(match.currentServer)}`;
  }

  return `Servis: ${getServerLabel(match.currentServer)}`;
}

function getStandardScoreHint(match: StandardState): string {
  if (match.status === "finished") {
    return "Pertandingan selesai";
  }

  if (match.firstServer === null) {
    return "Pilih servis dulu";
  }

  return "Ketuk untuk tambah poin";
}

function getSetWins(match: StandardState): Record<TeamId, number> {
  return match.sets.reduce(
    (wins, set) => {
      const winningTeam = set.teamA > set.teamB ? "teamA" : "teamB";
      return {
        ...wins,
        [winningTeam]: wins[winningTeam] + 1
      };
    },
    { teamA: 0, teamB: 0 }
  );
}

function getStandardProgress(match: StandardState): number {
  const targetSets = match.settings.format === "oneSet" ? 1 : 2;
  const setWins = getSetWins(match);
  const completedSetProgress = ((setWins.teamA + setWins.teamB) / targetSets) * 100;
  const activeSetProgress = ((match.games.teamA + match.games.teamB) / 13) * (100 / targetSets);

  return Math.min(100, completedSetProgress + activeSetProgress);
}

function getFinishedSummary(match: StandardState): string {
  if (match.winner === "teamA") {
    return "Tim A menang. Reset untuk mulai pertandingan baru.";
  }

  if (match.winner === "teamB") {
    return "Tim B menang. Reset untuk mulai pertandingan baru.";
  }

  return "Pertandingan selesai. Reset untuk mulai pertandingan baru.";
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
