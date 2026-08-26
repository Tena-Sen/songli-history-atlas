import { describe, expect, it } from "vitest";
import { addPosterPreset, DEFAULT_POSTER_PRESETS, makePosterPreset, parsePosterPresets, pickRandomPosterPreset, posterFieldsFromPreset, removePosterPreset } from "./posterPresets";

describe("poster presets", () => {
  it("normalizes an untitled preset into a safe Songli reading-path preset", () => {
    const preset = makePosterPreset({ name: "", title: "", subtitle: "", theme: "celadon", id: "one", createdAt: 1 });
    expect(preset).toMatchObject({ id: "one", title: "我的阅读路径", subtitle: "北宋至南宋 · 微观时间轴", theme: "celadon" });
    expect(preset.name).toContain("我的阅读路径");
  });

  it("keeps only the latest eight presets and ignores malformed local storage values", () => {
    const presets = Array.from({ length: 9 }, (_, index) => makePosterPreset({ name: `预设${index}`, title: "宋历", subtitle: "路径", theme: "silk", id: `${index}`, createdAt: index }));
    const stored = presets.reduce(addPosterPreset, [] as typeof presets);
    expect(stored).toHaveLength(8);
    expect(stored[0]?.id).toBe("1");
    expect(parsePosterPresets("not-json")).toEqual([]);
    expect(parsePosterPresets(JSON.stringify([{ id: "x" }]))).toEqual([]);
  });

  it("supports the save, apply and delete lifecycle, including built-in Song-aesthetic schemes", () => {
    const saved = makePosterPreset({ name: "我的月墨", title: "夜读宋历", subtitle: "沿一线天青", theme: "moon", id: "moon", createdAt: 2 });
    const withSaved = addPosterPreset([], saved);
    expect(posterFieldsFromPreset(withSaved[0]!)).toEqual({ title: "夜读宋历", subtitle: "沿一线天青", theme: "moon" });
    expect(removePosterPreset(withSaved, "moon")).toEqual([]);
    expect(DEFAULT_POSTER_PRESETS.map((preset) => preset.theme)).toEqual(["celadon", "moon", "silk"]);
  });

  it("selects a deterministic random preset safely and handles an empty pool", () => {
    expect(pickRandomPosterPreset(DEFAULT_POSTER_PRESETS, () => 0.9)?.id).toBe("default-silk");
    expect(pickRandomPosterPreset([], () => 0.5)).toBeUndefined();
  });
});
