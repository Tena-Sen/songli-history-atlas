export type HistoryChainStage = {
  label: "前因" | "当下冲突" | "后续余波";
  title: string;
  description: string;
  nodeIds: string[];
};

export type HistoryChain = {
  id: string;
  year: string;
  event: string;
  note: string;
  stages: [HistoryChainStage, HistoryChainStage, HistoryChainStage];
  sourceLabel: string;
  sourceUrl: string;
};

export const HISTORY_CHAINS: HistoryChain[] = [
  {
    id: "northern-song", year: "960", event: "建宋：权力如何归拢", note: "从建宋起，统一、制度与城市增长被编进同一条脊柱。",
    stages: [
      { label: "前因", title: "分裂后的整合需求", description: "建宋被放在政权重新整合的起点阅读：新的中央权力需要重新组织文官、财政与地方秩序。", nodeIds: [] },
      { label: "当下冲突", title: "权力如何归拢", description: "这不是单一制度的建立，而是中央政权、文官秩序与治理方式彼此配合的持续过程。", nodeIds: ["northern-song"] },
      { label: "后续余波", title: "城市与制度同步扩展", description: "北宋的城市发展、知识生产与制度讨论，为后续事件提供了共同的社会背景。", nodeIds: ["movable-type", "new-policies"] },
    ],
    sourceLabel: "哥伦比亚大学：两宋分期与社会变化", sourceUrl: "https://afe.easia.columbia.edu/timelines/china_timeline.htm",
  },
  {
    id: "chanyuan", year: "1005", event: "澶渊：稳定的边境", note: "稳定不是静止，而是边境关系、财政与军政的暂时安排。",
    stages: [
      { label: "前因", title: "北方关系持续紧张", description: "北宋处理北方关系时，边境压力始终与财政和军事安排相互牵连。", nodeIds: ["northern-song"] },
      { label: "当下冲突", title: "以盟约换取稳定", description: "澶渊之盟成为北宋处理宋辽关系的重要节点，提示外交秩序如何进入国家日常。", nodeIds: ["chanyuan"] },
      { label: "后续余波", title: "稳定也留下新的问题", description: "相对稳定的边境环境让内政和城市发展继续展开，也使北方关系成为之后反复被重新判断的背景。", nodeIds: ["new-policies", "jingkang"] },
    ],
    sourceLabel: "Cambridge University Press：澶渊模式研究", sourceUrl: "https://www.cambridge.org/core/journals/journal-of-chinese-history/article/fragility-of-peace-song-chinas-northwestern-frontier-and-erosion-of-the-chanyuan-paradigm-in-the-mideleventh-century/AF2F19A32A23ED0F304C3DE814851A3F",
  },
  {
    id: "movable-type", year: "11世纪", event: "活字印刷", note: "技术突破并不孤立，它与书籍、教育和城市文化共同变化。",
    stages: [
      { label: "前因", title: "知识复制的需求", description: "雕版印刷、教育与书籍流通共同构成技术创新发生的社会环境。", nodeIds: ["northern-song"] },
      { label: "当下冲突", title: "活字进入印刷想象", description: "毕昇的活字记录提示知识复制有新的技术路径；同时，雕版印刷仍长期占据重要位置。", nodeIds: ["movable-type"] },
      { label: "后续余波", title: "书页与城市继续相遇", description: "技术、市场与城市生活彼此支撑，使知识生产成为两宋社会变化的一条微观轨道。", nodeIds: ["linan"] },
    ],
    sourceLabel: "哥伦比亚大学：宋代印刷技术", sourceUrl: "https://afe.easia.columbia.edu/songdynasty-module/tech-printing.html",
  },
  {
    id: "new-policies", year: "1069—1072", event: "熙宁新法：国家如何变法", note: "改革把财政、选官与军政放进同一张政治案头。",
    stages: [
      { label: "前因", title: "国家能力的议题累积", description: "财政、官员训练和军政组织的压力，让制度调整成为北宋政治不能回避的话题。", nodeIds: ["northern-song", "chanyuan"] },
      { label: "当下冲突", title: "改革与争论并行", description: "王安石新法涉及多项国家治理议题；政策创新与政治争论在同一时期持续展开。", nodeIds: ["new-policies"] },
      { label: "后续余波", title: "制度辩论留在历史里", description: "新法并未把政治问题终结，反而让国家如何治理、如何分配资源成为后续历史阅读的重要线索。", nodeIds: ["jingkang"] },
    ],
    sourceLabel: "EBSCO Research Starters：王安石改革", sourceUrl: "https://www.ebsco.com/research-starters/history/wang-anshi-introduces-bureaucratic-reforms/",
  },
  {
    id: "jingkang", year: "1127", event: "靖康：北方秩序的断裂", note: "联盟选择、边境压力、东京危局与政权南迁构成一条连续阅读链。",
    stages: [
      { label: "前因", title: "北方秩序被重新改写", description: "网站以联盟选择与北方关系变化作为阅读入口；它们是理解危机背景的线索，而非北宋覆亡的单一原因。", nodeIds: ["chanyuan"] },
      { label: "当下冲突", title: "东京危局与北宋终局", description: "1127 年，东京失守，北宋终结。以人物、都城和政权危机并读，能避免将事件缩减为单一年份。", nodeIds: ["jingkang"] },
      { label: "后续余波", title: "南迁重写政治地理", description: "政权向江南延续，临安、水路、商市与沿海联系被重新放大，南宋由此展开。", nodeIds: ["linan"] },
    ],
    sourceLabel: "中央广播电视总台：靖康专题 / 哥伦比亚大学分期资料", sourceUrl: "https://tv.cctv.com/v/a/ARTIDHsF5VXEqQvaBT0T0r9X210504.html",
  },
  {
    id: "linan", year: "1138", event: "临安行在：江南如何承接", note: "南迁不是尾声，而是新的政治地理、城市生活与水路网络的起笔。",
    stages: [
      { label: "前因", title: "政权需要新的承接空间", description: "北宋终局之后，南宋的政治延续与江南的城市、交通条件被放进同一问题之中。", nodeIds: ["jingkang"] },
      { label: "当下冲突", title: "行在成为新都城", description: "1138 年临安被定为行在所。都城身份与运河、水路、商市共同塑造其历史位置。", nodeIds: ["linan"] },
      { label: "后续余波", title: "江南与海上网络被放大", description: "临安与明州、泉州等节点的联系，让城市与贸易网络成为理解南宋的一条重要路径。", nodeIds: ["linan-fall"] },
    ],
    sourceLabel: "人民日报 / 中国大运河博物馆：临安城专题", sourceUrl: "http://paper.people.com.cn/rmrb/pad/content/202512/27/content_30127489.html",
  },
  {
    id: "linan-fall", year: "1276", event: "临安失守：都城之后的路", note: "失去都城并不等于故事立即终结；政权收缩与人的行动仍在继续。",
    stages: [
      { label: "前因", title: "南宋晚期的持续压力", description: "南宋后期的政权与军事压力逐步累积，都城的安全与资源联系愈发紧张。", nodeIds: ["linan"] },
      { label: "当下冲突", title: "临安失守", description: "1276 年临安失守，南宋失去长期政治中心。这是王朝级转折，但不是历史叙事的最后一句。", nodeIds: ["linan-fall"] },
      { label: "后续余波", title: "末局延至海上", description: "政权收缩、人物行动与海上末局仍在继续；1279 年才成为两宋王朝意义上的终章。", nodeIds: ["end-of-song"] },
    ],
    sourceLabel: "人民日报 / 中国大运河博物馆：临安城专题", sourceUrl: "http://paper.people.com.cn/rmrb/pad/content/202512/27/content_30127489.html",
  },
  {
    id: "end-of-song", year: "1279", event: "崖山之后：王朝落幕，遗产未止", note: "终局记录王朝的结束，也邀请读者追问哪些制度、城市和审美继续流动。",
    stages: [
      { label: "前因", title: "从都城失守到末局", description: "临安失守之后，南宋历史仍继续向前；人物、交通与政治选择让终局成为一个过程。", nodeIds: ["linan-fall"] },
      { label: "当下冲突", title: "两宋的王朝终章", description: "1279 年是两宋的王朝意义终点，也是本站时间脊柱的收束节点。", nodeIds: ["end-of-song"] },
      { label: "后续余波", title: "遗产进入后世", description: "两宋的制度、城市、技术与审美遗产并未随王朝终结而消失，仍可沿其他轨道继续阅读。", nodeIds: ["movable-type", "linan"] },
    ],
    sourceLabel: "史密森尼亚洲艺术国家博物馆：宋代 960—1279", sourceUrl: "https://asia-archive.si.edu/learn/for-educators/teaching-china-with-the-smithsonian/explore-by-dynasty/song-dynasty/",
  },
];

export function getHistoryChain(id: string) {
  return HISTORY_CHAINS.find((chain) => chain.id === id) ?? HISTORY_CHAINS[0];
}

export function nextHistoryChainIndex(length: number, currentIndex: number, direction: -1 | 1) {
  if (length <= 0) return -1;
  return (currentIndex + direction + length) % length;
}
