import { describe, expect, it } from "vitest";
import { makeTimelinePerspectiveUrl, readTimelinePerspective } from "./timelinePerspective";

describe("timeline perspective", () => {
  it("round trips current filters, density, range and focus into a share URL", () => {
    const url = makeTimelinePerspectiveUrl({ category: "城市", zoom: "archive", facets: ["城市水路", "经济生产"], range: { start: 1127, end: 1279 }, query: "泉州", eventId: "zhu-fan-zhi" }, "https://songli.example/");
    expect(readTimelinePerspective(new URL(url).search)).toEqual({ category: "城市", zoom: "archive", facets: ["城市水路", "经济生产"], range: { start: 1127, end: 1279 }, query: "泉州", eventId: "zhu-fan-zhi" });
  });
});
