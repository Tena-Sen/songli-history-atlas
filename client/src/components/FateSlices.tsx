/**
 * 设计提醒｜卷轴地志：以人物为折页，而非人物卡片；
 * 每一张命运切片都要回到时间脊柱与可追溯来源。
 */
import { useState } from "react";
import { ArrowUpRight, Crown, ScrollText } from "lucide-react";
import { Link } from "wouter";
import { getNarrativeSlice, NARRATIVE_SLICES } from "@/lib/narrativeSlices";

type EventLink = { id: string; year: string; title: string };

const EVENT_LINKS: Record<string, EventLink> = {
  chanyuan: { id: "chanyuan", year: "1005", title: "澶渊之盟" },
  "new-policies": { id: "new-policies", year: "1069—1072", title: "王安石新法" },
  jingkang: { id: "jingkang", year: "1127", title: "靖康之变" },
  linan: { id: "linan", year: "1138", title: "临安为行在" },
  "linan-fall": { id: "linan-fall", year: "1276", title: "临安失守" },
  "end-of-song": { id: "end-of-song", year: "1279", title: "宋朝终结" },
};

export function FateSlices() {
  const [activeId, setActiveId] = useState("huizong");
  const active = getNarrativeSlice(activeId);
  const Icon = active.type === "皇帝" ? Crown : ScrollText;

  return (
    <section id="fate-slices" className="border-y border-[#28302e]/10 bg-[#e9e6db] night:bg-[#121d20]">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 lg:px-20 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[.74fr_1.26fr] lg:items-end">
          <div>
            <p className="eyebrow">命运切片</p>
            <h2 className="mt-3 max-w-lg font-serif text-4xl font-black tracking-[-0.055em] md:text-5xl">名臣与皇帝，也被时代切开。</h2>
          </div>
          <p className="max-w-[660px] justify-self-end text-base leading-8 text-[#53615d] night:text-[#b4b9b2]">以人物切入，但不把人物等同于历史原因。每一张切片都将个人处境放回制度、边境、都城与政权转折的时间链条中阅读。</p>
        </div>

        <div className="mt-12 grid border-y border-[#28302e]/15 lg:grid-cols-[.68fr_1.32fr]">
          <div className="border-b border-[#28302e]/15 py-7 lg:border-b-0 lg:border-r lg:px-8 lg:py-9">
            <p className="font-mono text-[10px] tracking-[0.18em] text-[#4f8c85]">人物索引</p>
            <div className="mt-6 divide-y divide-[#28302e]/12 border-y border-[#28302e]/12">
              {NARRATIVE_SLICES.map((slice, index) => (
                <button key={slice.id} type="button" onClick={() => setActiveId(slice.id)} className={`fate-index-row ${activeId === slice.id ? "fate-index-row-active" : ""}`} aria-pressed={activeId === slice.id}>
                  <span className="font-mono text-[10px] text-[#78a9a1]">0{index + 1}</span><span><em>{slice.type}</em><strong>{slice.person}</strong><small>{slice.era}</small></span>
                </button>
              ))}
            </div>
            <p className="mt-5 text-[11px] leading-5 text-[#71817d]">人物切片的组织方式参考《李亚平说宋朝》的“人物切入”叙事节奏；事实与来源仍按本站史料规则标注。</p>
          </div>

          <article className="fate-leaf px-0 py-8 lg:px-10 lg:py-10">
            <div className="flex items-start justify-between gap-6"><div><div className="flex items-center gap-3"><Icon size={20} className="text-[#4f8c85]" strokeWidth={1.4} /><p className="eyebrow">{active.type} · {active.era}</p></div><h3 className="mt-7 font-serif text-4xl font-black tracking-[-0.055em] md:text-5xl">{active.title}</h3></div><span className="fate-slice-seal">宋历<br />切片</span></div>
            <p className="mt-7 max-w-3xl text-[17px] leading-9 text-[#53615d] night:text-[#b4b9b2]">{active.summary}</p>
            <div className="mt-8 grid gap-7 border-y border-[#28302e]/12 py-7 md:grid-cols-[.72fr_1.28fr]">
              <div><p className="eyebrow">叙事提示</p><p className="mt-3 text-sm leading-7 text-[#71817d]">{active.narrativeHint}</p></div>
              <div><p className="eyebrow">时间锚点</p><div className="mt-4 flex flex-wrap gap-x-5 gap-y-3">{active.nodeIds.map((id) => { const node = EVENT_LINKS[id]; return node ? <Link key={node.id} href={`/event/${node.id}`} className="fate-node-link"><span>{node.year}</span>{node.title}<ArrowUpRight size={13} /></Link> : null; })}</div></div>
            </div>
            <a href={active.sourceUrl} target="_blank" rel="noreferrer" className="mt-7 inline-flex items-center gap-2 border-b border-[#78a9a1] pb-1 text-xs text-[#397b74] hover:gap-3">阅读关联来源：{active.sourceLabel}<ArrowUpRight size={13} /></a>
          </article>
        </div>
      </div>
    </section>
  );
}
