import { describe, expect, it } from "vitest";
import { quickScore21Rules, quickStandardRules, ruleCategories } from "./rulesContent";

describe("rulesContent", () => {
  it("contains the MVP rules categories for beginners", () => {
    expect(ruleCategories.map((category) => category.title)).toEqual([
      "Dasar permainan",
      "Servis",
      "Kaca dan pagar",
      "Skor",
      "Kesalahan umum",
      "FAQ pemula"
    ]);
  });

  it("contains quick Score 21 rules for the scoreboard panel", () => {
    expect(quickScore21Rules.length).toBeGreaterThanOrEqual(4);
    expect(quickScore21Rules.some((rule) => rule.text.includes("21"))).toBe(true);
    expect(quickScore21Rules.some((rule) => rule.text.includes("5 reli"))).toBe(true);
  });

  it("contains quick Padel Standard rules for the scoreboard panel", () => {
    expect(quickStandardRules.length).toBeGreaterThanOrEqual(5);
    expect(quickStandardRules.some((rule) => rule.text.includes("Deuce"))).toBe(true);
    expect(quickStandardRules.some((rule) => rule.text.includes("Golden"))).toBe(true);
    expect(quickStandardRules.some((rule) => rule.text.includes("tie-break"))).toBe(true);
  });
});
