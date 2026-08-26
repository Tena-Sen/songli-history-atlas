export type GeoLayerId = "administrative" | "waterways" | "ports";
export type GeoLayerKind = "州县" | "运河" | "港口";
export type HistoryFacet = "政治" | "军事外交" | "制度" | "经济生产" | "城市水路" | "技术知识" | "思想文化";
export type TimelineZoomId = "outline" | "chapter" | "archive";

export type GeoOverlayPoint = {
  id: string;
  name: string;
  ancientName: string;
  kind: GeoLayerKind;
  layerIds: GeoLayerId[];
  x: number;
  y: number;
  period: string;
  description: string;
  eventIds: string[];
  cityId?: string;
  visibleFrom?: number;
  visibleTo?: number;
};

export const GEO_LAYERS: { id: GeoLayerId; label: string; note: string }[] = [
  { id: "administrative", label: "州县", note: "府州与县级阅读锚点" },
  { id: "waterways", label: "运河水路", note: "腹地、运河与水网关系" },
  { id: "ports", label: "港口海贸", note: "沿海港口与海上网络" },
];

/**
 * 示意锚点，而非坐标复原。行政名称的时间变化、辖区边界和航线里程不在本站呈现范围内。
 */
export const GEO_OVERLAY_POINTS: GeoOverlayPoint[] = [
  { id: "kaifeng-prefecture", name: "开封", ancientName: "开封府 · 东京", kind: "州县", layerIds: ["administrative"], x: 33, y: 15, period: "960—1127", description: "北宋都城及其府城阅读锚点。用于串联东京城市、北方关系与靖康危局，不呈现完整辖区边界。", eventIds: ["northern-song", "chanyuan", "huizong-art", "jingkang"], cityId: "dongjing", visibleFrom: 960, visibleTo: 1127 },
  { id: "jianghuai-counties", name: "江淮腹地", ancientName: "江淮州县", kind: "州县", layerIds: ["administrative", "waterways"], x: 50, y: 35, period: "北宋中期", description: "以江淮州县作为农业、水路与都城供给的阅读锚点；不将其当作一条精确行政边界。", eventIds: ["champa-rice", "iron-production"], visibleFrom: 1000, visibleTo: 1127 },
  { id: "linan-prefecture", name: "杭州", ancientName: "临安府", kind: "州县", layerIds: ["administrative", "waterways"], x: 67, y: 55, period: "1138—1276", description: "南宋行在与都城所在的府城阅读锚点。水路、市场与西湖周边城市生活可在此并读。", eventIds: ["linan", "zhu-xi", "linan-societies", "linan-fall"], cityId: "linan", visibleFrom: 1127, visibleTo: 1276 },
  { id: "qiantang-renhe", name: "杭州", ancientName: "钱塘、仁和二县", kind: "州县", layerIds: ["administrative", "waterways"], x: 63, y: 59, period: "南宋时期", description: "作为临安府城内的县级阅读标签，提示都城内部也有不同的行政与城市空间；本站不绘制两县边界。", eventIds: ["linan", "linan-societies"], cityId: "linan", visibleFrom: 1127, visibleTo: 1276 },
  { id: "mingzhou-prefecture", name: "宁波", ancientName: "明州", kind: "州县", layerIds: ["administrative", "ports"], x: 83, y: 60, period: "南宋时期", description: "明州既是州府阅读锚点，也指向浙东的港口联系；本站不以此复原港区范围。", eventIds: ["southern-sea-routes"], cityId: "mingzhou", visibleFrom: 1127, visibleTo: 1279 },
  { id: "quanzhou-prefecture", name: "泉州", ancientName: "泉州府", kind: "州县", layerIds: ["administrative", "ports"], x: 64, y: 84, period: "两宋时期", description: "泉州的府城与市舶、港口记录在此并读。它是海贸网络的入口之一，不代表所有沿海经验。", eventIds: ["southern-sea-routes", "zhu-fan-zhi", "song-shipwreck"], cityId: "quanzhou", visibleFrom: 960, visibleTo: 1279 },
  { id: "grand-canal-terminal", name: "杭州", ancientName: "大运河终端", kind: "运河", layerIds: ["waterways"], x: 61, y: 49, period: "两宋时期", description: "杭州位于大运河南端，作为贸易与城市生活的阅读锚点；线条仅表达水路关系。", eventIds: ["linan", "linan-societies"], cityId: "linan", visibleFrom: 1127, visibleTo: 1279 },
  { id: "zhedong-waterway", name: "浙东", ancientName: "浙东水网", kind: "运河", layerIds: ["waterways"], x: 75, y: 59, period: "南宋时期", description: "以浙东水网示意临安与明州的水路联系，避免将其误读为精确河道复原。", eventIds: ["linan", "southern-sea-routes"], cityId: "mingzhou", visibleFrom: 1127, visibleTo: 1279 },
  { id: "mingzhou-outer-port", name: "宁波", ancientName: "明州外港", kind: "港口", layerIds: ["ports", "waterways"], x: 87, y: 67, period: "南宋时期", description: "作为临安外港的阅读锚点，提示经明州与浙东水网进入杭州的转运关系；不等同于固定航线复原。", eventIds: ["linan", "southern-sea-routes"], cityId: "mingzhou", visibleFrom: 1127, visibleTo: 1279 },
  { id: "quanzhou-port", name: "泉州", ancientName: "刺桐港", kind: "港口", layerIds: ["ports"], x: 68, y: 81, period: "两宋时期", description: "宋代重要港口的阅读锚点。赵汝适、《诸蕃志》和1277海船考古提供不同性质的资料切片。", eventIds: ["zhu-fan-zhi", "song-shipwreck"], cityId: "quanzhou", visibleFrom: 960, visibleTo: 1279 },
  { id: "mingzhou-port", name: "宁波", ancientName: "明州港", kind: "港口", layerIds: ["ports"], x: 85, y: 65, period: "南宋时期", description: "以明州港提示江南都城、浙东水路与沿海贸易的关联，不代表单一贸易航线。", eventIds: ["southern-sea-routes"], cityId: "mingzhou", visibleFrom: 1127, visibleTo: 1279 },
  { id: "southeast-coast", name: "东南海域", ancientName: "沿海航路", kind: "港口", layerIds: ["ports"], x: 72, y: 91, period: "12—13世纪", description: "面向南海与印度洋的海上能力自12世纪起持续发展；本站以沿海航路作为主题阅读层，而非航行路径复原。", eventIds: ["southern-sea-routes", "zhu-fan-zhi", "song-shipwreck"], visibleFrom: 1127, visibleTo: 1279 },
];

export const HISTORY_FACETS: { id: HistoryFacet; label: string }[] = [
  { id: "政治", label: "政治" },
  { id: "军事外交", label: "军事外交" },
  { id: "制度", label: "制度" },
  { id: "经济生产", label: "经济生产" },
  { id: "城市水路", label: "城市水路" },
  { id: "技术知识", label: "技术知识" },
  { id: "思想文化", label: "思想文化" },
];

export const EVENT_FACETS: Record<string, HistoryFacet[]> = {
  "northern-song": ["政治", "制度"], chanyuan: ["政治", "军事外交"], "champa-rice": ["经济生产", "技术知识", "城市水路"], "movable-type": ["技术知识", "思想文化"], "qingli-war": ["军事外交", "政治"], "qingli-reforms": ["制度", "政治"], "wujing-zongyao": ["技术知识", "军事外交"], "new-policies": ["制度", "政治"], "iron-production": ["经济生产", "技术知识"], "huizong-art": ["思想文化", "政治"], "jin-rise": ["军事外交", "政治"], jingkang: ["政治", "军事外交"], "zhu-xi": ["思想文化", "制度"], linan: ["政治", "城市水路"], "southern-sea-routes": ["城市水路", "经济生产", "技术知识"], "zhu-fan-zhi": ["城市水路", "经济生产", "思想文化"], "jin-end": ["政治", "军事外交"], "linan-societies": ["城市水路", "思想文化"], "linan-fall": ["政治", "军事外交", "城市水路"], "song-shipwreck": ["城市水路", "经济生产", "技术知识"], "end-of-song": ["政治", "思想文化"],
};

export const TIMELINE_ZOOMS: { id: TimelineZoomId; label: string; note: string }[] = [
  { id: "outline", label: "纲要", note: "8个转折与主脊柱" },
  { id: "chapter", label: "章节", note: "13个时期锚点" },
  { id: "archive", label: "细读", note: "全部21个已编节点" },
];

const ZOOM_EVENT_IDS: Record<TimelineZoomId, string[]> = {
  outline: ["northern-song", "chanyuan", "movable-type", "new-policies", "jingkang", "linan", "linan-fall", "end-of-song"],
  chapter: ["northern-song", "chanyuan", "champa-rice", "qingli-war", "qingli-reforms", "movable-type", "new-policies", "jin-rise", "jingkang", "linan", "zhu-fan-zhi", "linan-fall", "end-of-song"],
  archive: Object.keys(EVENT_FACETS),
};

export function visibleGeoPoints(layerIds: GeoLayerId[]) {
  return GEO_OVERLAY_POINTS.filter((point) => point.layerIds.some((id) => layerIds.includes(id)));
}

export function visibleGeoPointsAtYear(layerIds: GeoLayerId[], year?: number) {
  const points = visibleGeoPoints(layerIds);
  if (!year) return points;
  return points.filter((point) => (point.visibleFrom ?? 960) <= year && (point.visibleTo ?? 1279) >= year);
}

export function reconcileGeoSelection(selectedId: string, visiblePoints: GeoOverlayPoint[]) {
  return visiblePoints.find((point) => point.id === selectedId) ?? visiblePoints[0];
}

export function geoPointsForCity(cityId: string) {
  return GEO_OVERLAY_POINTS.filter((point) => point.cityId === cityId);
}

export function eventMatchesFacets(eventId: string, activeFacets: HistoryFacet[]) {
  if (activeFacets.length === 0) return true;
  return activeFacets.every((facet) => EVENT_FACETS[eventId]?.includes(facet));
}

export function eventIdsForZoom(zoomId: TimelineZoomId) {
  return ZOOM_EVENT_IDS[zoomId];
}
