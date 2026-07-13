import { describe, expect, it } from "vitest";
import {
  addScore21Point,
  createScore21Match,
  endScore21Match,
  getScore21CurrentServer,
  getScore21RemainingServe,
  resetScore21Match,
  selectScore21FirstServer,
  undoScore21Point,
  updateScore21Teams
} from "./score21Engine";
import type { Score21State } from "./score21Engine";
import type { TeamId } from "./types";

function readyMatch(firstServer: TeamId = "teamA") {
  return selectScore21FirstServer(createScore21Match(), firstServer);
}

function playPoints(state: Score21State, scoringTeams: TeamId[]) {
  return scoringTeams.reduce((match, scoringTeam, index) => {
    return addScore21Point(match, scoringTeam, { occurredAt: `2026-01-01T00:00:${String(index).padStart(2, "0")}Z` });
  }, state);
}

function repeatTeam(team: TeamId, count: number) {
  return Array<TeamId>(count).fill(team);
}

describe("score21Engine", () => {
  it("sets Team A as the first server", () => {
    const state = readyMatch("teamA");

    expect(state.firstServer).toBe("teamA");
    expect(state.currentServer).toBe("teamA");
    expect(state.remainingServe).toBe(5);
    expect(state.status).toBe("setup");
  });

  it("sets Team B as the first server", () => {
    const state = readyMatch("teamB");

    expect(state.firstServer).toBe("teamB");
    expect(state.currentServer).toBe("teamB");
    expect(state.remainingServe).toBe(5);
    expect(state.status).toBe("setup");
  });

  it("rotates service every 5 rallies", () => {
    const state = readyMatch("teamA");

    expect(getScore21CurrentServer(0, state.firstServer ?? "teamA")).toBe("teamA");
    expect(getScore21CurrentServer(5, state.firstServer ?? "teamA")).toBe("teamB");
    expect(getScore21CurrentServer(10, state.firstServer ?? "teamA")).toBe("teamA");
    expect(getScore21CurrentServer(15, state.firstServer ?? "teamA")).toBe("teamB");
  });

  it("returns to the first server for rally 21", () => {
    const state = playPoints(readyMatch("teamA"), repeatTeam("teamA", 20));

    expect(state.totalReli).toBe(20);
    expect(state.currentServer).toBe("teamA");
    expect(state.remainingServe).toBe(1);
    expect(getScore21RemainingServe(20)).toBe(1);
  });

  it("finishes with an 11-10 result", () => {
    const state = playPoints(readyMatch("teamA"), [...repeatTeam("teamA", 11), ...repeatTeam("teamB", 10)]);

    expect(state.teamA.score).toBe(11);
    expect(state.teamB.score).toBe(10);
    expect(state.totalReli).toBe(21);
    expect(state.status).toBe("finished");
    expect(state.winner).toBe("teamA");
  });

  it("finishes with a 13-8 result", () => {
    const state = playPoints(readyMatch("teamB"), [...repeatTeam("teamB", 8), ...repeatTeam("teamA", 13)]);

    expect(state.teamA.score).toBe(13);
    expect(state.teamB.score).toBe(8);
    expect(state.totalReli).toBe(21);
    expect(state.status).toBe("finished");
    expect(state.winner).toBe("teamA");
  });

  it("undoes a point before service rotation", () => {
    const state = playPoints(readyMatch("teamA"), repeatTeam("teamA", 4));
    const undone = undoScore21Point(state);

    expect(undone.teamA.score).toBe(3);
    expect(undone.totalReli).toBe(3);
    expect(undone.currentServer).toBe("teamA");
    expect(undone.remainingServe).toBe(2);
    expect(undone.status).toBe("inProgress");
  });

  it("undoes a point after service rotation", () => {
    const state = playPoints(readyMatch("teamA"), repeatTeam("teamA", 6));
    const undone = undoScore21Point(state);

    expect(undone.teamA.score).toBe(5);
    expect(undone.totalReli).toBe(5);
    expect(undone.currentServer).toBe("teamB");
    expect(undone.remainingServe).toBe(5);
    expect(undone.status).toBe("inProgress");
  });

  it("undoes from a finished match", () => {
    const state = playPoints(readyMatch("teamA"), [...repeatTeam("teamA", 11), ...repeatTeam("teamB", 10)]);
    const undone = undoScore21Point(state);

    expect(undone.totalReli).toBe(20);
    expect(undone.teamA.score).toBe(11);
    expect(undone.teamB.score).toBe(9);
    expect(undone.status).toBe("inProgress");
    expect(undone.winner).toBeNull();
    expect(undone.currentServer).toBe("teamA");
    expect(undone.remainingServe).toBe(1);
  });

  it("updates team names with readable trimmed values", () => {
    const state = updateScore21Teams(createScore21Match(), {
      teamA: { name: "Smash A", players: "Ana   &   Bima" }
    });

    expect(state.teamA.name).toBe("Smash A");
    expect(state.teamA.players).toBe("Ana & Bima");
  });

  it("allows team text fields to be cleared while editing", () => {
    const state = updateScore21Teams(createScore21Match(), {
      teamB: { players: "" }
    });

    expect(state.teamB.players).toBe("");
  });

  it("resets the match while keeping edited team labels", () => {
    const namedState = updateScore21Teams(readyMatch("teamA"), {
      teamA: { name: "Hijau", players: "Ari & Dito" },
      teamB: { name: "Putih", players: "Nina & Sari" }
    });
    const playedState = playPoints(namedState, repeatTeam("teamA", 3));
    const resetState = resetScore21Match(playedState);

    expect(resetState.teamA.name).toBe("Hijau");
    expect(resetState.teamA.players).toBe("Ari & Dito");
    expect(resetState.teamB.name).toBe("Putih");
    expect(resetState.teamA.score).toBe(0);
    expect(resetState.firstServer).toBeNull();
  });

  it("ends an in-progress match manually", () => {
    const state = playPoints(readyMatch("teamA"), [...repeatTeam("teamA", 6), ...repeatTeam("teamB", 4)]);
    const endedState = endScore21Match(state, "2026-01-01T00:10:00Z");

    expect(endedState.status).toBe("finished");
    expect(endedState.winner).toBe("teamA");
    expect(endedState.currentServer).toBeNull();
    expect(endedState.remainingServe).toBe(0);
    expect(endedState.finishedAt).toBe("2026-01-01T00:10:00Z");
  });
});
