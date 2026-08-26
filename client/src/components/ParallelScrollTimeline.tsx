/**
 * 设计提醒｜并读卷轴：共同年份脊柱保持不动，轨道只是可选择的阅读层。
 * 条目与连线均指向本站阅读入口，不代表单一因果或影响力排序。
 */
import { useEffect, useMemo, useReducer, useRef, useState } from "react";
import "./ParallelScrollTimeline.css";
import { ArrowUpRight, BookOpen, Check, ChevronDown, ChevronUp, Copy, Link2, MapPinned, Pin, Share2, UsersRound, X } from "lucide-react";
import { ATLAS_CITIES } from "@/lib/cityPeopleAtlas";
import {
  chapterEventIds,
  compareParallelTracks,
  PARALLEL_CHAPTERS,
  PARALLEL_TRACKS,
  type ParallelTimelineEvent,
  visibleParallelItems,
} from "@/lib/parallelTimeline";
import {
  decodeParallelTimelineUrl,
  encodeParallelTimelineUrl,
  initialParallelTimelineState,
  parallelTimelineReducer,
} from "@/lib/parallelTimelineMachine";

type Props = { events: ParallelTimelineEvent[] };

const PERSON_NAMES: Record<string, string> = {
  "zhao-kuangyin": "赵匡胤", "song-zhenzong": "宋真宗", "kou-zhun": "寇准", "bi-sheng": "毕昇", "wang-anshi": "王安石", "song-shenzong": "宋神宗", "song-huizong": "宋徽宗", "song-qinzong": "宋钦宗", "song-gaozong": "宋高宗", "wen-tianxiang": "文天祥", "lu-xiufu": "陆秀夫",
};

const trackIcons = { politics: BookOpen, city: MapPinned, people: UsersRound, institution: BookOpen, knowledge: BookOpen };

function unique<T>(items: T[]) { return Array.from(new Set(items)); }

export function ParallelScrollTimeline({ events }: Props) {
  const [state, dispatch] = useReducer(parallelTimelineReducer, initialParallelTimelineState);
  const [ready, setReady] = useState(false);
  const [shareStatus, setShareStatus] = useState("复制此刻的阅读状态");
  const hydrated = useRef(false);
  const folioHeadingRef = useRef<HTMLHeadingElement>(null);
  const shareTimerRef = useRef<number | null>(null);
  const scopedEvents = useMemo(() => {
    const ids = chapterEventIds(state.chapterId);
    return events.filter((event) => ids.includes(event.id));
  }, [events, state.chapterId]);
  const visibleTracks = useMemo(() => PARALLEL_TRACKS.filter((track) => state.visibleTrackIds.includes(track.id)), [state.visibleTrackIds]);
  const trackItems = useMemo(() => visibleParallelItems(state.chapterId, state.visibleTrackIds), [state.chapterId, state.visibleTrackIds]);
  const folioEvent = events.find((event) => event.id === state.folioEventId) ?? null;
  const folioItems = folioEvent ? trackItems.filter((item) => item.eventId === folioEvent.id) : [];
  const folioPeople = unique(folioItems.flatMap((item) => item.personIds ?? [])).filter((id) => PERSON_NAMES[id]);
  const folioPlaces = unique(folioItems.flatMap((item) => item.placeIds ?? [])).map((id) => ATLAS_CITIES.find((city) => city.id === id)).filter(Boolean);
  const pinnedEvents = state.pinnedEventIds.map((id) => events.find((event) => event.id === id)).filter(Boolean) as ParallelTimelineEvent[];
  const trackComparison = useMemo(() => pinnedEvents.length === 2 ? compareParallelTracks(pinnedEvents[0].id, pinnedEvents[1].id, state.visibleTrackIds) : [], [pinnedEvents, state.visibleTrackIds]);

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => setReady(true));
    return () => window.cancelAnimationFrame(frame);
  }, []);

  useEffect(() => () => { if (shareTimerRef.current) window.clearTimeout(shareTimerRef.current); }, []);

  useEffect(() => {
    if (hydrated.current) return;
    hydrated.current = true;
    dispatch({ type: "HYDRATE", payload: decodeParallelTimelineUrl(window.location.search) });
  }, []);

  useEffect(() => {
    if (!hydrated.current) return;
    window.history.replaceState({}, "", encodeParallelTimelineUrl(state));
  }, [state.chapterId, state.visibleTrackIds, state.focusedEventId, state.pinnedEventIds]);

  useEffect(() => {
    const receiveExternalEvent = (event: Event) => {
      const eventId = (event as CustomEvent<string>).detail;
      const chapter = PARALLEL_CHAPTERS.find((item) => item.id !== "all" && item.eventIds.includes(eventId));
      if (chapter) dispatch({ type: "SELECT_CHAPTER", chapterId: chapter.id });
      dispatch({ type: "OPEN_FOLIO", eventId, mobile: window.matchMedia("(max-width: 767px)").matches });
      window.setTimeout(() => {
        document.getElementById("parallel-scroll")?.scrollIntoView({ behavior: "smooth", block: "start" });
        folioHeadingRef.current?.focus({ preventScroll: true });
      }, 20);
    };
    window.addEventListener("songli:select-event", receiveExternalEvent);
    return () => window.removeEventListener("songli:select-event", receiveExternalEvent);
  }, []);

  const focusEvent = (eventId: string) => {
    dispatch({ type: "FOCUS_EVENT", eventId });
    window.requestAnimationFrame(() => document.querySelector<HTMLElement>(`[data-parallel-year-id="${eventId}"]`)?.focus({ preventScroll: true }));
  };

  const openFolio = (eventId: string) => {
    dispatch({ type: "OPEN_FOLIO", eventId, mobile: window.matchMedia("(max-width: 767px)").matches });
    window.setTimeout(() => folioHeadingRef.current?.focus({ preventScroll: true }), 20);
  };

  const onTimelineKeyDown = (event: React.KeyboardEvent<HTMLElement>) => {
    if (event.key === "Escape" && state.folioEventId) {
      event.preventDefault();
      dispatch({ type: "CLOSE_FOLIO" });
      focusEvent(state.focusedEventId);
      return;
    }
    if (event.key !== "ArrowUp" && event.key !== "ArrowDown") return;
    event.preventDefault();
    const current = Math.max(0, scopedEvents.findIndex((item) => item.id === state.focusedEventId));
    const direction = event.key === "ArrowUp" ? -1 : 1;
    const next = scopedEvents[(current + direction + scopedEvents.length) % scopedEvents.length];
    if (next) focusEvent(next.id);
  };

  const shareReadingState = async () => {
    const url = new URL(encodeParallelTimelineUrl(state), window.location.origin).toString();
    setShareStatus("正在复制当前阅读状态…");
    const fallbackCopy = () => {
      const input = document.createElement("textarea");
      input.value = url;
      input.style.position = "fixed";
      input.style.opacity = "0";
      document.body.appendChild(input);
      input.select();
      const copied = document.execCommand("copy");
      input.remove();
      if (!copied) throw new Error("copy command unavailable");
    };
    try {
      if (navigator.clipboard?.writeText) {
        const copied = await Promise.race([
          navigator.clipboard.writeText(url).then(() => true).catch(() => false),
          new Promise<boolean>((resolve) => window.setTimeout(() => resolve(false), 220)),
        ]);
        if (!copied) fallbackCopy();
      } else fallbackCopy();
      setShareStatus("阅读链接已复制，可分享当前章节、轨道与对照节点。");
    } catch {
      setShareStatus("浏览器未授予剪贴板权限；可从地址栏复制当前阅读状态。");
    }
    if (shareTimerRef.current) window.clearTimeout(shareTimerRef.current);
    shareTimerRef.current = window.setTimeout(() => setShareStatus("复制此刻的阅读状态"), 3600);
  };

  return (
    <section id="parallel-scroll" data-parallel-timeline className="parallel-scroll border-y border-[#28302e]/10 bg-[#e9e7db]/50 night:bg-[#111d20]" onKeyDown={onTimelineKeyDown}>
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 lg:px-20 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div>
            <p className="eyebrow">并读卷轴 · P0</p>
            <h2 className="mt-3 max-w-lg font-serif text-4xl font-black tracking-[-0.055em] md:text-5xl">同一段宋史，沿不止一条线阅读。</h2>
          </div>
          <p className="max-w-[660px] justify-self-end text-base leading-8 text-[#53615d] night:text-[#b4b9b2]">年份脊柱保持共同刻度；政权、城市与人物默认并列。线索只提供本站的继续阅读入口，不表达单一因果或影响力排序。</p>
        </div>

        <div className="parallel-controls mt-12" aria-label="并读卷轴阅读控制">
          <div className="parallel-control-group">
            <span className="parallel-control-label">章节窗</span>
            <div className="parallel-chip-row" role="tablist" aria-label="选择历史章节">
              {PARALLEL_CHAPTERS.map((chapter) => <button key={chapter.id} type="button" role="tab" aria-selected={state.chapterId === chapter.id} onClick={() => dispatch({ type: "SELECT_CHAPTER", chapterId: chapter.id })} className={`parallel-chip ${state.chapterId === chapter.id ? "parallel-chip-active" : ""}`}>{chapter.label}</button>)}
            </div>
          </div>
          <div className="parallel-control-group parallel-track-control">
            <div className="flex items-center justify-between gap-4"><span className="parallel-control-label">阅读轨道</span><button type="button" className="parallel-mobile-track-toggle" aria-expanded={state.mobilePanel === "tracks"} onClick={() => dispatch({ type: "SET_MOBILE_PANEL", panel: state.mobilePanel === "tracks" ? "closed" : "tracks" })}>{state.mobilePanel === "tracks" ? <ChevronUp size={14} /> : <ChevronDown size={14} />}轨道 {state.visibleTrackIds.length}/5</button></div>
            <div className={`parallel-track-chip-row ${state.mobilePanel === "tracks" ? "parallel-track-chip-row-open" : ""}`}>
              {PARALLEL_TRACKS.map((track) => {
                const Icon = trackIcons[track.id];
                const selected = state.visibleTrackIds.includes(track.id);
                return <button key={track.id} type="button" aria-pressed={selected} onClick={() => dispatch({ type: "TOGGLE_TRACK", trackId: track.id })} className={`parallel-track-chip ${selected ? "parallel-track-chip-active" : ""}`}><Icon size={13} strokeWidth={1.5} />{track.label}{selected && <Check size={12} />}</button>;
              })}
            </div>
          </div>
          <div className="parallel-share-control">
            <button type="button" onClick={shareReadingState} className="parallel-share-button"><Share2 size={14} strokeWidth={1.5} />复制阅读链接</button>
            <p className="parallel-share-note"><Link2 size={12} />章节、轨道、年份与案头对照会一并写入链接。</p>
            <p className="sr-only" aria-live="polite" data-parallel-share-status>{shareStatus}</p>
          </div>
        </div>

        <div className={`parallel-sheet mt-10 ${ready ? "parallel-ready" : ""}`}>
          <div className="parallel-sheet-note"><span>共同年份脊柱</span><span>↑ ↓ 切换年份 · Enter 打开同年册页 · Escape 返回</span></div>
          <div className="parallel-canvas" style={{ gridTemplateColumns: `132px repeat(${Math.max(visibleTracks.length, 1)}, minmax(180px, 1fr))` }}>
            <div className="parallel-year-spine" style={{ "--parallel-years": scopedEvents.length } as React.CSSProperties} role="listbox" aria-label="并读卷轴年份脊柱" aria-activedescendant={`parallel-year-${state.focusedEventId}`}>
              {scopedEvents.map((event) => <button key={event.id} id={`parallel-year-${event.id}`} type="button" role="option" aria-selected={state.focusedEventId === event.id} data-parallel-year-id={event.id} onFocus={() => dispatch({ type: "FOCUS_EVENT", eventId: event.id })} onClick={() => openFolio(event.id)} className={`parallel-year ${state.focusedEventId === event.id ? "parallel-year-active" : ""} ${event.tone === "seal" ? "parallel-year-seal" : ""}`}><span>{event.year}</span><i aria-hidden="true" /><small>{event.tag}</small></button>)}
            </div>
            {visibleTracks.map((track) => <div key={track.id} className="parallel-lane" style={{ gridTemplateRows: `44px repeat(${scopedEvents.length}, minmax(86px, auto))` }}>
              <div className="parallel-lane-head"><span>{track.label}</span><small>{track.subtitle}</small></div>
              {scopedEvents.map((event) => {
                const items = trackItems.filter((item) => item.trackId === track.id && item.eventId === event.id);
                return <div key={event.id} className="parallel-lane-cell">{items.map((item) => <button key={item.id} type="button" onClick={() => openFolio(event.id)} className={`parallel-item ${state.focusedEventId === event.id ? "parallel-item-related" : ""}`}><span>{item.relationLabel}</span><strong>{item.label}</strong><i>{event.year}</i></button>)}</div>;
              })}
            </div>)}
          </div>
          <p className="parallel-boundary">条目只基于站内已核验事件、人物与城市资料生成；同一列的并列不意味着这些线索间存在确定的因果链。</p>
        </div>

        {folioEvent && <section key={folioEvent.id} className="parallel-folio parallel-folio-enter mt-10" aria-label={`${folioEvent.year} ${folioEvent.title} 同年册页`}>
          <div className="parallel-folio-spine"><span>{folioEvent.year}</span><i className={folioEvent.tone === "seal" ? "parallel-folio-seal" : ""} /></div>
          <div className="parallel-folio-main">
            <div className="flex items-start justify-between gap-6"><div><p className="eyebrow">同年展开笺</p><h3 ref={folioHeadingRef} tabIndex={-1} className="mt-3 font-serif text-3xl font-black tracking-[-.05em] outline-none md:text-4xl">{folioEvent.title}</h3></div><button type="button" onClick={() => { dispatch({ type: "CLOSE_FOLIO" }); focusEvent(state.focusedEventId); }} className="parallel-folio-close" aria-label="关闭同年册页"><X size={16} /></button></div>
            <p className="mt-5 max-w-3xl text-[15px] leading-8 text-[#53615d] night:text-[#b4b9b2]">{folioEvent.detail}</p>
            <div className="parallel-folio-index mt-7">
              <div><p className="parallel-folio-label">同年轨道</p><div className="mt-3 flex flex-wrap gap-2">{folioItems.map((item) => <span key={item.id} className="parallel-folio-token"><b>{PARALLEL_TRACKS.find((track) => track.id === item.trackId)?.label}</b>{item.label}</span>)}</div></div>
              {folioPlaces.length > 0 && <div><p className="parallel-folio-label">城市锚点</p><div className="mt-3 flex flex-wrap gap-2">{folioPlaces.map((place) => place && <a key={place.id} href="#city-people-atlas" className="parallel-folio-link"><MapPinned size={12} />{place.name}<span>{place.currentName}</span></a>)}</div></div>}
              {folioPeople.length > 0 && <div><p className="parallel-folio-label">人物入口</p><div className="mt-3 flex flex-wrap gap-2">{folioPeople.map((personId) => <a key={personId} href={`/event/${folioEvent.id}?person=${personId}`} className="parallel-folio-link"><UsersRound size={12} />{PERSON_NAMES[personId]}<ArrowUpRight size={11} /></a>)}</div></div>}
            </div>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-4 border-t border-[#28302e]/12 pt-5"><button type="button" onClick={() => dispatch({ type: "PIN_EVENT", eventId: folioEvent.id })} className="parallel-pin"><Pin size={14} />{state.pinnedEventIds.includes(folioEvent.id) ? "已置于案头" : "置于案头"}</button><a href={`/event/${folioEvent.id}`} className="parallel-source-link">史料详情 <ArrowUpRight size={13} /></a><a href={folioEvent.sourceUrl} target="_blank" rel="noreferrer" className="parallel-source-link">来源：{folioEvent.source} <ArrowUpRight size={13} /></a></div>
          </div>
        </section>}

        {pinnedEvents.length > 0 && <section className="parallel-desk mt-8" aria-label="置于案头的节点比较"><div className="parallel-desk-head"><p className="eyebrow">置于案头</p><p>最多保留两项；并读摘要不自动推出历史结论。</p></div><div className="parallel-desk-items">{pinnedEvents.map((event) => <article key={event.id} className="parallel-desk-item"><div className="flex items-start justify-between gap-4"><p className="font-mono text-[11px] tracking-[.15em] text-[#4f8c85]">{event.year}</p><button type="button" onClick={() => dispatch({ type: "UNPIN_EVENT", eventId: event.id })} className="parallel-desk-remove" aria-label={`移除 ${event.title}`}><X size={14} /></button></div><h3 className="mt-3 font-serif text-2xl font-bold tracking-[-.04em]">{event.title}</h3><p className="mt-3 text-sm leading-7 text-[#71817d]">{event.short}</p><div className="mt-5 flex flex-wrap gap-2">{PARALLEL_TRACKS.filter((track) => trackItems.some((item) => item.eventId === event.id && item.trackId === track.id)).map((track) => <span key={track.id} className="parallel-desk-track">{track.label}</span>)}</div></article>)}</div>
          {pinnedEvents.length === 2 && <div className="parallel-difference"><div className="parallel-difference-head"><div><p className="eyebrow">逐轨差异高亮</p><h3 className="mt-2 font-serif text-2xl font-bold tracking-[-.04em]">两节点在哪些轨道上同时出现，哪些只在一侧留下线索？</h3></div><span><Copy size={13} />基于站内条目覆盖，不代表因果或重要性</span></div><div className="parallel-difference-grid">{trackComparison.map((comparison) => { const track = PARALLEL_TRACKS.find((item) => item.id === comparison.trackId); const left = comparison.leftItems.map((item) => item.label).join("；"); const right = comparison.rightItems.map((item) => item.label).join("；"); return <article key={comparison.trackId} className={`parallel-difference-row parallel-difference-${comparison.mode}`}><div className="parallel-difference-track"><span>{track?.label}</span><small>{comparison.mode === "both" ? "两侧均有线索" : comparison.mode === "left-only" ? "仅左侧出现" : comparison.mode === "right-only" ? "仅右侧出现" : "暂无条目"}</small></div><p className={comparison.mode === "right-only" ? "parallel-difference-muted" : ""}>{left || "—"}</p><p className={comparison.mode === "left-only" ? "parallel-difference-muted" : ""}>{right || "—"}</p></article>; })}</div><p className="parallel-difference-boundary">高亮只帮助读者辨认本站现有主题入口的“同时出现”与“单侧出现”；它不衡量历史重要性，也不推导因果关系。</p></div>}
        </section>}
      </div>
    </section>
  );
}
