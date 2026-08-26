import { describe, expect, it } from "vitest";
import { compareParallelTracks, DEFAULT_PARALLEL_TRACK_IDS, visibleParallelItems } from "./parallelTimeline";
import { decodeParallelTimelineUrl, encodeParallelTimelineUrl, initialParallelTimelineState, parallelTimelineReducer, pinAtMostTwo } from "./parallelTimelineMachine";

describe("parallel timeline state machine", () => {
  it("defaults to the three readable tracks", () => {
    expect(DEFAULT_PARALLEL_TRACK_IDS).toEqual(["politics", "city", "people"]);
  });

  it("does not allow the final visible track to disappear", () => {
    const state = { ...initialParallelTimelineState, visibleTrackIds: ["city" as const] };
    expect(parallelTimelineReducer(state, { type: "TOGGLE_TRACK", trackId: "city" })).toEqual(state);
  });

  it("scopes a chapter and returns focus to its first event", () => {
    const state = { ...initialParallelTimelineState, folioEventId: "linan" };
    expect(parallelTimelineReducer(state, { type: "SELECT_CHAPTER", chapterId: "transition" })).toMatchObject({ focusedEventId: "jingkang", folioEventId: null });
  });

  it("retains only the two most recent comparison events", () => {
    expect(pinAtMostTwo(["chanyuan", "jingkang"], "linan")).toEqual(["jingkang", "linan"]);
  });

  it("filters parallel items to the active chapter and tracks", () => {
    const items = visibleParallelItems("transition", ["politics", "city"]);
    expect(items.every((item) => ["jingkang", "linan"].includes(item.eventId))).toBe(true);
    expect(items.every((item) => ["politics", "city"].includes(item.trackId))).toBe(true);
  });

  it("drops invalid URL state instead of leaking unknown tracks", () => {
    expect(decodeParallelTimelineUrl("?parallelChapter=unknown&parallelTracks=city,invalid")).toEqual({ visibleTrackIds: ["city"] });
  });

  it("identifies per-track differences without treating them as causal links", () => {
    const comparison = compareParallelTracks("chanyuan", "linan", ["politics", "city", "knowledge"]);
    expect(comparison.map((item) => item.mode)).toEqual(["both", "both", "right-only"]);
  });

  it("preserves a maximum of two comparison nodes in a shareable URL", () => {
    const originalWindow = globalThis.window;
    Object.defineProperty(globalThis, "window", { configurable: true, value: { location: { search: "", pathname: "/", hash: "" } } });
    const url = encodeParallelTimelineUrl({ ...initialParallelTimelineState, focusedEventId: "jingkang", pinnedEventIds: ["chanyuan", "jingkang"] });
    expect(decodeParallelTimelineUrl(url.split("?")[1] ?? "")).toMatchObject({ focusedEventId: "jingkang", pinnedEventIds: ["chanyuan", "jingkang"] });
    Object.defineProperty(globalThis, "window", { configurable: true, value: originalWindow });
  });
});
