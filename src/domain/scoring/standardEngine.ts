import type { ISODateString, MatchStatus, TeamId } from "./types";

export type StandardPoint = 0 | 15 | 30 | 40;

export type StandardMatchFormat = "oneSet" | "bestOfThree";

export type StandardDeuceMode = "advantage" | "goldenPoint";

export type StandardTeam = {
  name: string;
  players: string;
  points: StandardPoint;
};

export type StandardSettings = {
  format: StandardMatchFormat;
  deuceMode: StandardDeuceMode;
  tieBreakAtSixAll: true;
};

export type StandardGames = Record<TeamId, number>;

export type TieBreakScore = Record<TeamId, number>;

export type StandardSetScore = StandardGames & {
  tieBreak?: TieBreakScore;
};

export type TieBreakState = {
  points: TieBreakScore;
  firstServer: TeamId;
  currentServer: TeamId;
};

type StandardStateFields = {
  mode: "standard";
  settings: StandardSettings;
  settingsLocked: boolean;
  teamA: StandardTeam;
  teamB: StandardTeam;
  deuce: boolean;
  advantage: TeamId | null;
  games: StandardGames;
  sets: StandardSetScore[];
  firstServer: TeamId | null;
  currentServer: TeamId | null;
  tieBreak: TieBreakState | null;
  status: MatchStatus;
  winner: TeamId | null;
  startedAt: ISODateString | null;
  finishedAt: ISODateString | null;
};

export type StandardSnapshot = StandardStateFields;

export type StandardState = StandardStateFields & {
  history: StandardSnapshot[];
};

export type StandardCreateOptions = {
  settings?: Partial<Pick<StandardSettings, "format" | "deuceMode">>;
  teamAName?: string;
  teamAPlayers?: string;
  teamBName?: string;
  teamBPlayers?: string;
};

export type StandardPointOptions = {
  occurredAt?: ISODateString;
};

export type StandardTeamUpdate = {
  name?: string;
  players?: string;
};

export type StandardTeamUpdates = {
  teamA?: StandardTeamUpdate;
  teamB?: StandardTeamUpdate;
};

const POINT_SEQUENCE: StandardPoint[] = [0, 15, 30, 40];

export function createStandardMatch(options: StandardCreateOptions = {}): StandardState {
  return {
    mode: "standard",
    settings: {
      format: options.settings?.format ?? "oneSet",
      deuceMode: options.settings?.deuceMode ?? "advantage",
      tieBreakAtSixAll: true
    },
    settingsLocked: false,
    teamA: {
      name: options.teamAName ?? "Tim A",
      players: options.teamAPlayers ?? "Pemain 1 & Pemain 2",
      points: 0
    },
    teamB: {
      name: options.teamBName ?? "Tim B",
      players: options.teamBPlayers ?? "Pemain 3 & Pemain 4",
      points: 0
    },
    deuce: false,
    advantage: null,
    games: { teamA: 0, teamB: 0 },
    sets: [],
    firstServer: null,
    currentServer: null,
    tieBreak: null,
    status: "setup",
    winner: null,
    history: [],
    startedAt: null,
    finishedAt: null
  };
}

export function selectStandardFirstServer(state: StandardState, firstServer: TeamId): StandardState {
  if (state.settingsLocked || state.status === "finished") {
    return state;
  }

  return {
    ...state,
    firstServer,
    currentServer: firstServer
  };
}

export function updateStandardSettings(state: StandardState, settings: Partial<StandardSettings>): StandardState {
  if (state.settingsLocked || state.status !== "setup") {
    return state;
  }

  return {
    ...state,
    settings: {
      ...state.settings,
      format: settings.format ?? state.settings.format,
      deuceMode: settings.deuceMode ?? state.settings.deuceMode,
      tieBreakAtSixAll: true
    }
  };
}

export function addStandardPoint(
  state: StandardState,
  scoringTeam: TeamId,
  options: StandardPointOptions = {}
): StandardState {
  if (state.status === "finished" || state.firstServer === null || state.currentServer === null) {
    return state;
  }

  const preparedState: StandardState = {
    ...state,
    settingsLocked: true,
    status: "inProgress",
    startedAt: state.startedAt ?? options.occurredAt ?? null,
    history: [...state.history, toStandardSnapshot(state)]
  };

  const nextState =
    preparedState.tieBreak === null
      ? addNormalPoint(preparedState, scoringTeam, options)
      : addTieBreakPoint(preparedState, scoringTeam, options);

  return nextState;
}

export function undoStandardPoint(state: StandardState): StandardState {
  const previousSnapshot = state.history.at(-1);

  if (previousSnapshot === undefined) {
    return state;
  }

  return {
    ...previousSnapshot,
    history: state.history.slice(0, -1)
  };
}

export function updateStandardTeams(state: StandardState, updates: StandardTeamUpdates): StandardState {
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

export function endStandardMatch(state: StandardState, finishedAt: ISODateString): StandardState {
  if (state.status === "finished") {
    return state;
  }

  return {
    ...state,
    status: "finished",
    currentServer: null,
    winner: getCurrentLeader(state),
    finishedAt
  };
}

export function resetStandardMatch(state: StandardState): StandardState {
  return createStandardMatch({
    settings: {
      format: state.settings.format,
      deuceMode: state.settings.deuceMode
    },
    teamAName: state.teamA.name,
    teamAPlayers: state.teamA.players,
    teamBName: state.teamB.name,
    teamBPlayers: state.teamB.players
  });
}

function addNormalPoint(
  state: StandardState,
  scoringTeam: TeamId,
  options: StandardPointOptions
): StandardState {
  if (state.deuce) {
    if (state.settings.deuceMode === "goldenPoint") {
      return completeGame(state, scoringTeam, options);
    }

    if (state.advantage === scoringTeam) {
      return completeGame(state, scoringTeam, options);
    }

    return {
      ...state,
      advantage: state.advantage === null ? scoringTeam : null
    };
  }

  const otherTeam = getOtherTeam(scoringTeam);
  const scoringPoints = state[scoringTeam].points;
  const otherPoints = state[otherTeam].points;

  if (scoringPoints === 40) {
    return completeGame(state, scoringTeam, options);
  }

  const nextPoints = getNextPoint(scoringPoints);
  const nextState = {
    ...state,
    [scoringTeam]: {
      ...state[scoringTeam],
      points: nextPoints
    }
  };

  if (nextPoints === 40 && otherPoints === 40) {
    return {
      ...nextState,
      deuce: true,
      advantage: null
    };
  }

  return nextState;
}

function addTieBreakPoint(
  state: StandardState,
  scoringTeam: TeamId,
  options: StandardPointOptions
): StandardState {
  if (state.tieBreak === null) {
    return state;
  }

  const nextPoints = {
    ...state.tieBreak.points,
    [scoringTeam]: state.tieBreak.points[scoringTeam] + 1
  };

  if (hasWonTieBreak(nextPoints, scoringTeam)) {
    const setScore = getTieBreakSetScore(scoringTeam);
    return completeSet(
      {
        ...state,
        games: setScore,
        tieBreak: null
      },
      scoringTeam,
      {
        ...setScore,
        tieBreak: nextPoints
      },
      getOtherTeam(state.tieBreak.firstServer),
      options
    );
  }

  const nextServer = getTieBreakCurrentServer(
    nextPoints.teamA + nextPoints.teamB,
    state.tieBreak.firstServer
  );

  return {
    ...state,
    currentServer: nextServer,
    tieBreak: {
      ...state.tieBreak,
      points: nextPoints,
      currentServer: nextServer
    }
  };
}

function completeGame(
  state: StandardState,
  scoringTeam: TeamId,
  options: StandardPointOptions
): StandardState {
  const nextGames = {
    ...state.games,
    [scoringTeam]: state.games[scoringTeam] + 1
  };
  const nextServer = state.currentServer === null ? null : getOtherTeam(state.currentServer);
  const resetPointState = resetPoints({
    ...state,
    games: nextGames,
    currentServer: nextServer
  });

  if (state.settings.tieBreakAtSixAll && nextGames.teamA === 6 && nextGames.teamB === 6 && nextServer !== null) {
    return {
      ...resetPointState,
      tieBreak: {
        points: { teamA: 0, teamB: 0 },
        firstServer: nextServer,
        currentServer: nextServer
      }
    };
  }

  if (hasWonSet(nextGames, scoringTeam)) {
    return completeSet(resetPointState, scoringTeam, nextGames, nextServer, options);
  }

  return resetPointState;
}

function completeSet(
  state: StandardState,
  scoringTeam: TeamId,
  setScore: StandardSetScore,
  nextServer: TeamId | null,
  options: StandardPointOptions
): StandardState {
  const nextSets = [...state.sets, setScore];
  const setWins = countSetWins(nextSets);
  const targetSets = state.settings.format === "oneSet" ? 1 : 2;
  const isMatchFinished = setWins[scoringTeam] >= targetSets;

  return {
    ...resetPoints(state),
    games: { teamA: 0, teamB: 0 },
    sets: nextSets,
    tieBreak: null,
    currentServer: isMatchFinished ? null : nextServer,
    status: isMatchFinished ? "finished" : "inProgress",
    winner: isMatchFinished ? scoringTeam : null,
    finishedAt: isMatchFinished ? options.occurredAt ?? null : null
  };
}

function resetPoints<T extends StandardState>(state: T): T {
  return {
    ...state,
    teamA: {
      ...state.teamA,
      points: 0
    },
    teamB: {
      ...state.teamB,
      points: 0
    },
    deuce: false,
    advantage: null
  };
}

function getNextPoint(point: StandardPoint): StandardPoint {
  return POINT_SEQUENCE[Math.min(POINT_SEQUENCE.indexOf(point) + 1, POINT_SEQUENCE.length - 1)];
}

function hasWonSet(games: StandardGames, team: TeamId): boolean {
  return games[team] >= 6 && games[team] - games[getOtherTeam(team)] >= 2;
}

function hasWonTieBreak(points: TieBreakScore, team: TeamId): boolean {
  return points[team] >= 7 && points[team] - points[getOtherTeam(team)] >= 2;
}

function getTieBreakSetScore(winningTeam: TeamId): StandardGames {
  const losingTeam = getOtherTeam(winningTeam);
  return {
    [winningTeam]: 7,
    [losingTeam]: 6
  } as StandardGames;
}

function getTieBreakCurrentServer(totalTieBreakPoints: number, firstServer: TeamId): TeamId {
  if (totalTieBreakPoints === 0) {
    return firstServer;
  }

  const serviceBlock = Math.floor((totalTieBreakPoints - 1) / 2);
  return serviceBlock % 2 === 0 ? getOtherTeam(firstServer) : firstServer;
}

function countSetWins(sets: StandardSetScore[]): Record<TeamId, number> {
  return sets.reduce(
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

function getCurrentLeader(state: StandardState): TeamId | null {
  const setWins = countSetWins(state.sets);

  if (setWins.teamA !== setWins.teamB) {
    return setWins.teamA > setWins.teamB ? "teamA" : "teamB";
  }

  if (state.games.teamA !== state.games.teamB) {
    return state.games.teamA > state.games.teamB ? "teamA" : "teamB";
  }

  const teamAPoints = state.tieBreak?.points.teamA ?? POINT_SEQUENCE.indexOf(state.teamA.points);
  const teamBPoints = state.tieBreak?.points.teamB ?? POINT_SEQUENCE.indexOf(state.teamB.points);

  if (teamAPoints === teamBPoints) {
    return null;
  }

  return teamAPoints > teamBPoints ? "teamA" : "teamB";
}

function toStandardSnapshot(state: StandardState): StandardSnapshot {
  return {
    mode: state.mode,
    settings: state.settings,
    settingsLocked: state.settingsLocked,
    teamA: state.teamA,
    teamB: state.teamB,
    deuce: state.deuce,
    advantage: state.advantage,
    games: state.games,
    sets: state.sets,
    firstServer: state.firstServer,
    currentServer: state.currentServer,
    tieBreak: state.tieBreak,
    status: state.status,
    winner: state.winner,
    startedAt: state.startedAt,
    finishedAt: state.finishedAt
  };
}

function getOtherTeam(team: TeamId): TeamId {
  return team === "teamA" ? "teamB" : "teamA";
}

function sanitizeTeamText(value: string | undefined, fallback: string): string {
  if (value === undefined) {
    return fallback;
  }

  return value.replace(/\s+/g, " ").slice(0, 40);
}
