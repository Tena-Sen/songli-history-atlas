import { describe, expect, it } from "vitest";
import { relationshipPositions } from "./relationshipGraph";

describe("relationship graph layout", () => {
  it("spreads same-period nodes across semantic lanes instead of a single fallback point", () => {
    const points = relationshipPositions([{ id: "qingli-war", year: "1040—1044" }, { id: "qingli-reforms", year: "1043—1045" }, { id: "wujing-zongyao", year: "1044" }]);
    expect(new Set(points.map((point) => point.y)).size).toBe(3);
    expect(points.every((point) => point.x >= 6 && point.x <= 94)).toBe(true);
  });
});
