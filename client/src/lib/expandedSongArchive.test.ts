import { describe, expect, it } from "vitest";
import { archiveEntriesForCity, archiveYear, EXPANDED_SONG_ARCHIVE } from "./expandedSongArchive";

describe("expanded Song archive", () => {
  it("provides sourced, distinct and chronologically readable expansion nodes", () => {
    expect(EXPANDED_SONG_ARCHIVE).toHaveLength(13);
    expect(new Set(EXPANDED_SONG_ARCHIVE.map((entry) => entry.id)).size).toBe(EXPANDED_SONG_ARCHIVE.length);
    expect(EXPANDED_SONG_ARCHIVE.every((entry) => entry.sourceUrl.startsWith("https://") && entry.context.length >= 3)).toBe(true);
  });

  it("normalizes period labels for timeline sorting", () => {
    expect(archiveYear("11世纪")).toBe(1040);
    expect(archiveYear("12世纪")).toBe(1160);
    expect(archiveYear("1040—1044")).toBe(1040);
  });

  it("provides structured city reading slices without claiming citywide causation", () => {
    const quanzhou = archiveEntriesForCity("quanzhou");
    expect(quanzhou.map((entry) => entry.id)).toEqual(["southern-sea-routes", "zhu-fan-zhi", "song-shipwreck"]);
    expect(quanzhou.every((entry) => entry.cityIds?.includes("quanzhou") && entry.sourceUrl.startsWith("https://"))).toBe(true);
  });
});
