import { describe, expect, it } from "vitest";
import { nextTimelineIndex } from "./timelineNavigation";

describe("nextTimelineIndex", () => {
  it("moves forward and wraps from the final time node to the first", () => {
    expect(nextTimelineIndex(8, 3, 1)).toBe(4);
    expect(nextTimelineIndex(8, 7, 1)).toBe(0);
  });

  it("moves backward and wraps from the first time node to the final", () => {
    expect(nextTimelineIndex(8, 3, -1)).toBe(2);
    expect(nextTimelineIndex(8, 0, -1)).toBe(7);
  });

  it("treats an unmatched active node as the first visible item and handles an empty list", () => {
    expect(nextTimelineIndex(3, -1, 1)).toBe(1);
    expect(nextTimelineIndex(0, -1, 1)).toBe(-1);
  });
});
