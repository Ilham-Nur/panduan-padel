import type { Score21State } from "../domain/scoring/score21Engine";
import type { StandardGames, StandardMatchFormat, StandardSetScore, StandardState } from "../domain/scoring/standardEngine";
import type { ISODateString, TeamId } from "../domain/scoring/types";
import { deleteFromStore, readAllFromStore, STORE_MATCH_HISTORY, writeToStore } from "./indexedDb";

type BaseHistoryRecord = {
  id: string;
  teamA: {
    name: string;
    players: string;
  };
  teamB: {
    name: string;
    players: string;
  };
  winner: TeamId | null;
  startedAt: ISODateString | null;
  finishedAt: ISODateString;
  durationSeconds: number;
};

export type Score21HistoryRecord = BaseHistoryRecord & {
  mode: "score21";
  teamA: BaseHistoryRecord["teamA"] & {
    score: number;
  };
  teamB: BaseHistoryRecord["teamB"] & {
    score: number;
  };
  totalReli: number;
};

export type StandardHistoryRecord = BaseHistoryRecord & {
  mode: "standard";
  settings: {
    format: StandardMatchFormat;
  };
  games: StandardGames;
  sets: StandardSetScore[];
};

export type MatchHistoryRecord = Score21HistoryRecord | StandardHistoryRecord;

export function createScore21HistoryRecord(match: Score21State): Score21HistoryRecord | null {
  if (match.status !== "finished" || match.finishedAt === null) {
    return null;
  }

  return {
    id: `score21-${match.finishedAt}`,
    mode: "score21",
    teamA: {
      name: match.teamA.name,
      players: match.teamA.players,
      score: match.teamA.score
    },
    teamB: {
      name: match.teamB.name,
      players: match.teamB.players,
      score: match.teamB.score
    },
    winner: match.winner,
    startedAt: match.startedAt,
    finishedAt: match.finishedAt,
    durationSeconds: getDurationSeconds(match.startedAt, match.finishedAt),
    totalReli: match.totalReli
  };
}

export function createStandardHistoryRecord(match: StandardState): StandardHistoryRecord | null {
  if (match.status !== "finished" || match.finishedAt === null) {
    return null;
  }

  return {
    id: `standard-${match.finishedAt}`,
    mode: "standard",
    teamA: {
      name: match.teamA.name,
      players: match.teamA.players
    },
    teamB: {
      name: match.teamB.name,
      players: match.teamB.players
    },
    winner: match.winner,
    startedAt: match.startedAt,
    finishedAt: match.finishedAt,
    durationSeconds: getDurationSeconds(match.startedAt, match.finishedAt),
    settings: {
      format: match.settings.format
    },
    games: match.games,
    sets: match.sets
  };
}

export async function saveMatchHistoryRecord(record: MatchHistoryRecord): Promise<void> {
  await writeToStore(STORE_MATCH_HISTORY, record);
}

export async function deleteMatchHistoryRecord(id: string): Promise<void> {
  await deleteFromStore(STORE_MATCH_HISTORY, id);
}

export async function loadMatchHistory(): Promise<MatchHistoryRecord[]> {
  const records = await readAllFromStore<MatchHistoryRecord>(STORE_MATCH_HISTORY);
  return records.sort((left, right) => right.finishedAt.localeCompare(left.finishedAt));
}

function getDurationSeconds(startedAt: ISODateString | null, finishedAt: ISODateString): number {
  if (startedAt === null) {
    return 0;
  }

  return Math.max(0, Math.round((Date.parse(finishedAt) - Date.parse(startedAt)) / 1000));
}
