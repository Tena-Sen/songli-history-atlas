export type PosterThemeName = "celadon" | "moon" | "silk";

export type PosterPreset = {
  id: string;
  name: string;
  title: string;
  subtitle: string;
  theme: PosterThemeName;
  createdAt: number;
};

export const POSTER_PRESET_STORAGE_KEY = "songli-poster-presets-v1";
const MAX_PRESETS = 8;

const themes: PosterThemeName[] = ["celadon", "moon", "silk"];

export const DEFAULT_POSTER_PRESETS: PosterPreset[] = [
  { id: "default-celadon", name: "天青初卷", title: "我的阅读路径", subtitle: "北宋至南宋 · 微观时间轴", theme: "celadon", createdAt: 0 },
  { id: "default-moon", name: "月墨夜读", title: "夜读宋历", subtitle: "沿一线天青，重读两宋", theme: "moon", createdAt: 0 },
  { id: "default-silk", name: "绢本地志", title: "江南地志", subtitle: "水路、城市与王朝余韵", theme: "silk", createdAt: 0 },
];

export function makePosterPreset(input: Omit<PosterPreset, "id" | "createdAt"> & { id?: string; createdAt?: number }): PosterPreset {
  const title = input.title.trim() || "我的阅读路径";
  const theme = themes.includes(input.theme) ? input.theme : "celadon";
  return {
    id: input.id ?? `preset-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    name: input.name.trim().slice(0, 18) || `${title.slice(0, 8)} · ${theme}`,
    title: title.slice(0, 12),
    subtitle: input.subtitle.trim().slice(0, 28) || "北宋至南宋 · 微观时间轴",
    theme,
    createdAt: input.createdAt ?? Date.now(),
  };
}

export function addPosterPreset(current: PosterPreset[], next: PosterPreset): PosterPreset[] {
  return [...current.filter((preset) => preset.id !== next.id), next].slice(-MAX_PRESETS);
}

export function removePosterPreset(current: PosterPreset[], id: string): PosterPreset[] {
  return current.filter((preset) => preset.id !== id);
}

export function posterFieldsFromPreset(preset: PosterPreset) {
  return { title: preset.title, subtitle: preset.subtitle, theme: preset.theme };
}

export function pickRandomPosterPreset(presets: PosterPreset[], random: () => number = Math.random): PosterPreset | undefined {
  if (!presets.length) return undefined;
  return presets[Math.min(presets.length - 1, Math.floor(random() * presets.length))];
}

export function parsePosterPresets(raw: string | null): PosterPreset[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter((item): item is PosterPreset => Boolean(item && typeof item.id === "string" && typeof item.name === "string" && typeof item.title === "string" && typeof item.subtitle === "string" && themes.includes(item.theme) && typeof item.createdAt === "number"))
      .slice(-MAX_PRESETS);
  } catch {
    return [];
  }
}
