/**
 * 设计提醒｜卷轴地志：独立详情页应像一册可回到长卷的史料注释，
 * 以原文短摘、现代释义与出处三层并读，不把史料伪装为结论。
 */
import { ArrowLeft, ArrowUpRight, BookOpenText, Landmark, Quote, ScrollText } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useRoute } from "wouter";
import { trpc } from "@/lib/trpc";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EXPANDED_SONG_ARCHIVE } from "@/lib/expandedSongArchive";

type Detail = {
  id: string;
  year: string;
  title: string;
  category: string;
  summary: string;
  interpretation: string;
  excerpt: string;
  excerptWork: string;
  excerptNote: string;
  sourceName: string;
  sourceUrl: string;
  context: string[];
  evidenceType?: "primary-excerpt" | "research-summary";
};

const CORE_DETAILS: Detail[] = [
  { id: "northern-song", year: "960", title: "北宋建立", category: "政权", summary: "赵匡胤建宋，新的中央政权开启。", interpretation: "建宋节点为时间轴提供了起点：此后北宋的制度扩展、城市发展和对北方关系的处理，才拥有共同的政治框架。", excerpt: "“建隆元年春正月乙巳，大赦，改元。”", excerptWork: "《宋史·太祖本纪》", excerptNote: "此处以建隆改元的短句提示王朝开端；断句依开放文本版本而异。", sourceName: "维基文库《宋史》开放文本", sourceUrl: "https://zh.wikisource.org/wiki/宋史/卷001", context: ["北宋阶段约为 960—1127 年。", "东京（今开封）是北宋城市生活与政治秩序的重要场景。", "详情页中的史料短摘用于阅读导引，不替代校勘本。"] },
  { id: "chanyuan", year: "1005", title: "澶渊之盟", category: "外交", summary: "宋辽缔约，北方边境进入相对稳定期。", interpretation: "澶渊之盟体现北宋以盟约处理北方关系的策略。把它放入时间轴，是为了提示外交秩序如何影响财政、军政和社会稳定。", excerpt: "“自澶渊讲好，南北休兵。”", excerptWork: "《续资治通鉴长编》相关卷次", excerptNote: "引文作为盟约结果的导读短摘；具体条文与版本差异请参阅原典及专门研究。", sourceName: "Cambridge University Press：Chanyuan Covenant 研究", sourceUrl: "https://www.cambridge.org/core/journals/journal-of-chinese-history/article/fragility-of-peace-song-chinas-northwestern-frontier-and-erosion-of-the-chanyuan-paradigm-in-the-mideleventh-century/AF2F19A32A23ED0F304C3DE814851A3F", context: ["1005 年盟约是北宋外交史的重要节点。", "稳定并不意味着没有边境压力，而是政治与军事关系暂时形成可持续安排。", "本页建议与“外交”比较视图联读。"] },
  { id: "movable-type", year: "11世纪", title: "活字印刷", category: "技术", summary: "毕昇以胶泥制字，印刷技术出现新突破。", interpretation: "活字印刷不是孤立的技术逸闻。它与雕版、书籍、教育和城市文化共同构成宋代知识传播的环境。", excerpt: "“庆历中，有布衣毕昇，又为活板。”", excerptWork: "《梦溪笔谈·技艺》", excerptNote: "这是现存文献中关于毕昇与活字印刷的著名记载；后文还描述“用胶泥刻字”的制作方法。", sourceName: "中国哲学书电子化计划《梦溪笔谈》", sourceUrl: "https://ctext.org/wiki.pl?if=gb&res=13396", context: ["活字印刷出现在 11 世纪。", "哥伦比亚大学资料指出，雕版印刷因成本较低仍长期占据主流。", "“技术”比较视图可查看其与南宋知识、城市生活的关联。"] },
  { id: "new-policies", year: "1069—1072", title: "王安石新法", category: "制度", summary: "财政、官员选拔与军政制度同步调整。", interpretation: "新法的历史意义在于，它把财政、选官、军队与政府能力放进同一组改革议题，也由此引发持续的政治争论。", excerpt: "“熙宁二年二月，王安石为参知政事。”", excerptWork: "《宋史·神宗本纪》及《王安石传》相关记载", excerptNote: "以任用与改革启动的年代为索引；改革内容的现代释义参照研究数据库说明。", sourceName: "EBSCO Research Starters：王安石改革专题", sourceUrl: "https://www.ebsco.com/research-starters/history/wang-anshi-introduces-bureaucratic-reforms/", context: ["改革重点覆盖财政、官员训练与军政。", "改革带来政策创新，也带来围绕国家治理方式的争论。", "可在“制度”比较视图中对照南宋政局与行政重心。"] },
  { id: "jingkang", year: "1127", title: "靖康：北方秩序的断裂", category: "转折", summary: "东京失守、徽钦北去；北宋终局与宋室南迁相连。", interpretation: "靖康不是孤立的年份。本站以联盟选择、边境压力、东京危局与政权南迁构成连续阅读链条，但不以任何单一原因解释北宋终局。", excerpt: "“靖康二年，金人入京师。”", excerptWork: "《宋史·钦宗本纪》相关记载", excerptNote: "以简短本纪式表述提示北宋终结；具体经过可进一步对读本纪与相关编年史料。", sourceName: "中央广播电视总台靖康专题 / 宋代分期资料", sourceUrl: "https://tv.cctv.com/v/a/ARTIDHsF5VXEqQvaBT0T0r9X210504.html", context: ["北宋约在 1127 年结束，南宋自此开始。", "联盟选择、边境压力、东京危局与政权南迁构成本站的阅读链条，不构成单因果论断。", "此节点建议与临安、明州、泉州的地图层，以及宋高宗的人物索引联读。"] },
  { id: "linan", year: "1138", title: "临安为行在", category: "城市", summary: "江南都城形成，水路城市展开。", interpretation: "临安的意义不只是都城南移。水路、运河、商市、港口和货币使用共同组成一座江南都城的日常基础。", excerpt: "“绍兴八年三月，诏以临安府为行在所。”", excerptWork: "《宋史·高宗本纪》相关记载", excerptNote: "以行在诏令为城市转向的史料题签；临安的城市生活可结合考古与文献材料继续阅读。", sourceName: "人民日报 / 中国大运河博物馆：南宋临安城专题", sourceUrl: "http://paper.people.com.cn/rmrb/pad/content/202512/27/content_30127489.html", context: ["1138 年临安正式成为行在所。", "临安至 1276 年都是南宋实际意义上的国都。", "地图层将临安与明州、泉州的贸易关联并置展示。"] },
  { id: "linan-fall", year: "1276", title: "临安失守", category: "转折", summary: "元军攻破临安，南宋政权进一步收缩。", interpretation: "临安失守使南宋失去长期政治中心；但这一节点也提醒读者，政权终局之前，城市、交通和人群仍在延续与迁移。", excerpt: "“德祐二年二月，元师入临安。”", excerptWork: "《宋史·恭帝本纪》相关记载", excerptNote: "以本纪式短句作时点提示；可与临安城专题的考古和城市史说明共同阅读。", sourceName: "人民日报 / 中国大运河博物馆：南宋临安城专题", sourceUrl: "http://paper.people.com.cn/rmrb/pad/content/202512/27/content_30127489.html", context: ["1276 年临安被元军攻破。", "该节点并不等于南宋历史即时结束。", "与 1279 年终章共同构成晚期叙事。"] },
  { id: "end-of-song", year: "1279", title: "宋朝终结", category: "政权", summary: "崖山之后，两宋历史落幕。", interpretation: "1279 年为两宋历史画下王朝意义上的终点；制度、城市、技术与审美遗产却并未随之消失，而是继续进入后世的文化史。", excerpt: "“崖山破，陆秀夫负帝昺赴海死。”", excerptWork: "《宋史·陆秀夫传》相关记载", excerptNote: "以传记叙事提示王朝末局；不同版本在用字与断句上可能存在差异。", sourceName: "史密森尼亚洲艺术国家博物馆：宋代 960—1279 年", sourceUrl: "https://asia-archive.si.edu/learn/for-educators/teaching-china-with-the-smithsonian/explore-by-dynasty/song-dynasty/", context: ["南宋阶段至 1279 年结束。", "本站将这一节点置为时间脊柱的终章。", "建议回到主轴，重新观察制度、技术和城市轨道如何穿越王朝兴亡。"] },
];

const DETAILS: Detail[] = [
  ...CORE_DETAILS,
  ...EXPANDED_SONG_ARCHIVE.map((entry) => ({
    id: entry.id,
    year: entry.year,
    title: entry.title,
    category: entry.category,
    summary: entry.short,
    interpretation: entry.detail,
    excerpt: entry.excerpt,
    excerptWork: entry.excerptWork,
    excerptNote: entry.excerptNote,
    sourceName: entry.source,
    sourceUrl: entry.sourceUrl,
    context: entry.context,
    evidenceType: "research-summary" as const,
  })),
];

type HistoricalPerson = {
  id: string;
  name: string;
  role: string;
  era: string;
  bio: string;
  note: string;
  nodeIds: string[];
  sourceName: string;
  sourceUrl: string;
};

const PEOPLE: Record<string, HistoricalPerson> = {
  "zhao-kuangyin": { id: "zhao-kuangyin", name: "赵匡胤", role: "北宋开国君主", era: "10世纪 · 北宋开端", bio: "后周将领出身，960年建立宋朝。本站以其为北宋政权开端的人物索引，连接统一与中央政权的起点。", note: "作为960年建宋节点的核心人物，提示新的中央政权由此开启。", nodeIds: ["northern-song"], sourceName: "《宋史·太祖本纪》开放文本", sourceUrl: "https://zh.wikisource.org/wiki/宋史/卷001" },
  "song-zhenzong": { id: "song-zhenzong", name: "宋真宗", role: "北宋皇帝", era: "11世纪初 · 北方关系", bio: "北宋皇帝。本站将其置入澶渊之盟的阅读索引，用以提示朝廷决策与北方关系的交会。", note: "与澶渊之盟所代表的北方关系处理直接相关。", nodeIds: ["chanyuan"], sourceName: "澶渊盟约研究入口", sourceUrl: "https://www.cambridge.org/core/journals/journal-of-chinese-history/article/fragility-of-peace-song-chinas-northwestern-frontier-and-erosion-of-the-chanyuan-paradigm-in-the-mideleventh-century/AF2F19A32A23ED0F304C3DE814851A3F" },
  "kou-zhun": { id: "kou-zhun", name: "寇准", role: "北宋宰相", era: "11世纪初 · 边境外交", bio: "北宋重臣。其名常与澶渊之盟的政治决策相连；本站仅以该事件作为关联入口，不将短篇小传替代完整人物研究。", note: "站内以其作为澶渊之盟叙事的相关人物标签，不展开完整生平判断。", nodeIds: ["chanyuan"], sourceName: "澶渊盟约研究入口", sourceUrl: "https://www.cambridge.org/core/journals/journal-of-chinese-history/article/fragility-of-peace-song-chinas-northwestern-frontier-and-erosion-of-the-chanyuan-paradigm-in-the-mideleventh-century/AF2F19A32A23ED0F304C3DE814851A3F" },
  "bi-sheng": { id: "bi-sheng", name: "毕昇", role: "活字制作相关人物", era: "11世纪 · 技术传播", bio: "《梦溪笔谈》所记的布衣人物，因“又为活板”而与活字印刷的历史叙事相连。", note: "《梦溪笔谈》以“庆历中，有布衣毕昇，又为活板”记录其与活字印刷的关联。", nodeIds: ["movable-type"], sourceName: "中国哲学书电子化计划《梦溪笔谈》", sourceUrl: "https://ctext.org/wiki.pl?if=gb&res=13396" },
  "shen-kuo": { id: "shen-kuo", name: "沈括", role: "《梦溪笔谈》作者", era: "11世纪 · 笔记与知识", bio: "北宋知识人，其《梦溪笔谈》保留了毕昇与活字印刷的重要文字记录。本站以此强调技术史同样依赖文本保存。", note: "站内通过其笔记文字，为毕昇与活字印刷节点保留可追溯的史料入口。", nodeIds: ["movable-type"], sourceName: "中国哲学书电子化计划《梦溪笔谈》", sourceUrl: "https://ctext.org/wiki.pl?if=gb&res=13396" },
  "wang-anshi": { id: "wang-anshi", name: "王安石", role: "北宋改革者", era: "11世纪后期 · 制度改革", bio: "北宋政治人物。本站通过熙宁新法这一节点，提示财政、选官与军政调整如何成为一组相互关联的改革问题。", note: "与熙宁新法的财政、选官与军政调整相关。", nodeIds: ["new-policies"], sourceName: "EBSCO 王安石改革专题", sourceUrl: "https://www.ebsco.com/research-starters/history/wang-anshi-introduces-bureaucratic-reforms/" },
  "song-shenzong": { id: "song-shenzong", name: "宋神宗", role: "北宋皇帝", era: "11世纪后期 · 改革政治", bio: "北宋皇帝。本站以其作为新法所处政治环境的人物标签，帮助读者从改革者之外看到制度推行的朝廷背景。", note: "新法推行所处政治环境的重要人物标签。", nodeIds: ["new-policies"], sourceName: "EBSCO 王安石改革专题", sourceUrl: "https://www.ebsco.com/research-starters/history/wang-anshi-introduces-bureaucratic-reforms/" },
  "song-huizong": { id: "song-huizong", name: "宋徽宗", role: "北宋晚期皇帝", era: "12世纪初 · 宫廷文化与北方危局", bio: "北宋晚期皇帝。本站将其置入画院与靖康两个节点：前者提示宫廷文化制度，后者提示北方关系改写与东京危局；小传不以单一人物解释北宋终局。", note: "与北宋晚期的宫廷文化、北方关系、东京危局和靖康节点相关。", nodeIds: ["huizong-art", "jingkang"], sourceName: "大都会艺术博物馆北宋专题 / 中央广播电视总台靖康专题", sourceUrl: "https://www.metmuseum.org/essays/northern-song-dynasty-960-1127" },
  "song-qinzong": { id: "song-qinzong", name: "宋钦宗", role: "北宋末期皇帝", era: "1126—1127 · 东京危局", bio: "北宋末期皇帝。本站以其关联靖康节点，帮助读者从都城危局与政权终局的交会处进入事件；小传不替代对本纪和专门研究的阅读。", note: "与靖康节点中的东京失守和北宋终局相关。", nodeIds: ["jingkang"], sourceName: "中央广播电视总台靖康专题", sourceUrl: "https://tv.cctv.com/v/a/ARTIDHsF5VXEqQvaBT0T0r9X210504.html" },
  "song-gaozong": { id: "song-gaozong", name: "宋高宗", role: "南宋开创者", era: "12世纪 · 南渡与临安", bio: "南宋开创者。其经历将1127年的政权南移与1138年临安为行在所连接起来，是理解两宋分界与江南都城形成的关键线索。", note: "从1127年南渡到1138年临安为行在，串联两宋分界与江南都城形成。", nodeIds: ["jingkang", "linan"], sourceName: "《宋史·高宗纪》与宋代分期资料", sourceUrl: "https://zh.wikisource.org/wiki/宋史/卷030" },
  "fan-zhongyan": { id: "fan-zhongyan", name: "范仲淹", role: "庆历改革相关人物", era: "11世纪 · 西北与改革", bio: "北宋官员。剑桥研究将其置于庆历战争中的西北防务和1043年前后的改革方案之中；本站仅以这两条阅读线索作为人物索引。", note: "连接庆历战争、行政整饬和北宋改革前史的站内阅读入口。", nodeIds: ["qingli-war", "qingli-reforms"], sourceName: "Cambridge University Press：北宋西北边境研究", sourceUrl: "https://www.cambridge.org/core/journals/journal-of-chinese-history/article/fragility-of-peace-song-chinas-northwestern-frontier-and-erosion-of-the-chanyuan-paradigm-in-the-mideleventh-century/AF2F19A32A23ED0F304C3DE814851A3F" },
  "zhu-xi": { id: "zhu-xi", name: "朱熹", role: "南宋思想家", era: "1130—1200 · 新儒学", bio: "南宋思想家。大都会博物馆南宋专题将其“格物致知”的关切置于南宋文化背景中；本站用其连接思想、教育与士人实践，不以短传代替其完整思想史。", note: "作为新儒学、教育和书籍传播的阅读人物入口。", nodeIds: ["zhu-xi"], sourceName: "大都会艺术博物馆：南宋专题", sourceUrl: "https://www.metmuseum.org/essays/southern-song-dynasty-1127-1279" },
  "zhao-rugua": { id: "zhao-rugua", name: "赵汝适", role: "泉州市舶司相关人物", era: "13世纪 · 海贸网络", bio: "哥伦比亚大学宋代贸易资料记载：1225 年，泉州的市舶司官员赵汝适写成《诸蕃志》，记录中国商人与多地的贸易对象和货物。本站以其作为泉州与海贸网络的阅读索引。", note: "作为泉州港与《诸蕃志》的阅读入口，提示南宋时期港口、海贸与知识记录的关联。", nodeIds: ["linan", "zhu-fan-zhi"], sourceName: "哥伦比亚大学：宋代对外贸易", sourceUrl: "https://afe.easia.columbia.edu/songdynasty-module/outside-trade.html" },
  "lu-xiufu": { id: "lu-xiufu", name: "陆秀夫", role: "南宋末年大臣", era: "13世纪 · 海上政局", bio: "南宋末年大臣。《宋史》记其追从二王，并与张世杰共同参与南宋末局中的政务与军旅安排。", note: "《宋史》记其在南宋末局追从二王，并与张世杰等共同参与海上政局。", nodeIds: ["linan-fall", "end-of-song"], sourceName: "《宋史·卷451》", sourceUrl: "https://zh.wikisource.org/wiki/宋史/卷451" },
  "wen-tianxiang": { id: "wen-tianxiang", name: "文天祥", role: "南宋末年政治人物", era: "13世纪 · 宋末政治", bio: "南宋末年政治人物。《文天祥传》记其在德祐初响应勤王，并经历临安失守前后的南宋末局。", note: "站内将其作为临安失守后与南宋末局相关的阅读标签。", nodeIds: ["linan-fall", "end-of-song"], sourceName: "维基文库《文天祥传》", sourceUrl: "https://zh.wikisource.org/wiki/文天祥傳" },
  "zhang-shijie": { id: "zhang-shijie", name: "张世杰", role: "南宋末年将领", era: "13世纪 · 宋末军旅", bio: "南宋末年将领。本站以其与陆秀夫的关联，阅读临安失守之后南宋政权收缩与崖山终局。", note: "与陆秀夫共同关联南宋政权收缩与崖山终局的站内叙事。", nodeIds: ["linan-fall", "end-of-song"], sourceName: "《宋史·卷451》", sourceUrl: "https://zh.wikisource.org/wiki/宋史/卷451" },
};

const PEOPLE_BY_NODE: Record<string, string[]> = {
  "northern-song": ["zhao-kuangyin"], chanyuan: ["song-zhenzong", "kou-zhun"], "qingli-war": ["fan-zhongyan"], "qingli-reforms": ["fan-zhongyan"], "movable-type": ["bi-sheng", "shen-kuo"], "new-policies": ["wang-anshi", "song-shenzong"], "huizong-art": ["song-huizong"], jingkang: ["song-huizong", "song-qinzong", "song-gaozong"], linan: ["song-gaozong", "zhao-rugua"], "zhu-xi": ["zhu-xi"], "zhu-fan-zhi": ["zhao-rugua"], "linan-fall": ["lu-xiufu", "wen-tianxiang", "zhang-shijie"], "end-of-song": ["lu-xiufu", "wen-tianxiang", "zhang-shijie"],
};

export default function NodeDetail() {
  const [, params] = useRoute("/event/:id");
  const detail = DETAILS.find((item) => item.id === params?.id);
  const isRupture = detail?.category === "转折" || detail?.id === "end-of-song";
  const analysis = trpc.textStudy.analyze.useMutation();
  const people = useMemo(() => detail ? (PEOPLE_BY_NODE[detail.id] ?? []).map((id) => PEOPLE[id]).filter(Boolean) : [], [detail]);
  const [activePersonId, setActivePersonId] = useState<string | null>(null);
  const [bioOpen, setBioOpen] = useState(false);
  useEffect(() => { setActivePersonId(people[0]?.id ?? null); }, [detail?.id, people]);
  useEffect(() => {
    const requestedPerson = new URLSearchParams(window.location.search).get("person");
    if (!requestedPerson || !people.some((person) => person.id === requestedPerson)) return;
    setActivePersonId(requestedPerson);
    setBioOpen(true);
  }, [detail?.id, people]);
  const activePerson = activePersonId ? PEOPLE[activePersonId] : null;
  const evidenceLabel = detail?.evidenceType === "research-summary" ? "资料转述" : "古籍短摘";
  const relatedNodes = activePerson ? activePerson.nodeIds.map((id) => DETAILS.find((item) => item.id === id)).filter(Boolean) : [];

  if (!detail) {
    return (
      <main className="min-h-screen bg-[#f6f2e8] px-6 py-24 text-[#28302e] night:bg-[#0e161a] night:text-[#e8e2d3]">
        <div className="mx-auto max-w-2xl"><p className="eyebrow">未找到册页</p><h1 className="mt-4 font-serif text-5xl font-black">该节点尚未编入。</h1><Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm text-[#4f8c85]"><ArrowLeft size={16} /> 回到历史脊柱</Link></div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f6f2e8] text-[#28302e] night:bg-[#0e161a] night:text-[#e8e2d3]">
      <header className="border-b border-[#28302e]/10 bg-[#f6f2e8]/92 backdrop-blur-xl night:bg-[#0e161a]/92">
        <div className="mx-auto flex h-[76px] max-w-[1280px] items-center justify-between px-6 md:px-10">
          <Link href="/" className="inline-flex items-center gap-3 text-sm text-[#53615d] transition hover:text-[#4f8c85] night:text-[#b4b9b2]"><span className="detail-brand-mark" aria-hidden="true"><i /><b /></span><ArrowLeft size={17} /> 回到历史脊柱</Link>
          <span className="font-mono text-[10px] tracking-[0.18em] text-[#4f8c85]">SONGLI / SOURCE LEAF</span>
        </div>
      </header>

      <article className="mx-auto max-w-[1280px] px-6 py-16 md:px-10 lg:py-24">
        <div className="grid gap-12 lg:grid-cols-[.66fr_1.34fr]">
          <aside className="detail-archive-aside lg:sticky lg:top-10 lg:h-fit">
            <p className="eyebrow">史料详情页 · {detail.category}</p>
            <div className="detail-year-spine mt-8"><span /><p className="font-mono text-sm tracking-[0.18em] text-[#4f8c85]">{detail.year}</p></div>
            <h1 className="mt-2 font-serif text-5xl font-black tracking-[-0.06em] md:text-6xl">{detail.title}</h1>
            {isRupture && <span className="detail-rupture-seal">王朝转折</span>}
            <p className="mt-6 max-w-sm text-base leading-8 text-[#53615d] night:text-[#b4b9b2]">{detail.summary}</p>
            {people.length > 0 && <div className="mt-8 border-y border-[#28302e]/12 py-5"><p className="eyebrow">相关人物</p><div className="mt-4 flex flex-wrap gap-2">{people.map((person) => <button key={person.id} type="button" onClick={() => { setActivePersonId(person.id); setBioOpen(true); }} className={`person-tag ${activePersonId === person.id ? "person-tag-active" : ""}`}>{person.name}<span>{person.role}</span></button>)}</div><p className="mt-4 text-[11px] leading-5 text-[#71817d]">点选人物，打开小传与本站相关事件。</p></div>}
            <div className="mt-10 border-y border-[#28302e]/12 py-5 text-xs leading-6 text-[#71817d]">本页将古籍短摘、现代释义与资料来源并置；引文用于导读，具体异体字、断句与版本差异请以原典校勘本为准。</div>
          </aside>

          <div>
            <section className="border-b border-[#28302e]/15 pb-10">
              <div className="flex items-center gap-3"><Quote size={18} className="text-[#4f8c85]" strokeWidth={1.4} /><p className="eyebrow">{evidenceLabel}</p></div>
              <blockquote className="mt-7 border-l-2 border-[#78A9A1] pl-7 font-serif text-3xl font-bold leading-[1.65] tracking-[-0.035em] md:text-4xl">{detail.excerpt}</blockquote>
              <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-[#71817d]"><span className="font-medium text-[#53615d] night:text-[#c2c8c1]">{detail.excerptWork}</span><span>{detail.excerptNote}</span></div>
            </section>

            <section className="border-b border-[#28302e]/15 py-10">
              <div className="flex items-center gap-3"><ScrollText size={18} className="text-[#4f8c85]" strokeWidth={1.4} /><p className="eyebrow">现代释义</p></div>
              <p className="mt-6 max-w-3xl text-[17px] leading-9 text-[#53615d] night:text-[#b4b9b2]">{detail.interpretation}</p>
            </section>

            <section className="border-b border-[#28302e]/15 py-10">
              <div className="flex items-center justify-between gap-5"><div className="flex items-center gap-3"><BookOpenText size={18} className="text-[#4f8c85]" strokeWidth={1.4} /><p className="eyebrow">释读旁注</p></div><span className="font-mono text-[10px] tracking-[0.14em] text-[#71817d]">白话解读 / 阅读提示</span></div>
              <p className="mt-5 max-w-3xl text-sm leading-7 text-[#71817d]">依据当前页引用的{detail.evidenceType === "research-summary" ? "公开研究资料转述" : "古籍短摘"}生成逐句白话解读与阅读提示。该旁注只服务于初读，不替代版本校勘、训诂或专业研究结论。</p>
              <button type="button" onClick={() => analysis.mutate({ excerpt: detail.excerpt, title: detail.title, source: detail.excerptWork })} disabled={analysis.isPending} className="mt-6 inline-flex items-center gap-2 border-b border-[#78a9a1] pb-2 text-sm font-medium text-[#397b74] transition hover:gap-3 disabled:cursor-not-allowed disabled:opacity-60">{analysis.isPending ? "正在生成旁注…" : "展开白话释读"}<ArrowUpRight size={15} /></button>
              {analysis.isError && <p className="mt-4 text-sm text-[#a66457]">解析暂时未完成：{analysis.error.message}</p>}
              {analysis.data && <div className="ai-study-sheet mt-7"><div className="border-b border-[#28302e]/12 pb-5"><p className="eyebrow">逐句翻译</p>{analysis.data.sentences.map((sentence, index) => <div key={`${sentence.original}-${index}`} className="mt-5 grid gap-2 border-l border-[#78a9a1] pl-4"><p className="font-serif text-xl font-bold">{sentence.original}</p><p className="text-sm leading-7 text-[#53615d] night:text-[#b4b9b2]">{sentence.modern}</p><p className="text-xs leading-6 text-[#71817d]">{sentence.note}</p></div>)}</div><div className="grid gap-6 py-6 md:grid-cols-2"><div><p className="eyebrow">深度解析</p><p className="mt-3 text-sm leading-7 text-[#53615d] night:text-[#b4b9b2]">{analysis.data.deepAnalysis}</p></div><div><p className="eyebrow">阅读提示</p><p className="mt-3 text-sm leading-7 text-[#53615d] night:text-[#b4b9b2]">{analysis.data.readingHint}</p></div></div><p className="border-t border-[#28302e]/12 pt-4 text-xs leading-6 text-[#71817d]">{analysis.data.caveat}</p></div>}
            </section>

            <section className="border-b border-[#28302e]/15 py-10">
              <div className="flex items-center gap-3"><Landmark size={18} className="text-[#4f8c85]" strokeWidth={1.4} /><p className="eyebrow">同页上下文</p></div>
              <ol className="mt-6 divide-y divide-[#28302e]/12 border-y border-[#28302e]/12">
                {detail.context.map((line, index) => <li key={line} className="grid grid-cols-[36px_1fr] gap-4 py-5 text-sm leading-7 text-[#53615d] night:text-[#b4b9b2]"><span className="font-mono text-[10px] text-[#78A9A1]">0{index + 1}</span><span>{line}</span></li>)}
              </ol>
            </section>

            {activePerson && <section className="border-b border-[#28302e]/15 py-10">
              <div className="flex items-center justify-between gap-5"><div className="flex items-center gap-3"><Landmark size={18} className="text-[#4f8c85]" strokeWidth={1.4} /><p className="eyebrow">人物关联索引</p></div><span className="font-mono text-[10px] tracking-[0.14em] text-[#71817d]">{activePerson.name}</span></div>
              <p className="mt-5 text-sm leading-7 text-[#53615d] night:text-[#b4b9b2]">{activePerson.note}</p>
              <div className="mt-6 divide-y divide-[#28302e]/12 border-y border-[#28302e]/12">{relatedNodes.map((node) => node && <Link key={node.id} href={`/event/${node.id}`} className="group flex items-center justify-between gap-5 py-4"><div><p className="font-mono text-[10px] tracking-[0.15em] text-[#4f8c85]">{node.year}</p><p className="mt-1 font-serif text-xl font-bold">{node.title}</p></div><ArrowUpRight size={16} className="text-[#78a9a1] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>)}</div>
              <a href={activePerson.sourceUrl} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 text-xs text-[#4f8c85] hover:underline">查看人物关联来源：{activePerson.sourceName}<ArrowUpRight size={13} /></a>
              <p className="mt-4 text-xs leading-6 text-[#71817d]">人物关联仅对应本站已编入的叙事节点，不表示完整生平或穷尽全部历史关联。</p>
            </section>}

            <section className="pt-10">
              <div className="flex items-center gap-3"><BookOpenText size={18} className="text-[#4f8c85]" strokeWidth={1.4} /><p className="eyebrow">延伸阅读</p></div>
              <a href={detail.sourceUrl} target="_blank" rel="noreferrer" className="mt-6 flex items-start justify-between gap-6 border-y border-[#28302e]/15 py-6 transition hover:border-[#78A9A1]">
                <div><p className="font-serif text-2xl font-bold tracking-[-0.03em]">{detail.sourceName}</p><p className="mt-2 text-sm leading-6 text-[#71817d]">点击打开公开来源，继续查阅原典入口或研究说明。</p></div><ArrowUpRight className="mt-1 shrink-0 text-[#4f8c85]" size={18} />
              </a>
            </section>
          </div>
        </div>
      </article>
      <Dialog open={bioOpen} onOpenChange={setBioOpen}>
        <DialogContent className="bio-dialog max-h-[calc(100dvh-2rem)] overflow-y-auto rounded-none border-[#28302e]/20 bg-[#f6f2e8] p-0 text-[#28302e] night:border-white/15 night:bg-[#0e161a] night:text-[#e8e2d3]">
          {activePerson && <div className="p-7 sm:p-9">
            <DialogHeader className="text-left"><p className="eyebrow">人物小传 · 站内索引</p><DialogTitle className="mt-4 font-serif text-4xl font-black tracking-[-0.06em]">{activePerson.name}</DialogTitle><DialogDescription className="mt-2 font-mono text-[11px] tracking-[0.14em] text-[#4f8c85]">{activePerson.era} · {activePerson.role}</DialogDescription></DialogHeader>
            <div className="mt-7 border-y border-[#28302e]/12 py-6"><p className="text-[16px] leading-8 text-[#53615d] night:text-[#b4b9b2]">{activePerson.bio}</p></div>
            <div className="mt-7"><p className="eyebrow">本站相关事件</p><div className="mt-4 divide-y divide-[#28302e]/12 border-y border-[#28302e]/12">{relatedNodes.map((node) => node && <Link key={node.id} href={`/event/${node.id}`} onClick={() => setBioOpen(false)} className="group flex items-center justify-between gap-5 py-4"><div><p className="font-mono text-[10px] tracking-[0.15em] text-[#4f8c85]">{node.year}</p><p className="mt-1 font-serif text-xl font-bold">{node.title}</p></div><ArrowUpRight size={16} className="text-[#78a9a1] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" /></Link>)}</div></div>
            <a href={activePerson.sourceUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 border-b border-[#78a9a1] pb-1 text-xs text-[#397b74] hover:gap-3">查看人物小传来源：{activePerson.sourceName}<ArrowUpRight size={13} /></a>
            <p className="mt-5 text-xs leading-6 text-[#71817d]">本站人物小传仅为相关节点的阅读导引；事件与生平的完整论述请以原典和专业研究为准。</p>
          </div>}
        </DialogContent>
      </Dialog>
    </main>
  );
}
