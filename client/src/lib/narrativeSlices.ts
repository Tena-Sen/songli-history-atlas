export type NarrativeSlice = {
  id: string;
  type: "皇帝" | "名臣";
  person: string;
  role: string;
  era: string;
  title: string;
  summary: string;
  narrativeHint: string;
  nodeIds: string[];
  sourceLabel: string;
  sourceUrl: string;
};

export const NARRATIVE_SLICES: NarrativeSlice[] = [
  {
    id: "huizong",
    type: "皇帝",
    person: "宋徽宗",
    role: "北宋晚期皇帝",
    era: "1125—1127 · 北方危局",
    title: "从联盟选择到东京危局",
    summary: "以北方秩序的改写、金军南下与东京失守为连续线索，读者看到的不是一个孤立的年份，而是一座都城如何被推入危局。",
    narrativeHint: "从“联金灭辽”这一争议性政策选择切入，但不把北宋覆亡归结为单一原因。",
    nodeIds: ["chanyuan", "jingkang"],
    sourceLabel: "中央广播电视总台靖康专题 / 《宋史》本纪入口",
    sourceUrl: "https://tv.cctv.com/v/a/ARTIDHsF5VXEqQvaBT0T0r9X210504.html",
  },
  {
    id: "gaozong",
    type: "皇帝",
    person: "宋高宗",
    role: "南宋开创者",
    era: "1127—1138 · 南迁与行在",
    title: "从北方断裂到江南重组",
    summary: "政权南移并非故事的尾声。南渡、临安行在、水路与商市共同组成新的政治地理，也让两宋分界拥有具体的城市形态。",
    narrativeHint: "将人物命运与都城、交通网络并读，避免把南迁写成单纯的逃离。",
    nodeIds: ["jingkang", "linan"],
    sourceLabel: "《宋史·高宗本纪》 / 临安城专题",
    sourceUrl: "https://zh.wikisource.org/wiki/宋史/卷030",
  },
  {
    id: "wang-anshi",
    type: "名臣",
    person: "王安石",
    role: "北宋改革者",
    era: "1069—1072 · 制度重塑",
    title: "一场改革如何进入国家日常",
    summary: "新法将财政、选官与军政并置；它既是改革者的行动，也是北宋国家能力与政治争论不断拉扯的现场。",
    narrativeHint: "从人物入场，再回到制度议题，让“变法”不只是一个抽象名词。",
    nodeIds: ["new-policies"],
    sourceLabel: "EBSCO 王安石改革专题",
    sourceUrl: "https://www.ebsco.com/research-starters/history/wang-anshi-introduces-bureaucratic-reforms/",
  },
  {
    id: "wen-tianxiang",
    type: "名臣",
    person: "文天祥",
    role: "南宋末年政治人物",
    era: "1276—1279 · 政权收缩",
    title: "都城失守之后，仍有人在路上",
    summary: "临安失守与崖山终局之间，南宋并未立刻消失。以文天祥等人的经历为线索，可读见政权收缩、行动选择与历史记忆如何交叠。",
    narrativeHint: "把“终局”拉长为一段人的行动史，而非只保留王朝落幕的结果。",
    nodeIds: ["linan-fall", "end-of-song"],
    sourceLabel: "维基文库《文天祥传》",
    sourceUrl: "https://zh.wikisource.org/wiki/文天祥傳",
  },
];

export function getNarrativeSlice(id: string) {
  return NARRATIVE_SLICES.find((slice) => slice.id === id) ?? NARRATIVE_SLICES[0];
}
