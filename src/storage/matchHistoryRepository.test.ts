import { describe, expect, it } from "vitest";
import {
  addScore21Point,
  createScore21Match,
  selectScore21FirstServer,
  updateScore21Teams
} from "../domain/scoring/score21Engine";
import {
  addStandardPoint,
  createStandardMatch,
  selectStandardFirstServer,
  updateStandardSettings
} from "../domain/scoring/standardEngine";
import { createScore21HistoryRecord, createStandardHistoryRecord } from "./matchHistoryRepository";

describe("matchHistoryRepository helpers", () => {
  it("creates a Score 21 history record", () => {
    let match = updateScore21Teams(selectScore21FirstServer(createScore21Match(), "teamA"), {
      teamA: { players: "Ari / Bima" },
      teamB: { players: "Citra / Danu" }
    });

    for (let point = 0; point < 21; point += 1) {
      match = addScore21Point(match, point < 11 ? "teamA" : "teamB", {
        occurredAt: `2026-01-01T00:00:${String(point).padStart(2, "0")}Z`
      });
    }

    const record = createScore21HistoryRecord(match);

    expect(record?.mode).toBe("score21");
    expect(record?.teamA.score).toBe(11);
    expect(record?.teamA.players).toBe("Ari / Bima");
    expect(record?.teamB.players).toBe("Citra / Danu");
    expect(record?.totalReli).toBe(21);
  });

  it("creates a standard history record", () => {
    let match = updateStandardSettings(selectStandardFirstServer(createStandardMatch(), "teamA"), {
      format: "oneSet"
    });

    for (let game = 0; game < 6; game += 1) {
      for (let point = 0; point < 4; point += 1) {
        match = addStandardPoint(match, "teamA", {
          occurredAt: `2026-01-01T00:${String(game).padStart(2, "0")}:${String(point).padStart(2, "0")}Z`
        });
      }
    }

    const record = createStandardHistoryRecord(match);

    expect(record?.mode).toBe("standard");
    expect(record?.sets).toEqual([{ teamA: 6, teamB: 0 }]);
    expect(record?.settings.format).toBe("oneSet");
  });
});
