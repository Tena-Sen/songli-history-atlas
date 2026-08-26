import { describe, expect, it } from "vitest";
import { getNarrativeSlice, NARRATIVE_SLICES } from "./narrativeSlices";

describe("narrative slices", () => {
  it("keeps both emperor and minister perspectives linked to valid Songli time-axis identifiers", () => {
    expect(NARRATIVE_SLICES.map((slice) => slice.type)).toContain("皇帝");
    expect(NARRATIVE_SLICES.map((slice) => slice.type)).toContain("名臣");
    expect(getNarrativeSlice("gaozong")?.nodeIds).toEqual(["jingkang", "linan"]);
    expect(getNarrativeSlice("unknown")?.id).toBe("huizong");
  });
});
