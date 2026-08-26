import { describe, expect, it } from "vitest";
import { eventIdsForZoom, eventMatchesFacets, geoPointsForCity, reconcileGeoSelection, visibleGeoPoints } from "./spatialExplorer";

describe("spatial explorer data", () => {
  it("layers administrative, waterway and port anchors without claiming a single map mode", () => {
    expect(visibleGeoPoints(["administrative"]).some((point) => point.id === "linan-prefecture")).toBe(true);
    expect(visibleGeoPoints(["ports"]).some((point) => point.id === "quanzhou-port")).toBe(true);
    expect(geoPointsForCity("quanzhou").map((point) => point.id)).toEqual(["quanzhou-prefecture", "quanzhou-port"]);
  });

  it("matches all selected historical facets and moves from outline to archive density", () => {
    expect(eventMatchesFacets("zhu-fan-zhi", ["城市水路", "经济生产"])).toBe(true);
    expect(eventMatchesFacets("zhu-fan-zhi", ["军事外交"])).toBe(false);
    expect(eventIdsForZoom("outline")).toHaveLength(8);
    expect(eventIdsForZoom("chapter")).toHaveLength(13);
    expect(eventIdsForZoom("archive")).toHaveLength(21);
  });

  it("reconciles the selected annotation when its layer is hidden", () => {
    const administrative = visibleGeoPoints(["administrative"]);
    expect(reconcileGeoSelection("quanzhou-port", administrative)?.id).toBe("kaifeng-prefecture");
    expect(reconcileGeoSelection("linan-prefecture", administrative)?.id).toBe("linan-prefecture");
  });
});
