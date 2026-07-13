import { describe, expect, it } from "vitest";
import { addScore21Point, createScore21Match, selectScore21FirstServer } from "../../domain/scoring/score21Engine";
import type { StandardHistoryRecord } from "../../storage/matchHistoryRepository";
import { getActiveScore21Summary, getActiveStandardSummary, getLatestHistorySummary } from "./homePageSummary";
import { addStandardPoint, createStandardMatch, selectStandardFirstServer } from "../../domain/scoring/standardEngine";

describe("homePageSummary", () => {
  it("does not show a blank Score 21 draft as resumable", () => {
    expect(getActiveScore21Summary(createScore21Match())).toBeNull();
  });

  it("summarizes an active Score 21 match", () => {
    const withServer = selectScore21FirstServer(createScore21Match(), "teamA");
    const match = addScore21Point(withServer, "teamA", { occurredAt: "2026-07-13T02:00:00.000Z" });

    expect(getActiveScore21Summary(match)).toMatchObject({
      modeLabel: "Skor 21",
      title: "Tim A 1 - 0 Tim B",
      statValue: "1/21",
      to: "/match/score-21"
    });
  });

  it("summarizes an active Padel Standard match", () => {
    const withServer = selectStandardFirstServer(createStandardMatch(), "teamB");
    const match = addStandardPoint(withServer, "teamB", { occurredAt: "2026-07-13T02:00:00.000Z" });

    expect(getActiveStandardSummary(match)).toMatchObject({
      modeLabel: "Padel Standar",
      title: "Tim A 0-15 Tim B",
      statValue: "0-0",
      to: "/match/standard"
    });
  });

  it("summarizes the latest standard history record", () => {
    const record: StandardHistoryRecord = {
      id: "standard-2026-07-13T02:00:00.000Z",
      mode: "standard",
      teamA: { name: "Tim A", players: "Pemain 1 & Pemain 2" },
      teamB: { name: "Tim B", players: "Pemain 3 & Pemain 4" },
      winner: "teamA",
      startedAt: "2026-07-13T01:30:00.000Z",
      finishedAt: "2026-07-13T02:00:00.000Z",
      durationSeconds: 1800,
      settings: { format: "oneSet" },
      games: { teamA: 0, teamB: 0 },
      sets: [{ teamA: 6, teamB: 4 }]
    };

    expect(getLatestHistorySummary(record)).toMatchObject({
      modeLabel: "Padel Standar",
      title: "Tim A 6-4 Tim B",
      subtitle: "Pemenang: Tim A",
      statValue: "30m 0s",
      to: "/history"
    });
  });
});
