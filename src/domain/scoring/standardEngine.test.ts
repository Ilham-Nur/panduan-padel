import { describe, expect, it } from "vitest";
import {
  addStandardPoint,
  createStandardMatch,
  endStandardMatch,
  selectStandardFirstServer,
  undoStandardPoint,
  updateStandardSettings,
  updateStandardTeams
} from "./standardEngine";
import type { StandardState } from "./standardEngine";
import type { TeamId } from "./types";

function readyMatch(firstServer: TeamId = "teamA") {
  return selectStandardFirstServer(createStandardMatch(), firstServer);
}

function playPoints(state: StandardState, scoringTeams: TeamId[]) {
  return scoringTeams.reduce((match, scoringTeam, index) => {
    return addStandardPoint(match, scoringTeam, {
      occurredAt: `2026-01-01T00:00:${String(index).padStart(2, "0")}Z`
    });
  }, state);
}

function winGame(state: StandardState, team: TeamId) {
  return playPoints(state, [team, team, team, team]);
}

function winGames(state: StandardState, team: TeamId, count: number) {
  let match = state;

  for (let game = 0; game < count; game += 1) {
    match = winGame(match, team);
  }

  return match;
}

function reachSixAll(state: StandardState) {
  let match = state;

  for (let game = 0; game < 5; game += 1) {
    match = winGame(match, "teamA");
    match = winGame(match, "teamB");
  }

  match = winGame(match, "teamA");
  return winGame(match, "teamB");
}

describe("standardEngine", () => {
  it("sets the first server before the match starts", () => {
    const state = readyMatch("teamB");

    expect(state.firstServer).toBe("teamB");
    expect(state.currentServer).toBe("teamB");
    expect(state.status).toBe("setup");
  });

  it("progresses normal points and wins a game", () => {
    const state = playPoints(readyMatch("teamA"), ["teamA", "teamA", "teamA", "teamA"]);

    expect(state.teamA.points).toBe(0);
    expect(state.teamB.points).toBe(0);
    expect(state.games.teamA).toBe(1);
    expect(state.currentServer).toBe("teamB");
    expect(state.settingsLocked).toBe(true);
  });

  it("handles deuce, advantage, and game", () => {
    const state = playPoints(readyMatch("teamA"), [
      "teamA",
      "teamA",
      "teamA",
      "teamB",
      "teamB",
      "teamB",
      "teamA",
      "teamA"
    ]);

    expect(state.games.teamA).toBe(1);
    expect(state.deuce).toBe(false);
    expect(state.advantage).toBeNull();
  });

  it("cancels advantage back to deuce", () => {
    const state = playPoints(readyMatch("teamA"), [
      "teamA",
      "teamA",
      "teamA",
      "teamB",
      "teamB",
      "teamB",
      "teamA",
      "teamB"
    ]);

    expect(state.deuce).toBe(true);
    expect(state.advantage).toBeNull();
    expect(state.games.teamA).toBe(0);
  });

  it("uses golden point at 40-40 when configured", () => {
    const configured = updateStandardSettings(readyMatch("teamA"), { deuceMode: "goldenPoint" });
    const state = playPoints(configured, ["teamA", "teamA", "teamA", "teamB", "teamB", "teamB", "teamA"]);

    expect(state.games.teamA).toBe(1);
    expect(state.deuce).toBe(false);
    expect(state.advantage).toBeNull();
  });

  it("locks settings after the first point", () => {
    const state = playPoints(readyMatch("teamA"), ["teamA"]);
    const changed = updateStandardSettings(state, { deuceMode: "goldenPoint", format: "bestOfThree" });

    expect(changed.settingsLocked).toBe(true);
    expect(changed.settings.deuceMode).toBe("advantage");
    expect(changed.settings.format).toBe("oneSet");
  });

  it("wins a one-set match 6-4", () => {
    let state = readyMatch("teamA");
    state = winGames(state, "teamA", 5);
    state = winGames(state, "teamB", 4);
    state = winGame(state, "teamA");

    expect(state.sets).toEqual([{ teamA: 6, teamB: 4 }]);
    expect(state.status).toBe("finished");
    expect(state.winner).toBe("teamA");
  });

  it("wins a one-set match 7-5", () => {
    let state = readyMatch("teamA");
    state = winGames(state, "teamA", 5);
    state = winGames(state, "teamB", 5);
    state = winGames(state, "teamA", 2);

    expect(state.sets).toEqual([{ teamA: 7, teamB: 5 }]);
    expect(state.status).toBe("finished");
    expect(state.winner).toBe("teamA");
  });

  it("starts a tie-break at 6-6 and alternates tie-break service", () => {
    let state = reachSixAll(readyMatch("teamA"));

    expect(state.tieBreak).not.toBeNull();
    expect(state.tieBreak?.firstServer).toBe("teamA");
    expect(state.currentServer).toBe("teamA");

    state = addStandardPoint(state, "teamA");
    expect(state.currentServer).toBe("teamB");

    state = addStandardPoint(state, "teamB");
    expect(state.currentServer).toBe("teamB");

    state = addStandardPoint(state, "teamA");
    expect(state.currentServer).toBe("teamA");
  });

  it("wins a set in a tie-break", () => {
    let state = reachSixAll(readyMatch("teamA"));
    state = playPoints(state, [
      "teamA",
      "teamA",
      "teamA",
      "teamA",
      "teamA",
      "teamA",
      "teamB",
      "teamB",
      "teamB",
      "teamB",
      "teamB",
      "teamA"
    ]);

    expect(state.sets).toEqual([{ teamA: 7, teamB: 6, tieBreak: { teamA: 7, teamB: 5 } }]);
    expect(state.status).toBe("finished");
    expect(state.winner).toBe("teamA");
  });

  it("requires two sets in best of three", () => {
    let state = updateStandardSettings(readyMatch("teamA"), { format: "bestOfThree" });
    state = winGames(state, "teamA", 6);

    expect(state.status).toBe("inProgress");
    expect(state.winner).toBeNull();

    state = winGames(state, "teamA", 6);

    expect(state.status).toBe("finished");
    expect(state.winner).toBe("teamA");
    expect(state.sets).toEqual([
      { teamA: 6, teamB: 0 },
      { teamA: 6, teamB: 0 }
    ]);
  });

  it("undoes from a point", () => {
    const state = playPoints(readyMatch("teamA"), ["teamA", "teamA"]);
    const undone = undoStandardPoint(state);

    expect(undone.teamA.points).toBe(15);
    expect(undone.teamB.points).toBe(0);
    expect(undone.games.teamA).toBe(0);
  });

  it("undoes from a completed game", () => {
    const state = winGame(readyMatch("teamA"), "teamA");
    const undone = undoStandardPoint(state);

    expect(undone.teamA.points).toBe(40);
    expect(undone.games.teamA).toBe(0);
    expect(undone.currentServer).toBe("teamA");
  });

  it("undoes from a finished match", () => {
    const state = winGames(readyMatch("teamA"), "teamA", 6);
    const undone = undoStandardPoint(state);

    expect(undone.status).toBe("inProgress");
    expect(undone.winner).toBeNull();
    expect(undone.sets).toEqual([]);
    expect(undone.games.teamA).toBe(5);
    expect(undone.teamA.points).toBe(40);
  });

  it("updates team labels while allowing empty edit fields", () => {
    const state = updateStandardTeams(createStandardMatch(), {
      teamA: { name: "Padel A", players: "" }
    });

    expect(state.teamA.name).toBe("Padel A");
    expect(state.teamA.players).toBe("");
  });

  it("ends a standard match manually", () => {
    const state = winGames(readyMatch("teamA"), "teamA", 2);
    const ended = endStandardMatch(state, "2026-01-01T00:20:00Z");

    expect(ended.status).toBe("finished");
    expect(ended.winner).toBe("teamA");
    expect(ended.currentServer).toBeNull();
    expect(ended.finishedAt).toBe("2026-01-01T00:20:00Z");
  });
});
