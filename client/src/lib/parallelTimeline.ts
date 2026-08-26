export type ParallelTrackId = "politics" | "city" | "people" | "institution" | "knowledge";
export type ParallelChapterId = "all" | "northern" | "reform" | "late-northern" | "transition" | "southern" | "late-song";

export type ParallelTimelineEvent = {
  id: string;
  year: string;
  title: string;
  short: string;
  detail: string;
  tag: string;
  source: string;
  sourceUrl: string;
  tone: "celadon" | "seal" | "ink";
};

export type ParallelTrackDefinition = {
  id: ParallelTrackId;
  label: string;
  subtitle: string;
  defaultVisible: boolean;
};

export type ParallelTrackItem = {
  id: string;
  trackId: ParallelTrackId;
  eventId: string;
  rank: number;
  label: string;
  relationLabel: "事件锚点" | "城市阅读" | "人物入口" | "制度线索" | "知识线索";
  placeIds?: string[];
  personIds?: string[];
};

export type ParallelTrackComparison = {
  trackId: ParallelTrackId;
  mode: "both" | "left-only" | "right-only" | "empty";
  leftItems: ParallelTrackItem[];
  rightItems: ParallelTrackItem[];
};

export const PARALLEL_TRACKS: ParallelTrackDefinition[] = [
  { id: "politics", label: "政权转折", subtitle: "建宋、边境、断裂与承接", defaultVisible: true },
  { id: "city", label: "城市水路", subtitle: "东京、临安与沿海联系", defaultVisible: true },
  { id: "people", label: "人物行动", subtitle: "从人物入口回到事件", defaultVisible: true },
  { id: "institution", label: "制度", subtitle: "财政、军政与改革议题", defaultVisible: false },
  { id: "knowledge", label: "知识技艺", subtitle: "印刷、书籍与城市文化", defaultVisible: false },
];

export const PARALLEL_CHAPTERS: { id: ParallelChapterId; label: string; eventIds: string[] }[] = [
  { id: "all", label: "全卷", eventIds: ["northern-song", "chanyuan", "champa-rice", "qingli-war", "qingli-reforms", "wujing-zongyao", "movable-type", "new-policies", "iron-production", "huizong-art", "jin-rise", "jingkang", "zhu-xi", "linan", "southern-sea-routes", "zhu-fan-zhi", "jin-end", "linan-societies", "linan-fall", "song-shipwreck", "end-of-song"] },
  { id: "northern", label: "北宋建构", eventIds: ["northern-song", "chanyuan", "champa-rice"] },
  { id: "reform", label: "边境与变法", eventIds: ["qingli-war", "qingli-reforms", "wujing-zongyao", "movable-type", "new-policies", "iron-production"] },
  { id: "late-northern", label: "北宋晚期", eventIds: ["huizong-art", "jin-rise", "jingkang"] },
  { id: "transition", label: "断裂与南渡", eventIds: ["jingkang", "zhu-xi", "linan", "southern-sea-routes"] },
  { id: "southern", label: "江南与海贸", eventIds: ["zhu-xi", "linan", "southern-sea-routes", "zhu-fan-zhi", "linan-societies"] },
  { id: "late-song", label: "宋末与海上", eventIds: ["jin-end", "linan-societies", "linan-fall", "song-shipwreck", "end-of-song"] },
];

export const PARALLEL_TRACK_ITEMS: ParallelTrackItem[] = [
  { id: "politics-northern-song", trackId: "politics", eventId: "northern-song", rank: 1, label: "建宋 · 中央政权起笔", relationLabel: "事件锚点", placeIds: ["dongjing"], personIds: ["zhao-kuangyin"] },
  { id: "politics-chanyuan", trackId: "politics", eventId: "chanyuan", rank: 2, label: "澶渊 · 北方关系", relationLabel: "事件锚点", placeIds: ["dongjing"], personIds: ["song-zhenzong", "kou-zhun"] },
  { id: "politics-qingli-war", trackId: "politics", eventId: "qingli-war", rank: 4, label: "庆历战争 · 西北承压", relationLabel: "事件锚点", personIds: ["fan-zhongyan"] },
  { id: "politics-qingli-reforms", trackId: "politics", eventId: "qingli-reforms", rank: 5, label: "庆历改革 · 战时整饬", relationLabel: "制度线索", personIds: ["fan-zhongyan"] },
  { id: "politics-new-policies", trackId: "politics", eventId: "new-policies", rank: 8, label: "熙宁新法 · 国家能力", relationLabel: "事件锚点", personIds: ["wang-anshi", "song-shenzong"] },
  { id: "politics-jin-rise", trackId: "politics", eventId: "jin-rise", rank: 11, label: "金朝建立 · 北方再变", relationLabel: "事件锚点" },
  { id: "politics-jingkang", trackId: "politics", eventId: "jingkang", rank: 5, label: "东京危局 · 北宋终局", relationLabel: "事件锚点", placeIds: ["dongjing"], personIds: ["song-huizong", "song-qinzong", "song-gaozong"] },
  { id: "politics-linan", trackId: "politics", eventId: "linan", rank: 6, label: "行在 · 南迁承接", relationLabel: "事件锚点", placeIds: ["linan"], personIds: ["song-gaozong"] },
  { id: "politics-jin-end", trackId: "politics", eventId: "jin-end", rank: 17, label: "金朝终结 · 北方再转", relationLabel: "事件锚点" },
  { id: "politics-linan-fall", trackId: "politics", eventId: "linan-fall", rank: 7, label: "临安失守 · 都城之后", relationLabel: "事件锚点", placeIds: ["linan"], personIds: ["wen-tianxiang", "lu-xiufu"] },
  { id: "politics-end-of-song", trackId: "politics", eventId: "end-of-song", rank: 8, label: "崖山之后 · 王朝终章", relationLabel: "事件锚点", personIds: ["wen-tianxiang", "lu-xiufu"] },

  { id: "city-northern-song", trackId: "city", eventId: "northern-song", rank: 1, label: "东京 · 北宋政治中心", relationLabel: "城市阅读", placeIds: ["dongjing"], personIds: ["zhao-kuangyin"] },
  { id: "city-chanyuan", trackId: "city", eventId: "chanyuan", rank: 2, label: "东京 · 北方关系的都城背景", relationLabel: "城市阅读", placeIds: ["dongjing"] },
  { id: "city-champa-rice", trackId: "city", eventId: "champa-rice", rank: 3, label: "江淮 · 稻作与水网腹地", relationLabel: "城市阅读" },
  { id: "city-southern-sea-routes", trackId: "city", eventId: "southern-sea-routes", rank: 14, label: "港口与腹地 · 面向海洋", relationLabel: "城市阅读", placeIds: ["mingzhou", "quanzhou"] },
  { id: "city-zhu-fan-zhi", trackId: "city", eventId: "zhu-fan-zhi", rank: 15, label: "泉州 · 市舶与贸易书写", relationLabel: "城市阅读", placeIds: ["quanzhou"], personIds: ["zhao-rugua"] },
  { id: "city-linan-societies", trackId: "city", eventId: "linan-societies", rank: 18, label: "临安 · 城市社交切片", relationLabel: "城市阅读", placeIds: ["linan"] },
  { id: "city-song-shipwreck", trackId: "city", eventId: "song-shipwreck", rank: 20, label: "沿海 · 宋末沉船考古", relationLabel: "城市阅读", placeIds: ["quanzhou"] },
  { id: "city-jingkang", trackId: "city", eventId: "jingkang", rank: 5, label: "东京 · 危局与南迁转向", relationLabel: "城市阅读", placeIds: ["dongjing", "linan"] },
  { id: "city-linan", trackId: "city", eventId: "linan", rank: 6, label: "临安 · 行在、水路与商市", relationLabel: "城市阅读", placeIds: ["linan", "mingzhou", "quanzhou"], personIds: ["song-gaozong"] },
  { id: "city-linan-fall", trackId: "city", eventId: "linan-fall", rank: 7, label: "临安 · 都城失守", relationLabel: "城市阅读", placeIds: ["linan"] },
  { id: "city-end-of-song", trackId: "city", eventId: "end-of-song", rank: 8, label: "沿海末局 · 阅读继续", relationLabel: "城市阅读", placeIds: ["quanzhou"] },

  { id: "people-northern-song", trackId: "people", eventId: "northern-song", rank: 1, label: "赵匡胤 · 建宋入口", relationLabel: "人物入口", personIds: ["zhao-kuangyin"], placeIds: ["dongjing"] },
  { id: "people-chanyuan", trackId: "people", eventId: "chanyuan", rank: 2, label: "宋真宗、寇准 · 边境外交", relationLabel: "人物入口", personIds: ["song-zhenzong", "kou-zhun"], placeIds: ["dongjing"] },
  { id: "people-new-policies", trackId: "people", eventId: "new-policies", rank: 4, label: "王安石、宋神宗 · 改革政治", relationLabel: "人物入口", personIds: ["wang-anshi", "song-shenzong"] },
  { id: "people-qingli-reforms", trackId: "people", eventId: "qingli-reforms", rank: 5, label: "范仲淹 · 改革前史", relationLabel: "人物入口", personIds: ["fan-zhongyan"] },
  { id: "people-huizong-art", trackId: "people", eventId: "huizong-art", rank: 10, label: "宋徽宗 · 画院与宫廷", relationLabel: "人物入口", personIds: ["song-huizong"], placeIds: ["dongjing"] },
  { id: "people-jingkang", trackId: "people", eventId: "jingkang", rank: 5, label: "徽钦与高宗 · 危局与承接", relationLabel: "人物入口", personIds: ["song-huizong", "song-qinzong", "song-gaozong"], placeIds: ["dongjing", "linan"] },
  { id: "people-linan", trackId: "people", eventId: "linan", rank: 6, label: "宋高宗 · 临安行在", relationLabel: "人物入口", personIds: ["song-gaozong"], placeIds: ["linan"] },
  { id: "people-zhu-xi", trackId: "people", eventId: "zhu-xi", rank: 13, label: "朱熹 · 思想与教育", relationLabel: "人物入口", personIds: ["zhu-xi"] },
  { id: "people-zhu-fan-zhi", trackId: "people", eventId: "zhu-fan-zhi", rank: 15, label: "赵汝适 · 泉州文献", relationLabel: "人物入口", personIds: ["zhao-rugua"], placeIds: ["quanzhou"] },
  { id: "people-linan-fall", trackId: "people", eventId: "linan-fall", rank: 7, label: "文天祥、陆秀夫 · 宋末行动", relationLabel: "人物入口", personIds: ["wen-tianxiang", "lu-xiufu"], placeIds: ["linan"] },
  { id: "people-end-of-song", trackId: "people", eventId: "end-of-song", rank: 8, label: "人物行动 · 海上末局", relationLabel: "人物入口", personIds: ["wen-tianxiang", "lu-xiufu"] },

  { id: "institution-northern-song", trackId: "institution", eventId: "northern-song", rank: 1, label: "中央秩序与文官扩展", relationLabel: "制度线索" },
  { id: "institution-chanyuan", trackId: "institution", eventId: "chanyuan", rank: 2, label: "边境安排与军政财政", relationLabel: "制度线索" },
  { id: "institution-qingli-reforms", trackId: "institution", eventId: "qingli-reforms", rank: 5, label: "庆历改革 · 官僚整饬", relationLabel: "制度线索", personIds: ["fan-zhongyan"] },
  { id: "institution-new-policies", trackId: "institution", eventId: "new-policies", rank: 4, label: "熙宁新法 · 国家能力讨论", relationLabel: "制度线索", personIds: ["wang-anshi", "song-shenzong"] },
  { id: "institution-jingkang", trackId: "institution", eventId: "jingkang", rank: 5, label: "北方关系成为长期背景", relationLabel: "制度线索" },
  { id: "institution-zhu-fan-zhi", trackId: "institution", eventId: "zhu-fan-zhi", rank: 15, label: "市舶与港口知识记录", relationLabel: "制度线索", placeIds: ["quanzhou"], personIds: ["zhao-rugua"] },

  { id: "knowledge-movable-type", trackId: "knowledge", eventId: "movable-type", rank: 3, label: "活字印刷 · 知识复制的新路径", relationLabel: "知识线索", personIds: ["bi-sheng"] },
  { id: "knowledge-wujing", trackId: "knowledge", eventId: "wujing-zongyao", rank: 6, label: "《武经总要》 · 军技入册", relationLabel: "知识线索" },
  { id: "knowledge-new-policies", trackId: "knowledge", eventId: "new-policies", rank: 4, label: "制度讨论进入书页与政治", relationLabel: "知识线索" },
  { id: "knowledge-iron", trackId: "knowledge", eventId: "iron-production", rank: 9, label: "铁业 · 工艺与资源", relationLabel: "知识线索" },
  { id: "knowledge-huizong", trackId: "knowledge", eventId: "huizong-art", rank: 10, label: "画院 · 宫廷视觉制度", relationLabel: "知识线索", personIds: ["song-huizong"] },
  { id: "knowledge-linan", trackId: "knowledge", eventId: "linan", rank: 6, label: "城市、市场与知识生产", relationLabel: "知识线索", placeIds: ["linan", "quanzhou"] },
  { id: "knowledge-zhu-xi", trackId: "knowledge", eventId: "zhu-xi", rank: 13, label: "新儒学 · 思想与教育", relationLabel: "知识线索", personIds: ["zhu-xi"] },
  { id: "knowledge-zhu-fan", trackId: "knowledge", eventId: "zhu-fan-zhi", rank: 15, label: "《诸蕃志》 · 海贸世界", relationLabel: "知识线索", personIds: ["zhao-rugua"], placeIds: ["quanzhou"] },
  { id: "knowledge-end-of-song", trackId: "knowledge", eventId: "end-of-song", rank: 8, label: "遗产继续沿书页与城市流动", relationLabel: "知识线索" },
];

export const DEFAULT_PARALLEL_TRACK_IDS = PARALLEL_TRACKS.filter((track) => track.defaultVisible).map((track) => track.id);

export function chapterEventIds(chapterId: ParallelChapterId) {
  return PARALLEL_CHAPTERS.find((chapter) => chapter.id === chapterId)?.eventIds ?? PARALLEL_CHAPTERS[0].eventIds;
}

export function firstEventForChapter(chapterId: ParallelChapterId) {
  return chapterEventIds(chapterId)[0] ?? "northern-song";
}

export function visibleParallelItems(chapterId: ParallelChapterId, visibleTrackIds: ParallelTrackId[]) {
  const allowed = new Set(chapterEventIds(chapterId));
  return PARALLEL_TRACK_ITEMS.filter((item) => allowed.has(item.eventId) && visibleTrackIds.includes(item.trackId));
}

export function compareParallelTracks(leftEventId: string, rightEventId: string, trackIds: ParallelTrackId[] = DEFAULT_PARALLEL_TRACK_IDS): ParallelTrackComparison[] {
  return trackIds.map((trackId) => {
    const leftItems = PARALLEL_TRACK_ITEMS.filter((item) => item.trackId === trackId && item.eventId === leftEventId);
    const rightItems = PARALLEL_TRACK_ITEMS.filter((item) => item.trackId === trackId && item.eventId === rightEventId);
    const mode = leftItems.length > 0 && rightItems.length > 0 ? "both" : leftItems.length > 0 ? "left-only" : rightItems.length > 0 ? "right-only" : "empty";
    return { trackId, mode, leftItems, rightItems };
  });
}
