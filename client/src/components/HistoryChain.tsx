/**
 * 设计提醒｜卷轴地志：连锁反应是沿着一条细线展开的阅读路径，
 * 不把历史关系伪装成确定因果，不使用仪表板式卡片。
 */
import { useEffect, useMemo, useState } from "react";
import { ArrowUpRight, ChevronRight, GitBranch, RotateCcw } from "lucide-react";
import { getHistoryChain, HISTORY_CHAINS, nextHistoryChainIndex } from "@/lib/historyChains";

const EVENT_NAMES: Record<string, { year: string; title: string }> = {
  "northern-song": { year: "960", title: "建宋" }, chanyuan: { year: "1005", title: "澶渊" }, "movable-type": { year: "11世纪", title: "活字印刷" }, "new-policies": { year: "1069—1072", title: "熙宁新法" }, jingkang: { year: "1127", title: "靖康" }, linan: { year: "1138", title: "临安行在" }, "linan-fall": { year: "1276", title: "临安失守" }, "end-of-song": { year: "1279", title: "崖山之后" },
};

const CHAIN_PEOPLE: Record<string, { id: string; name: string; eventId: string; role: string }[]> = {
  "northern-song": [{ id: "zhao-kuangyin", name: "赵匡胤", eventId: "northern-song", role: "北宋开端" }],
  chanyuan: [{ id: "song-zhenzong", name: "宋真宗", eventId: "chanyuan", role: "北方关系" }, { id: "kou-zhun", name: "寇准", eventId: "chanyuan", role: "边境外交" }],
  "movable-type": [{ id: "bi-sheng", name: "毕昇", eventId: "movable-type", role: "技术传播" }],
  "new-policies": [{ id: "wang-anshi", name: "王安石", eventId: "new-policies", role: "制度改革" }, { id: "song-shenzong", name: "宋神宗", eventId: "new-policies", role: "改革政治" }],
  jingkang: [{ id: "song-huizong", name: "宋徽宗", eventId: "jingkang", role: "北方危局" }, { id: "song-qinzong", name: "宋钦宗", eventId: "jingkang", role: "东京危局" }, { id: "song-gaozong", name: "宋高宗", eventId: "jingkang", role: "南迁承接" }],
  linan: [{ id: "song-gaozong", name: "宋高宗", eventId: "linan", role: "行在与南渡" }],
  "linan-fall": [{ id: "wen-tianxiang", name: "文天祥", eventId: "linan-fall", role: "宋末政治" }, { id: "lu-xiufu", name: "陆秀夫", eventId: "linan-fall", role: "海上政局" }],
  "end-of-song": [{ id: "wen-tianxiang", name: "文天祥", eventId: "end-of-song", role: "宋末政治" }, { id: "lu-xiufu", name: "陆秀夫", eventId: "end-of-song", role: "王朝终章" }],
};

function openTimelineEvent(id: string) {
  window.dispatchEvent(new CustomEvent("songli:select-event", { detail: id }));
  window.setTimeout(() => document.getElementById("time-spine")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
}

export function HistoryChain() {
  const [activeId, setActiveId] = useState("jingkang");
  const active = useMemo(() => getHistoryChain(activeId), [activeId]);
  const people = CHAIN_PEOPLE[active.id] ?? [];

  useEffect(() => {
    const receiveTimelineSelection = (event: Event) => {
      const id = (event as CustomEvent<string>).detail;
      if (HISTORY_CHAINS.some((chain) => chain.id === id)) setActiveId(id);
    };
    window.addEventListener("songli:select-event", receiveTimelineSelection);
    return () => window.removeEventListener("songli:select-event", receiveTimelineSelection);
  }, []);

  const moveChain = (direction: -1 | 1) => {
    const current = HISTORY_CHAINS.findIndex((chain) => chain.id === activeId);
    const next = nextHistoryChainIndex(HISTORY_CHAINS.length, current, direction);
    if (next >= 0) setActiveId(HISTORY_CHAINS[next].id);
  };

  return (
    <section id="history-chain" className="mx-auto max-w-[1440px] border-x border-[#28302e]/10 px-6 py-20 md:px-12 lg:px-20 lg:py-28">
      <div className="grid gap-8 lg:grid-cols-[.7fr_1.3fr] lg:items-end">
        <div><p className="eyebrow">历史连锁反应</p><h2 className="mt-3 max-w-md font-serif text-4xl font-black tracking-[-0.055em] md:text-5xl">从一件事，走向三段余波。</h2></div>
        <p className="max-w-[650px] justify-self-end text-base leading-8 text-[#53615d] night:text-[#b4b9b2]">选择一个节点，沿着前因、当下冲突与后续余波展开。连线代表可继续阅读的历史关联，而非单一原因、必然结果或重要性的量化排序。</p>
      </div>

      <div className="mt-12 grid border-y border-[#28302e]/15 lg:grid-cols-[270px_1fr]">
        <aside className="border-b border-[#28302e]/15 py-7 lg:border-b-0 lg:border-r lg:px-7 lg:py-9">
          <div className="flex items-center justify-between"><p className="eyebrow">事件索引</p><GitBranch size={17} className="text-[#4f8c85]" strokeWidth={1.4} /></div>
          <div className="mt-6 divide-y divide-[#28302e]/12 border-y border-[#28302e]/12" role="listbox" tabIndex={0} aria-label="选择历史连锁反应" aria-activedescendant={`chain-option-${activeId}`} onKeyDown={(event) => { if (event.key === "ArrowUp" || event.key === "ArrowLeft") { event.preventDefault(); moveChain(-1); } if (event.key === "ArrowDown" || event.key === "ArrowRight") { event.preventDefault(); moveChain(1); } }}>
            {HISTORY_CHAINS.map((chain, index) => <button id={`chain-option-${chain.id}`} key={chain.id} type="button" role="option" aria-selected={activeId === chain.id} onClick={() => setActiveId(chain.id)} className={`chain-index ${activeId === chain.id ? "chain-index-active" : ""}`}><span>0{index + 1}</span><i>{chain.year}</i><strong>{chain.event}</strong></button>)}
          </div>
          <div className="mt-6 flex items-center justify-between text-[11px] text-[#71817d]"><span>← → 可切换事件</span><button type="button" onClick={() => setActiveId("jingkang")} className="inline-flex items-center gap-1 text-[#4f8c85] hover:underline"><RotateCcw size={12} />回到靖康</button></div>
        </aside>

        <article className="chain-leaf px-0 py-8 lg:px-10 lg:py-10">
          <div className="flex items-start justify-between gap-7"><div><p className="font-mono text-[11px] tracking-[.18em] text-[#4f8c85]">{active.year} · {active.event}</p><h3 className="mt-3 font-serif text-4xl font-black tracking-[-0.055em] md:text-5xl">{active.note}</h3></div><span className="chain-mark" aria-hidden="true"><i /><b /></span></div>
          <div className="mt-10 grid border-y border-[#28302e]/12 md:grid-cols-3 md:divide-x md:divide-y-0 divide-y divide-[#28302e]/12">
            {active.stages.map((stage, index) => <section key={stage.label} className="chain-stage px-0 py-7 md:px-7 md:py-8"><p className="font-mono text-[10px] tracking-[.18em] text-[#4f8c85]">0{index + 1} · {stage.label}</p><h4 className="mt-4 font-serif text-2xl font-bold tracking-[-.04em]">{stage.title}</h4><p className="mt-4 text-sm leading-7 text-[#71817d]">{stage.description}</p><div className="mt-6 flex flex-wrap gap-x-3 gap-y-2">{stage.nodeIds.map((id) => { const node = EVENT_NAMES[id]; return node ? <button key={id} type="button" onClick={() => openTimelineEvent(id)} className="chain-node-link"><span>{node.year}</span>{node.title}<ChevronRight size={12} /></button> : null; })}</div></section>)}
          </div>
          {people.length > 0 && <div className="mt-7 border-t border-[#28302e]/12 pt-6"><p className="eyebrow">相关人物入口</p><div className="mt-4 flex flex-wrap gap-2">{people.map((person) => <a key={person.id} href={`/event/${person.eventId}?person=${person.id}`} className="chain-person-link"><span>{person.name}</span><small>{person.role}</small><ArrowUpRight size={12} /></a>)}</div><p className="mt-3 text-[11px] leading-5 text-[#71817d]">跳转后会直接打开该人物的小传弹窗，并保留可回看的相关事件索引。</p></div>}
          <a href={active.sourceUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 border-b border-[#78a9a1] pb-1 text-xs text-[#397b74] hover:gap-3">关联资料：{active.sourceLabel}<ArrowUpRight size={13} /></a>
        </article>
      </div>
    </section>
  );
}
