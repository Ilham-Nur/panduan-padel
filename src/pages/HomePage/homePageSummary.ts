import type { Score21State } from "../../domain/scoring/score21Engine";
import type { StandardState } from "../../domain/scoring/standardEngine";
import type { TeamId } from "../../domain/scoring/types";
import type { MatchHistoryRecord } from "../../storage/matchHistoryRepository";

export type HomeMatchSummary = {
  id: string;
  icon: string;
  modeLabel: string;
  title: string;
  subtitle: string;
  statLabel: string;
  statValue: string;
  to: string;
};

export function getActiveScore21Summary(match: Score21State | null): HomeMatchSummary | null {
  if (match === null || !isScore21ResumeCandidate(match)) {
    return null;
  }

  return {
    id: "active-score21",
    icon: "scoreboard",
    modeLabel: "Skor 21",
    title: `${match.teamA.name} ${match.teamA.score} - ${match.teamB.score} ${match.teamB.name}`,
    subtitle: getActiveScore21Subtitle(match),
    statLabel: "Reli",
    statValue: `${match.totalReli}/21`,
    to: "/match/score-21"
  };
}

export function getActiveStandardSummary(match: StandardState | null): HomeMatchSummary | null {
  if (match === null || !isStandardResumeCandidate(match)) {
    return null;
  }

  return {
    id: "active-standard",
    icon: "sports_tennis",
    modeLabel: "Padel Standar",
    title: `${match.teamA.name} ${getStandardScoreLine(match)} ${match.teamB.name}`,
    subtitle: getActiveStandardSubtitle(match),
    statLabel: "Game",
    statValue: `${match.games.teamA}-${match.games.teamB}`,
    to: "/match/standard"
  };
}

export function getLatestHistorySummary(record: MatchHistoryRecord | null): HomeMatchSummary | null {
  if (record === null) {
    return null;
  }

  if (record.mode === "score21") {
    return {
      id: record.id,
      icon: "history",
      modeLabel: "Skor 21",
      title: `${record.teamA.name} ${record.teamA.score} - ${record.teamB.score} ${record.teamB.name}`,
      subtitle: getHistoryWinnerText(record.winner, record.teamA.name, record.teamB.name),
      statLabel: "Durasi",
      statValue: formatDuration(record.durationSeconds),
      to: "/history"
    };
  }

  return {
    id: record.id,
    icon: "history",
    modeLabel: "Padel Standar",
    title: `${record.teamA.name} ${getStandardHistoryScoreLine(record)} ${record.teamB.name}`,
    subtitle: getHistoryWinnerText(record.winner, record.teamA.name, record.teamB.name),
    statLabel: "Durasi",
    statValue: formatDuration(record.durationSeconds),
    to: "/history"
  };
}

function isScore21ResumeCandidate(match: Score21State): boolean {
  return match.status !== "setup" || match.totalReli > 0 || match.startedAt !== null || match.finishedAt !== null;
}

function isStandardResumeCandidate(match: StandardState): boolean {
  return (
    match.status !== "setup" ||
    match.startedAt !== null ||
    match.finishedAt !== null ||
    match.history.length > 0 ||
    match.games.teamA + match.games.teamB > 0 ||
    match.sets.length > 0 ||
    match.teamA.points !== 0 ||
    match.teamB.points !== 0 ||
    match.tieBreak !== null
  );
}

function getActiveScore21Subtitle(match: Score21State): string {
  if (match.status === "finished") {
    return "Selesai, siap disimpan ke riwayat";
  }

  if (match.currentServer !== null) {
    return `Servis ${getTeamShortLabel(match.currentServer)}`;
  }

  return "Pertandingan sedang berjalan";
}

function getActiveStandardSubtitle(match: StandardState): string {
  if (match.status === "finished") {
    return "Selesai, siap disimpan ke riwayat";
  }

  if (match.tieBreak !== null) {
    return `Tie-break, servis ${getTeamShortLabel(match.currentServer)}`;
  }

  if (match.currentServer !== null) {
    return `Servis ${getTeamShortLabel(match.currentServer)}`;
  }

  return "Pertandingan sedang berjalan";
}

function getStandardScoreLine(match: StandardState): string {
  if (match.tieBreak !== null) {
    return `${match.tieBreak.points.teamA}-${match.tieBreak.points.teamB}`;
  }

  if (match.advantage === "teamA") {
    return "AD-40";
  }

  if (match.advantage === "teamB") {
    return "40-AD";
  }

  return `${match.teamA.points}-${match.teamB.points}`;
}

function getStandardHistoryScoreLine(record: Extract<MatchHistoryRecord, { mode: "standard" }>): string {
  if (record.sets.length > 0) {
    return record.sets.map((set) => `${set.teamA}-${set.teamB}`).join(", ");
  }

  return `${record.games.teamA}-${record.games.teamB}`;
}

function getHistoryWinnerText(winner: TeamId | null, teamAName: string, teamBName: string): string {
  if (winner === "teamA") {
    return `Pemenang: ${teamAName}`;
  }

  if (winner === "teamB") {
    return `Pemenang: ${teamBName}`;
  }

  return "Diakhiri tanpa pemenang";
}

function getTeamShortLabel(team: TeamId | null): string {
  if (team === "teamA") {
    return "Tim A";
  }

  if (team === "teamB") {
    return "Tim B";
  }

  return "-";
}

function formatDuration(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${minutes}m ${seconds}s`;
}
