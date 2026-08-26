import type { HistoryFacet, TimelineZoomId } from "./spatialExplorer";

export type TimelinePerspective = {
  category: string;
  zoom: TimelineZoomId;
  facets: HistoryFacet[];
  range: { start: number; end: number };
  query: string;
  eventId?: string;
};

const facetSet = new Set<HistoryFacet>(["政治", "军事外交", "制度", "经济生产", "城市水路", "技术知识", "思想文化"]);
const zoomSet = new Set<TimelineZoomId>(["outline", "chapter", "archive"]);

export function defaultTimelinePerspective(): TimelinePerspective {
  return { category: "全部", zoom: "chapter", facets: [], range: { start: 960, end: 1279 }, query: "" };
}

export function readTimelinePerspective(search = typeof window === "undefined" ? "" : window.location.search) {
  const defaults = defaultTimelinePerspective();
  const params = new URLSearchParams(search);
  const zoom = params.get("tz");
  const start = Number(params.get("ts"));
  const end = Number(params.get("te"));
  return {
    category: params.get("tc") || defaults.category,
    zoom: zoomSet.has(zoom as TimelineZoomId) ? zoom as TimelineZoomId : defaults.zoom,
    facets: (params.get("tf") || "").split(",").filter((item): item is HistoryFacet => facetSet.has(item as HistoryFacet)),
    range: { start: Number.isFinite(start) && start >= 960 && start <= 1279 ? start : defaults.range.start, end: Number.isFinite(end) && end >= 960 && end <= 1279 ? end : defaults.range.end },
    query: (params.get("tq") || "").slice(0, 80),
    eventId: params.get("tevent") || undefined,
  } satisfies TimelinePerspective;
}

export function makeTimelinePerspectiveUrl(perspective: TimelinePerspective, base = typeof window === "undefined" ? "https://songli.local/" : window.location.href) {
  const url = new URL(base);
  url.searchParams.set("tc", perspective.category);
  url.searchParams.set("tz", perspective.zoom);
  url.searchParams.set("ts", String(Math.min(perspective.range.start, perspective.range.end)));
  url.searchParams.set("te", String(Math.max(perspective.range.start, perspective.range.end)));
  if (perspective.facets.length) url.searchParams.set("tf", perspective.facets.join(",")); else url.searchParams.delete("tf");
  if (perspective.query) url.searchParams.set("tq", perspective.query); else url.searchParams.delete("tq");
  if (perspective.eventId) url.searchParams.set("tevent", perspective.eventId); else url.searchParams.delete("tevent");
  url.hash = "time-spine";
  return url.toString();
}
