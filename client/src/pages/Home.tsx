/**
 * 设计提醒｜卷轴地志：偏置纵轴、充足留白、汝窑天青仅用于关键线索，
 * 以宋代文人画的远近层次组织可探索的历史叙事。
 */
import { useEffect, useMemo, useState } from "react";
import { ComparisonView } from "@/components/ComparisonView";
import { CityPeopleAtlas } from "@/components/CityPeopleAtlas";
import { ExploreLab } from "@/components/ExploreLab";
import { FateSlices } from "@/components/FateSlices";
import { GeographyMap } from "@/components/GeographyMap";
import { HistoryChain } from "@/components/HistoryChain";
import { ParallelScrollTimeline } from "@/components/ParallelScrollTimeline";
import { nextTimelineIndex } from "@/lib/timelineNavigation";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Check,
  ChevronRight,
  CircleDot,
  Landmark,
  Moon,
  Search,
  Sun,
  Waves,
  X,
} from "lucide-react";

type Category = "全部" | "政权" | "外交" | "技术" | "制度" | "城市" | "转折";

type TimelineEvent = {
  id: string;
  year: string;
  title: string;
  short: string;
  detail: string;
  category: Exclude<Category, "全部">;
  tag: string;
  source: string;
  sourceUrl: string;
  tone: "celadon" | "seal" | "ink";
};

const EVENTS: TimelineEvent[] = [
  {
    id: "northern-song",
    year: "960",
    title: "建宋：权力如何归拢",
    short: "赵匡胤建宋，新的中央政权由此起笔。",
    detail:
      "从建宋起，北宋的统一、文官制度扩展与城市经济增长被放进同一条历史脊柱：政权如何归拢，社会又如何在其间生长。",
    category: "政权",
    tag: "北宋起点",
    source: "史密森尼亚洲艺术国家博物馆",
    sourceUrl:
      "https://asia-archive.si.edu/learn/for-educators/teaching-china-with-the-smithsonian/explore-by-dynasty/song-dynasty/",
    tone: "celadon",
  },
  {
    id: "chanyuan",
    year: "1005",
    title: "澶渊：稳定的边境",
    short: "宋辽缔约，北方关系进入相对稳定期。",
    detail:
      "这份盟约是北宋处理北方关系的重要节点。它提示稳定不是静止，而是财政、军政与边境秩序暂时形成的一种安排。",
    category: "外交",
    tag: "北方关系",
    source: "Cambridge University Press",
    sourceUrl:
      "https://www.cambridge.org/core/journals/journal-of-chinese-history/article/fragility-of-peace-song-chinas-northwestern-frontier-and-erosion-of-the-chanyuan-paradigm-in-the-mideleventh-century/AF2F19A32A23ED0F304C3DE814851A3F",
    tone: "ink",
  },
  {
    id: "movable-type",
    year: "11世纪",
    title: "活字印刷",
    short: "毕昇以胶泥制字，印刷技术出现新突破。",
    detail:
      "活字印刷在 11 世纪出现。虽然雕版印刷因成本优势仍长期占据主流，但活字的出现为知识复制与传播提供了新的技术想象。",
    category: "技术",
    tag: "知识传播",
    source: "哥伦比亚大学 Asia for Educators",
    sourceUrl: "https://afe.easia.columbia.edu/songdynasty-module/tech-printing.html",
    tone: "celadon",
  },
  {
    id: "new-policies",
    year: "1069—1072",
    title: "熙宁新法：国家如何变法",
    short: "财政、选官与军政被同时放上改革的案头。",
    detail:
      "在神宗支持下，王安石推行一系列涉及财政、选官与军政的改革。这里把“新法”读成国家能力与政治争论同时被改写的现场。",
    category: "制度",
    tag: "制度重塑",
    source: "EBSCO Research Starters",
    sourceUrl:
      "https://www.ebsco.com/research-starters/history/wang-anshi-introduces-bureaucratic-reforms/",
    tone: "celadon",
  },
  {
    id: "jingkang",
    year: "1127",
    title: "靖康：北方秩序的断裂",
    short: "东京失守、徽钦北去；北宋终局与宋室南迁相连。",
    detail:
      "靖康不是孤立的年份。网站以联盟选择、边境压力、东京危局与政权南迁构成连续链条，但不以任何单一原因解释北宋终局。",
    category: "转折",
    tag: "两宋分界",
    source: "大都会艺术博物馆 / 史密森尼",
    sourceUrl: "https://www.metmuseum.org/toah/ht/07/eac.html",
    tone: "seal",
  },
  {
    id: "linan",
    year: "1138",
    title: "临安行在：江南如何承接",
    short: "南迁之后，水路、商市与新都城共同展开。",
    detail:
      "绍兴八年，宋高宗正式以临安为“行在所”。南迁不是故事的尾声：运河、水路与商市共同塑造这座承接政权与文化生活的江南都城。",
    category: "城市",
    tag: "江南都城",
    source: "人民日报 / 中国大运河博物馆",
    sourceUrl: "http://paper.people.com.cn/rmrb/pad/content/202512/27/content_30127489.html",
    tone: "celadon",
  },
  {
    id: "linan-fall",
    year: "1276",
    title: "临安失守：都城之后的路",
    short: "都城失守，南宋从江南政治中心走向海上末局。",
    detail:
      "临安失守意味着南宋失去长期政治中心；但王朝并未立刻结束。政权收缩、人物行动与海上末局仍在继续，终局因此被拉长为一段人的行动史。",
    category: "转折",
    tag: "晚期危局",
    source: "人民日报 / 中国大运河博物馆",
    sourceUrl: "http://paper.people.com.cn/rmrb/pad/content/202512/27/content_30127489.html",
    tone: "seal",
  },
  {
    id: "end-of-song",
    year: "1279",
    title: "崖山之后：王朝落幕，遗产未止",
    short: "两宋终章落下，而制度、城市与审美仍继续流动。",
    detail:
      "南宋阶段至1279年结束。王朝意义上的终局并未抹去两宋遗产；制度、城市、技术与审美继续进入之后的中国文化史。",
    category: "政权",
    tag: "王朝终章",
    source: "史密森尼亚洲艺术国家博物馆",
    sourceUrl:
      "https://asia-archive.si.edu/learn/for-educators/teaching-china-with-the-smithsonian/explore-by-dynasty/song-dynasty/",
    tone: "seal",
  },
];

const FILTERS: Category[] = ["全部", "政权", "外交", "技术", "制度", "城市", "转折"];

const categoryLabels: Record<Exclude<Category, "全部">, string> = {
  政权: "王朝与政权",
  外交: "边境与外交",
  技术: "技术与知识",
  制度: "制度与改革",
  城市: "城市与贸易",
  转折: "重大转折",
};

function SealMark({ compact = false }: { compact?: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={`songli-mark relative grid place-items-center border border-[#78A9A1] text-[#78A9A1] ${compact ? "h-9 w-9" : "h-11 w-11"}`}
    >
      <span className="absolute h-[42%] w-[42%] rounded-full border border-current" />
      <span className="h-px w-[70%] bg-current" />
    </div>
  );
}

function EventBadge({ tone }: { tone: TimelineEvent["tone"] }) {
  if (tone === "seal") {
    return (
      <span className="relative mt-1 grid h-5 w-5 place-items-center border border-[#b86a5a] bg-[#f6f2e8] text-[8px] font-serif font-bold text-[#a66457] night:bg-[#0e161a]" aria-label="王朝级转折">
        宋
        <span className="absolute inset-[3px] border border-[#b86a5a]/70" />
      </span>
    );
  }
  return (
    <span
      className={`mt-2 inline-flex h-3 w-3 shrink-0 rounded-full border-2 border-[#f6f2e8] shadow-[0_0_0_1px_rgba(36,42,40,.18)] ${
        tone === "ink"
            ? "bg-[#28302e]"
            : "bg-[#78A9A1]"
      }`}
    />
  );
}

export default function Home() {
  const [filter, setFilter] = useState<Category>("全部");
  const [selected, setSelected] = useState<TimelineEvent>(EVENTS[0]);
  const [night, setNight] = useState(false);
  const [query, setQuery] = useState("");
  const [yearRange, setYearRange] = useState({ start: 960, end: 1279 });
  const [timelineAnnouncement, setTimelineAnnouncement] = useState("使用方向键切换历史节点。");

  const visibleEvents = useMemo(() => {
    const normalized = query.trim();
    return EVENTS.filter((event) => {
      const matchFilter = filter === "全部" || event.category === filter;
      const matchQuery =
        !normalized ||
        `${event.year}${event.title}${event.short}${event.tag}`.toLowerCase().includes(normalized.toLowerCase());
      const firstYear = event.year.includes("11世纪") ? 1040 : Number(event.year.match(/\d{3,4}/)?.[0] ?? 960);
      return matchFilter && matchQuery && firstYear >= yearRange.start && firstYear <= yearRange.end;
    });
  }, [filter, query, yearRange]);

  const scrollToTimeline = () => document.getElementById("time-spine")?.scrollIntoView({ behavior: "smooth" });

  useEffect(() => {
    if (visibleEvents.length > 0 && !visibleEvents.some((event) => event.id === selected.id)) setSelected(visibleEvents[0]);
  }, [visibleEvents, selected.id]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.defaultPrevented) return;
      const target = event.target as HTMLElement | null;
      if (target?.matches("input, textarea, select, [contenteditable='true']")) return;
      if (!(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"] as string[]).includes(event.key) || visibleEvents.length === 0) return;
      event.preventDefault();
      const currentIndex = Math.max(0, visibleEvents.findIndex((item) => item.id === selected.id));
      const direction = event.key === "ArrowLeft" || event.key === "ArrowUp" ? -1 : 1;
      const nextIndex = nextTimelineIndex(visibleEvents.length, currentIndex, direction);
      const next = visibleEvents[nextIndex];
      setSelected(next);
      setTimelineAnnouncement(`已切换至 ${next.year} · ${next.title}`);
      window.requestAnimationFrame(() => {
        const node = document.querySelector<HTMLElement>(`[data-event-id="${next.id}"]`);
        node?.focus({ preventScroll: true });
        node?.scrollIntoView({ behavior: "smooth", block: "center" });
      });
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [visibleEvents, selected.id]);

  useEffect(() => {
    const handleChainSelection = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      const target = EVENTS.find((item) => item.id === id);
      if (!target) return;
      setSelected(target);
      setTimelineAnnouncement(`已从连锁反应切换至 ${target.year} · ${target.title}`);
    };
    window.addEventListener("songli:select-event", handleChainSelection);
    return () => window.removeEventListener("songli:select-event", handleChainSelection);
  }, []);

  return (
    <div className={night ? "night-mode min-h-screen" : "min-h-screen"}>
      <div className="paper-shell min-h-screen overflow-x-hidden bg-[#f6f2e8] text-[#28302e] transition-colors duration-300">
        <header className="sticky top-0 z-50 border-b border-[#28302e]/10 bg-[#f6f2e8]/90 backdrop-blur-xl night:bg-[#0e161a]/90">
          <div className="mx-auto flex h-[76px] max-w-[1440px] items-center justify-between px-5 md:px-10">
            <a href="#top" className="group flex items-center gap-3" aria-label="宋历首页">
              <SealMark compact />
              <div className="leading-none">
                <p className="font-serif text-[22px] font-black tracking-[0.18em]">宋历</p>
                <p className="mt-1 font-mono text-[9px] uppercase tracking-[0.24em] text-[#71817d]">960—1279</p>
              </div>
            </a>

            <nav className="hidden items-center gap-7 text-sm text-[#53615d] lg:flex" aria-label="主导航">
              <a className="nav-link" href="#time-spine">历史脊柱</a>
              <a className="nav-link" href="#parallel-scroll">并读卷轴</a>
              <a className="nav-link" href="#comparison">对比视图</a>
              <a className="nav-link" href="#reading-path">阅读路径</a>
              <a className="nav-link" href="#fate-slices">命运切片</a>
              <a className="nav-link" href="#history-chain">连锁反应</a>
              <a className="nav-link" href="#city-people-atlas">城市人物</a>
              <a className="nav-link" href="#micro-tracks">微观轨道</a>
              <a className="nav-link" href="#map-layer">地理图层</a>
              <a className="nav-link" href="#reading-room">阅读室</a>
              <a className="nav-link" href="#sources">参考来源</a>
            </nav>

            <button
              type="button"
              onClick={() => setNight((value) => !value)}
              className="group inline-flex items-center gap-2 border border-[#28302e]/15 px-3 py-2 text-xs font-medium transition hover:border-[#78A9A1] hover:text-[#4f8c85] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#78A9A1] night:border-white/20"
              aria-label={night ? "切换至昼间阅读" : "切换至夜间阅读"}
            >
              {night ? <Sun size={15} strokeWidth={1.6} /> : <Moon size={15} strokeWidth={1.6} />}
              <span>{night ? "昼读" : "夜读"}</span>
            </button>
          </div>
        </header>

        <main id="top">
          <section className="relative mx-auto grid max-w-[1440px] overflow-hidden border-x border-[#28302e]/10 lg:min-h-[760px] lg:grid-cols-[1.02fr_.98fr]">
            <div className="relative z-10 flex flex-col justify-between px-6 pb-12 pt-14 md:px-12 md:pb-16 md:pt-24 lg:px-20">
              <div className="spine-preview" aria-hidden="true">
                <span />
                <span />
                <span />
                <span />
              </div>
              <div className="max-w-[690px]">
                <div className="mb-8 flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.22em] text-[#4f8c85]">
                  <span className="h-px w-10 bg-[#78A9A1]" />
                  北宋至南宋 · 微观时间轴
                </div>
                <h1 className="max-w-[650px] font-serif text-[clamp(3.35rem,7vw,7rem)] font-black leading-[.94] tracking-[-0.075em] text-[#28302e] night:text-[#e8e2d3]">
                  沿一线天青，
                  <br />
                  重读两宋。
                </h1>
                <p className="mt-8 max-w-[500px] text-[17px] leading-8 text-[#53615d] night:text-[#b4b9b2]">
                  从北宋建立到南宋终结，顺着制度、技术、城市与政权转折的细部线索，展开一卷可探索的历史地图。
                </p>
              </div>

              <div className="mt-16 flex flex-wrap items-center gap-x-8 gap-y-4">
                <button
                  type="button"
                  onClick={scrollToTimeline}
                  className="group inline-flex items-center gap-3 bg-[#28302e] px-5 py-3 text-sm text-[#f6f2e8] transition hover:bg-[#4f8c85] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[#78A9A1] night:bg-[#78A9A1] night:text-[#0e161a]"
                >
                  展开历史脊柱
                  <ArrowDownRight size={17} className="transition-transform duration-200 group-hover:translate-y-0.5" />
                </button>
                <p className="font-mono text-[11px] tracking-[0.12em] text-[#71817d]">08 节点 / 04 轨道 / 06 来源</p>
              </div>
            </div>

            <div className="relative min-h-[430px] overflow-hidden border-t border-[#28302e]/10 lg:border-l lg:border-t-0">
              <img
                src="/manus-storage/timeline-light_ef760368.png"
                alt="宣纸白昼气质的宋韵时间轴主视觉"
                className="absolute inset-0 h-full w-full object-cover object-[center_30%]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#f6f2e8] via-[#f6f2e8]/25 to-[#f6f2e8]/5 night:from-[#0e161a] night:via-[#0e161a]/20" />
              <div className="absolute bottom-7 right-7 grid max-w-[220px] grid-cols-[auto_1fr] items-center gap-3 bg-[#f6f2e8]/80 px-4 py-3 backdrop-blur-sm night:bg-[#0e161a]/75">
                <CircleDot size={18} className="text-[#4f8c85]" strokeWidth={1.4} />
                <p className="text-xs leading-5 text-[#53615d] night:text-[#c3c9c1]">以卷轴、山水和档案索引重组历史阅读。</p>
              </div>
            </div>
          </section>

          <section className="mx-auto max-w-[1440px] border-x border-b border-[#28302e]/10 px-6 py-12 md:px-12 lg:px-20">
            <div className="grid gap-8 md:grid-cols-[.8fr_1.2fr] md:items-end">
              <div>
                <p className="eyebrow">读图索引</p>
                <h2 className="mt-3 max-w-md font-serif text-4xl font-black tracking-[-0.055em] md:text-5xl">两个时代，四条线索。</h2>
              </div>
              <p className="max-w-[610px] justify-self-end text-base leading-8 text-[#53615d] night:text-[#b4b9b2]">
                主轴只保留改变叙事走向的年份；边缘的制度、知识、生产与城市轨道，则把宏大的王朝兴亡重新落回可感的历史细节。
              </p>
            </div>

            <div className="mt-10 grid divide-y divide-[#28302e]/10 border-y border-[#28302e]/10 md:grid-cols-4 md:divide-x md:divide-y-0">
              {[
                ["北宋", "960—1127", "统一、制度与都市增长"],
                ["南宋", "1127—1279", "南迁、临安与海贸网络"],
                ["转折", "02", "靖康之变 · 临安失守"],
                ["微观轨道", "04", "制度 · 技术 · 城市 · 经济"],
              ].map(([label, value, caption]) => (
                <div key={label} className="px-0 py-6 md:px-6 lg:px-8">
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#4f8c85]">{label}</p>
                  <p className="mt-3 font-serif text-3xl font-bold tracking-tight">{value}</p>
                  <p className="mt-2 text-sm leading-6 text-[#71817d]">{caption}</p>
                </div>
              ))}
            </div>
          </section>

          <section id="time-spine" className="mx-auto max-w-[1440px] border-x border-[#28302e]/10 px-6 py-20 md:px-12 lg:px-20 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[210px_minmax(0,1fr)_340px] lg:gap-14">
              <aside className="lg:sticky lg:top-28 lg:h-fit">
                <p className="eyebrow">历史脊柱</p>
                <h2 className="mt-3 font-serif text-4xl font-black tracking-[-0.055em]">事件筛选</h2>
                <p className="mt-4 text-sm leading-7 text-[#71817d]">选择一条线索，时间轴会保留相邻的历史上下文。</p>
                <p id="timeline-shortcut-hint" className="mt-3 border-l border-[#78a9a1] pl-3 text-[11px] leading-5 text-[#71817d]">快捷键：使用 ← → 或 ↑ ↓ 在当前筛选结果中切换节点。</p>

                <div className="mt-7 flex flex-wrap gap-2 lg:flex-col lg:items-start">
                  {FILTERS.map((item) => (
                    <button
                      type="button"
                      key={item}
                      onClick={() => setFilter(item)}
                      className={`filter-chip ${filter === item ? "filter-chip-active" : ""}`}
                      aria-pressed={filter === item}
                    >
                      {item}
                      {item !== "全部" && <span className="text-[10px] opacity-60">{EVENTS.filter((event) => event.category === item).length}</span>}
                    </button>
                  ))}
                </div>

                <label className="relative mt-8 block">
                  <span className="sr-only">搜索历史节点</span>
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#71817d]" size={15} strokeWidth={1.7} />
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    placeholder="检索年份或事件"
                    className="h-11 w-full border-b border-[#28302e]/20 bg-transparent pl-9 pr-3 text-sm outline-none transition placeholder:text-[#9ca6a1] focus:border-[#78A9A1] night:border-white/20"
                  />
                </label>
                <div className="mt-8 border-y border-[#28302e]/12 py-5">
                  <div className="flex items-center justify-between"><p className="font-mono text-[10px] tracking-[0.18em] text-[#4f8c85]">年份跨度</p><button type="button" onClick={() => setYearRange({ start: 960, end: 1279 })} className="text-[10px] text-[#71817d] underline underline-offset-4">重置</button></div>
                  <p className="mt-3 font-serif text-xl font-bold">{yearRange.start} — {yearRange.end}</p>
                  <label className="mt-4 block text-[11px] text-[#71817d]">起点<input className="year-slider" type="range" min="960" max="1279" value={yearRange.start} onChange={(event) => setYearRange((range) => ({ start: Math.min(Number(event.target.value), range.end), end: range.end }))} /></label>
                  <label className="mt-3 block text-[11px] text-[#71817d]">终点<input className="year-slider" type="range" min="960" max="1279" value={yearRange.end} onChange={(event) => setYearRange((range) => ({ start: range.start, end: Math.max(Number(event.target.value), range.start) }))} /></label>
                </div>
              </aside>

              <div className="relative pt-3 before:absolute before:bottom-0 before:left-[17px] before:top-0 before:w-px before:bg-[#28302e]/14 md:before:left-1/2">
                <div className="mb-12 flex items-center gap-3 pl-10 md:justify-center md:pl-0">
                  <span className="h-2.5 w-2.5 rounded-full bg-[#78A9A1] shadow-[0_0_0_5px_rgba(120,169,161,.14)]" />
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#4f8c85]">960 · 北宋</span>
                </div>

                {visibleEvents.length > 0 ? (
                  <div className="space-y-4 md:space-y-0">
                    {visibleEvents.map((event, index) => {
                      const isLeft = index % 2 === 0;
                      const isSelected = selected.year === event.year;
                      return (
                        <article key={event.year} className="timeline-row group relative grid md:min-h-[170px] md:grid-cols-[1fr_56px_1fr]">
                          <div className={`${isLeft ? "md:col-start-1 md:text-right md:pr-10" : "md:col-start-3 md:pl-10"} pl-10 md:pl-0`}>
                            <button
                              type="button"
                              onClick={() => setSelected(event)}
                              data-event-id={event.id}
                              className={`timeline-entry w-full text-left md:text-inherit ${isSelected ? "timeline-entry-selected" : ""}`}
                              aria-expanded={isSelected}
                              aria-describedby="timeline-shortcut-hint"
                            >
                              <div className={`flex items-start gap-4 ${isLeft ? "md:flex-row-reverse" : ""}`}>
                                <div>
                                  <p className="font-mono text-[11px] font-medium tracking-[0.16em] text-[#4f8c85]">{event.year}</p>
                                  <h3 className="mt-1 font-serif text-[27px] font-bold tracking-[-0.04em]">{event.title}</h3>
                                  <p className="mt-2 max-w-[310px] text-sm leading-6 text-[#71817d] md:inline-block">{event.short}</p>
                                  <div className={`mt-4 flex items-center gap-2 ${isLeft ? "md:justify-end" : ""}`}>
                                    <span className={`event-tag ${event.tone === "seal" ? "event-tag-seal" : ""}`}>{event.tag}</span>
                                    <ChevronRight size={14} className="text-[#78A9A1]" />
                                  </div>
                                </div>
                              </div>
                            </button>
                          </div>
                          <div className="absolute left-[11px] top-1 md:static md:col-start-2 md:grid md:place-items-start md:justify-items-center">
                            <EventBadge tone={event.tone} />
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="ml-10 border-b border-[#28302e]/15 py-10 text-sm text-[#71817d] md:ml-0 md:text-center">未找到匹配的历史节点。请调整筛选条件或关键词。</div>
                )}
                <p className="sr-only" aria-live="polite">{timelineAnnouncement}</p>

                <div className="mt-10 flex items-center gap-3 pl-10 md:justify-center md:pl-0">
                  <span className="grid h-5 w-5 place-items-center border border-[#b86a5a] bg-[#f6f2e8] font-serif text-[8px] font-bold text-[#a66457] night:bg-[#0e161a]">宋</span>
                  <span className="font-mono text-[10px] tracking-[0.2em] text-[#9c655c]">1279 · 两宋终章</span>
                </div>
              </div>

              <aside className="lg:sticky lg:top-28 lg:h-fit">
                <div className="border-y border-[#28302e]/15 py-6 lg:border-t">
                  <div className="flex items-center justify-between gap-4">
                    <p className="eyebrow">册页注释</p>
                    <button
                      type="button"
                      onClick={() => setSelected(EVENTS[0])}
                      className="text-xs text-[#71817d] underline decoration-[#78A9A1]/60 underline-offset-4 transition hover:text-[#4f8c85]"
                    >
                      回到起点
                    </button>
                  </div>
                  <p className="mt-5 font-mono text-[11px] tracking-[0.16em] text-[#4f8c85]">{selected.year}</p>
                  <h3 className="mt-1 font-serif text-3xl font-bold tracking-[-0.045em]">{selected.title}</h3>
                  <p className="mt-4 text-[15px] leading-7 text-[#53615d] night:text-[#b4b9b2]">{selected.detail}</p>
                  {selected.id === "jingkang" && <div className="conflict-rail mt-6"><p className="eyebrow">冲突转折编排</p><ol className="mt-3"><li>联盟选择</li><li>边境压力</li><li>东京危局</li><li>政权南迁</li></ol><p className="mt-3 text-[11px] leading-5 text-[#71817d]">这是阅读链条，而非单因果解释；展开详情页可继续查看人物与史料索引。</p></div>}
                  <div className="mt-6 flex items-center justify-between border-t border-[#28302e]/10 pt-4 text-xs text-[#71817d]">
                    <span>{categoryLabels[selected.category]}</span>
                    <a
                      href={selected.sourceUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 text-[#4f8c85] hover:underline"
                    >
                      来源 <ArrowUpRight size={13} />
                    </a>
                  </div>
                  <p className="mt-2 text-[11px] leading-5 text-[#8a948f]">{selected.source}</p>
                  <a href={`/event/${selected.id}`} className="mt-5 inline-flex items-center gap-2 border-b border-[#78A9A1] pb-1 text-xs font-medium text-[#4f8c85] transition hover:gap-3">展开史料详情页 <ArrowUpRight size={13} /></a>
                  <div className="mt-7 flex items-center gap-3 border-t border-[#28302e]/10 pt-5">
                    <SealMark compact />
                    <p className="font-mono text-[9px] tracking-[0.16em] text-[#71817d]">SONGLI / ARCHIVE NOTE</p>
                  </div>
                </div>
              </aside>
            </div>
          </section>

          <ParallelScrollTimeline events={EVENTS} />

          <FateSlices />

          <HistoryChain />

          <CityPeopleAtlas />

          <ExploreLab events={EVENTS} />

          <section id="micro-tracks" className="border-y border-[#28302e]/10 bg-[#ebe7db] night:bg-[#121d20]">
            <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 lg:px-20 lg:py-28">
              <div className="grid gap-8 lg:grid-cols-[.78fr_1.22fr] lg:items-end">
                <div>
                  <p className="eyebrow">四条微观轨道</p>
                  <h2 className="mt-3 max-w-md font-serif text-4xl font-black tracking-[-0.055em] md:text-5xl">王朝之外，历史仍在生长。</h2>
                </div>
                <p className="max-w-[660px] justify-self-end text-base leading-8 text-[#53615d] night:text-[#b4b9b2]">
                  北宋的制度讨论、印刷技术与城市扩张，南宋的临安水路、商市与海贸，构成了另一条不依附于战争与皇帝的历史脉络。
                </p>
              </div>

              <div className="mt-14 grid divide-y divide-[#28302e]/12 border-y border-[#28302e]/12 md:grid-cols-2 md:divide-x md:divide-y-0">
                {[
                  [BookOpen, "制度与知识", "科举取士 · 士大夫文化 · 雕版与活字", "知识如何进入制度，并在书页与考试之间被反复复制。"],
                  [Landmark, "技术与生产", "稻作扩展 · 铁业发展 · 印刷革新", "农业、铁业与印刷共同支撑更复杂的城市与市场生活。"],
                  [Waves, "城市与贸易", "运河水网 · 临安商市 · 海贸通道", "水路把临安连接到腹地、港口与更广阔的贸易世界。"],
                  [CircleDot, "北方与南迁", "宋辽关系 · 金宋冲突 · 政治南移", "政权的南迁改变了政治地理，也放大了江南的文化与经济位置。"],
                ].map(([Icon, title, keywords, description]) => {
                  const TrackIcon = Icon as typeof BookOpen;
                  return (
                    <article key={title as string} className="group relative px-0 py-8 md:px-8 lg:px-10">
                      <span className="absolute right-1 top-6 font-mono text-[10px] tracking-[0.16em] text-[#78A9A1]/70">0{["制度与知识", "技术与生产", "城市与贸易", "北方与南迁"].indexOf(title as string) + 1}</span>
                      <TrackIcon size={21} className="text-[#4f8c85]" strokeWidth={1.4} />
                      <h3 className="mt-5 font-serif text-3xl font-bold tracking-[-0.04em]">{title as string}</h3>
                      <p className="mt-3 font-mono text-[11px] leading-6 tracking-[0.1em] text-[#4f8c85]">{keywords as string}</p>
                      <p className="mt-5 max-w-sm text-sm leading-7 text-[#71817d]">{description as string}</p>
                    </article>
                  );
                })}
              </div>
            </div>
          </section>

          <ComparisonView />

          <GeographyMap />

          <section id="reading-room" className="mx-auto max-w-[1440px] border-x border-[#28302e]/10 px-6 py-20 md:px-12 lg:px-20 lg:py-28">
            <div className="grid gap-10 lg:grid-cols-[.95fr_1.05fr] lg:gap-16">
              <div>
                <p className="eyebrow">阅读室</p>
                <h2 className="mt-3 max-w-lg font-serif text-4xl font-black tracking-[-0.055em] md:text-5xl">同一时间线，也有昼夜两种读法。</h2>
                <p className="mt-6 max-w-[550px] text-base leading-8 text-[#53615d] night:text-[#b4b9b2]">
                  昼间模式以纸面留白承载信息密度；夜间模式以深墨、月光与低亮度天青收拢注意力。两种模式共享同一历史脊柱，改变的只是光感，而非叙事路径。
                </p>
                <button
                  type="button"
                  onClick={() => setNight((value) => !value)}
                  className="mt-8 inline-flex items-center gap-2 border-b border-[#78A9A1] pb-2 text-sm font-medium text-[#4f8c85] transition hover:gap-3"
                >
                  体验{night ? "昼间" : "夜间"}阅读
                  <ChevronRight size={16} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4 self-end md:gap-6">
                <figure className="relative overflow-hidden border border-[#28302e]/10 bg-[#f6f2e8] p-3">
                  <img
                    src="/manus-storage/timeline-light_ef760368.png"
                    alt="宋代时间轴昼间视觉稿"
                    className="h-[370px] w-full object-cover object-top md:h-[450px]"
                  />
                  <figcaption className="flex items-center justify-between pt-3 text-xs text-[#71817d]">
                    <span>昼读</span>
                    <span className="font-mono text-[10px] tracking-[0.12em]">PAPER / MIST</span>
                  </figcaption>
                </figure>
                <figure className="relative translate-y-8 overflow-hidden border border-[#28302e]/10 bg-[#0e161a] p-3 md:translate-y-12">
                  <img
                    src="/manus-storage/timeline-night_6595eb10.png"
                    alt="宋代时间轴夜间视觉稿"
                    className="h-[370px] w-full object-cover object-top md:h-[450px]"
                  />
                  <figcaption className="flex items-center justify-between pt-3 text-xs text-[#c5c8c0]">
                    <span>夜读</span>
                    <span className="font-mono text-[10px] tracking-[0.12em]">INK / MOON</span>
                  </figcaption>
                </figure>
              </div>
            </div>
          </section>

          <section id="sources" className="border-t border-[#28302e]/10 bg-[#28302e] text-[#e9e4d8]">
            <div className="mx-auto max-w-[1440px] px-6 py-16 md:px-12 lg:px-20">
              <div className="grid gap-10 lg:grid-cols-[.75fr_1.25fr]">
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.22em] text-[#9fc6bf]">参考来源</p>
                  <h2 className="mt-4 font-serif text-4xl font-black tracking-[-0.055em]">为每一个节点留下注脚。</h2>
                  <p className="mt-5 max-w-sm text-sm leading-7 text-[#b7beb5]">本站内容根据博物馆、大学与研究数据库公开资料整理。点击来源名称可返回原始页面继续阅读。</p>
                </div>
                <div className="grid gap-x-8 gap-y-0 sm:grid-cols-2">
                  {[
                    ["史密森尼亚洲艺术国家博物馆", "宋代960—1279年与南北宋分期", "https://asia-archive.si.edu/learn/for-educators/teaching-china-with-the-smithsonian/explore-by-dynasty/song-dynasty/"],
                    ["大都会艺术博物馆", "中国1000—1400年编年资料", "https://www.metmuseum.org/toah/ht/07/eac.html"],
                    ["哥伦比亚大学", "宋代技术、经济、城市与印刷", "https://afe.easia.columbia.edu/songdynasty-module/"],
                    ["EBSCO Research Starters", "王安石改革的年代与领域", "https://www.ebsco.com/research-starters/history/wang-anshi-introduces-bureaucratic-reforms/"],
                    ["李亚平《说宋朝》", "叙事参考：人物切入与章节节奏（非史料）", "https://www.youtube.com/playlist?list=PLZq60TqYoihpF8MXewu_SveWephV3cDD3"],
                  ].map(([name, note, href], index) => (
                    <a
                      key={name}
                      href={href}
                      target="_blank"
                      rel="noreferrer"
                      className="group border-t border-white/15 py-5 transition hover:border-[#9fc6bf]"
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-mono text-[10px] tracking-[0.18em] text-[#9fc6bf]">0{index + 1}</p>
                          <p className="mt-2 text-sm font-medium">{name}</p>
                          <p className="mt-2 text-xs leading-5 text-[#aeb6ad]">{note}</p>
                        </div>
                        <ArrowUpRight size={15} className="mt-1 shrink-0 text-[#9fc6bf] transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </section>
        </main>

        <footer className="border-t border-white/10 bg-[#28302e] px-6 py-6 text-xs text-[#aeb6ad] md:px-12 lg:px-20">
          <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3"><SealMark compact /><p>宋历 · 北宋至南宋微观时间轴</p></div>
            <p className="font-mono text-[10px] tracking-[0.14em]">READ SLOWLY / 960—1279</p>
          </div>
        </footer>
      </div>
    </div>
  );
}
