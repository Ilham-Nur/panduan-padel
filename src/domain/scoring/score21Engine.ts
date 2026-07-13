import type { ISODateString, MatchStatus, TeamId } from "./types";

export type Score21Team = {
  name: string;
  players: string;
  score: number;
};

type Score21StateFields = {
  mode: "score21";
  teamA: Score21Team;
  teamB: Score21Team;
  firstServer: TeamId | null;
  currentServer: TeamId | null;
  totalReli: number;
  remainingServe: number;
  status: MatchStatus;
  winner: TeamId | null;
  startedAt: ISODateString | null;
  finishedAt: ISODateString | null;
};

export type Score21Snapshot = Score21StateFields;

export type Score21State = Score21StateFields & {
  pointHistory: Score21Snapshot[];
};

export type Score21CreateOptions = {
  teamAName?: string;
  teamAPlayers?: string;
  teamBName?: string;
  teamBPlayers?: string;
};

export type Score21PointOptions = {
  occurredAt?: ISODateString;
};

export type Score21TeamUpdate = {
  name?: string;
  players?: string;
};

export type Score21TeamUpdates = {
  teamA?: Score21TeamUpdate;
  teamB?: Score21TeamUpdate;
};

const TARGET_RELI = 21;
const SERVICE_BLOCK_RELI = 5;

export function createScore21Match(options: Score21CreateOptions = {}): Score21State {
  return {
    mode: "score21",
    teamA: {
      name: options.teamAName ?? "Tim A",
      players: options.teamAPlayers ?? "Pemain 1 & Pemain 2",
      score: 0
    },
    teamB: {
      name: options.teamBName ?? "Tim B",
      players: options.teamBPlayers ?? "Pemain 3 & Pemain 4",
      score: 0
    },
    firstServer: null,
    currentServer: null,
    totalReli: 0,
    remainingServe: SERVICE_BLOCK_RELI,
    status: "setup",
    winner: null,
    pointHistory: [],
    startedAt: null,
    finishedAt: null
  };
}

export function selectScore21FirstServer(state: Score21State, firstServer: TeamId): Score21State {
  if (state.totalReli > 0 || state.status === "finished") {
    return state;
  }

  return {
    ...state,
    firstServer,
    currentServer: firstServer,
    remainingServe: getScore21RemainingServe(state.totalReli),
    status: "setup"
  };
}

export function addScore21Point(
  state: Score21State,
  scoringTeam: TeamId,
  options: Score21PointOptions = {}
): Score21State {
  if (state.status === "finished" || state.firstServer === null || state.totalReli >= TARGET_RELI) {
    return state;
  }

  const previousSnapshot = toScore21Snapshot(state);
  const nextTeamA = scoringTeam === "teamA" ? state.teamA.score + 1 : state.teamA.score;
  const nextTeamB = scoringTeam === "teamB" ? state.teamB.score + 1 : state.teamB.score;
  const nextTotalReli = nextTeamA + nextTeamB;
  const isFinished = nextTotalReli === TARGET_RELI;
  const nextWinner = isFinished ? getHigherScoreTeam(nextTeamA, nextTeamB) : null;

  return {
    ...state,
    teamA: { ...state.teamA, score: nextTeamA },
    teamB: { ...state.teamB, score: nextTeamB },
    totalReli: nextTotalReli,
    currentServer: isFinished ? null : getScore21CurrentServer(nextTotalReli, state.firstServer),
    remainingServe: isFinished ? 0 : getScore21RemainingServe(nextTotalReli),
    status: isFinished ? "finished" : "inProgress",
    winner: nextWinner,
    pointHistory: [...state.pointHistory, previousSnapshot],
    startedAt: state.startedAt ?? options.occurredAt ?? null,
    finishedAt: isFinished ? options.occurredAt ?? null : null
  };
}

export function undoScore21Point(state: Score21State): Score21State {
  const previousSnapshot = state.pointHistory.at(-1);

  if (previousSnapshot === undefined) {
    return state;
  }

  return {
    ...previousSnapshot,
    pointHistory: state.pointHistory.slice(0, -1)
  };
}

export function updateScore21Teams(state: Score21State, updates: Score21TeamUpdates): Score21State {
  return {
    ...state,
    teamA: {
      ...state.teamA,
      name: sanitizeTeamText(updates.teamA?.name, state.teamA.name),
      players: sanitizeTeamText(updates.teamA?.players, state.teamA.players)
    },
    teamB: {
      ...state.teamB,
      name: sanitizeTeamText(updates.teamB?.name, state.teamB.name),
      players: sanitizeTeamText(updates.teamB?.players, state.teamB.players)
    }
  };
}

export function endScore21Match(state: Score21State, finishedAt: ISODateString): Score21State {
  if (state.status === "finished") {
    return state;
  }

  return {
    ...state,
    status: "finished",
    currentServer: null,
    remainingServe: 0,
    winner: getWinnerOrNull(state.teamA.score, state.teamB.score),
    finishedAt
  };
}

export function resetScore21Match(state: Score21State): Score21State {
  return createScore21Match({
    teamAName: state.teamA.name,
    teamAPlayers: state.teamA.players,
    teamBName: state.teamB.name,
    teamBPlayers: state.teamB.players
  });
}

export function getScore21CurrentServer(totalReli: number, firstServer: TeamId): TeamId {
  const serviceBlock = Math.floor(totalReli / SERVICE_BLOCK_RELI);
  return serviceBlock % 2 === 0 ? firstServer : getOtherTeam(firstServer);
}

export function getScore21RemainingServe(totalReli: number): number {
  const remainingInBlock = SERVICE_BLOCK_RELI - (totalReli % SERVICE_BLOCK_RELI);
  const reliUntilFinish = TARGET_RELI - totalReli;
  return Math.min(remainingInBlock, reliUntilFinish);
}

function toScore21Snapshot(state: Score21State): Score21Snapshot {
  return {
    mode: state.mode,
    teamA: state.teamA,
    teamB: state.teamB,
    firstServer: state.firstServer,
    currentServer: state.currentServer,
    totalReli: state.totalReli,
    remainingServe: state.remainingServe,
    status: state.status,
    winner: state.winner,
    startedAt: state.startedAt,
    finishedAt: state.finishedAt
  };
}

function getOtherTeam(team: TeamId): TeamId {
  return team === "teamA" ? "teamB" : "teamA";
}

function getHigherScoreTeam(teamAScore: number, teamBScore: number): TeamId {
  return teamAScore > teamBScore ? "teamA" : "teamB";
}

function getWinnerOrNull(teamAScore: number, teamBScore: number): TeamId | null {
  if (teamAScore === teamBScore) {
    return null;
  }

  return getHigherScoreTeam(teamAScore, teamBScore);
}

function sanitizeTeamText(value: string | undefined, fallback: string): string {
  if (value === undefined) {
    return fallback;
  }

  return value.replace(/\s+/g, " ").slice(0, 40);
}
