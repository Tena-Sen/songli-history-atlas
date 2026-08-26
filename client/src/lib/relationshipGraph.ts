import { EVENT_FACETS, type HistoryFacet } from "./spatialExplorer";

export type GraphEvent = { id: string; year: string };
export type RelationPosition = { id: string; x: number; y: number; facet: HistoryFacet };

const laneY: Record<HistoryFacet, number> = { 政治: 16, 军事外交: 30, 制度: 44, 经济生产: 58, 城市水路: 72, 技术知识: 84, 思想文化: 90 };

function yearNumber(year: string) {
  if (year.includes("世纪")) return 1040;
  return Number(year.match(/\d{3,4}/)?.[0] || 960);
}

export function relationshipPositions(events: GraphEvent[]): RelationPosition[] {
  const laneCounts = new Map<HistoryFacet, number>();
  return [...events].sort((a, b) => yearNumber(a.year) - yearNumber(b.year)).map((event) => {
    const facet = EVENT_FACETS[event.id]?.[0] ?? "政治";
    const count = laneCounts.get(facet) ?? 0;
    laneCounts.set(facet, count + 1);
    const x = 8 + ((yearNumber(event.year) - 960) / (1279 - 960)) * 84;
    const stagger = ((count % 3) - 1) * 4;
    return { id: event.id, x: Math.max(6, Math.min(94, x)), y: laneY[facet] + stagger, facet };
  });
}
