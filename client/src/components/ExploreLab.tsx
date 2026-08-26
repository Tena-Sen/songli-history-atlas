/**
 * 设计提醒｜卷轴地志：个人阅读路径与关系图谱应保持册页索引感，
 * 用留白、细线与天青节点组织探索，而非通用仪表板卡片。
 */
import { useEffect, useMemo, useState } from "react";
import { Bookmark, BookmarkPlus, Check, ChevronDown, ChevronUp, Download, Network, Share2, Shuffle, Trash2, X } from "lucide-react";
import { addPosterPreset, DEFAULT_POSTER_PRESETS, makePosterPreset, parsePosterPresets, pickRandomPosterPreset, posterFieldsFromPreset, POSTER_PRESET_STORAGE_KEY, removePosterPreset, type PosterPreset, type PosterThemeName } from "@/lib/posterPresets";
import { relationshipPositions } from "@/lib/relationshipGraph";

export type ExploreEvent = {
  id: string;
  year: string;
  title: string;
  category: string;
  tag: string;
  tone: "celadon" | "seal" | "ink";
};

const STORAGE_KEY = "songli-reading-path-v1";

const POSTER_THEMES = {
  celadon: { label: "天青 · 宣纸", paper: "#f5f0e3", ink: "#26322f", body: "#53615d", accent: "#78a9a1", seal: "#b86a5a", wash: "rgba(118, 161, 153, .30)" },
  moon: { label: "月白 · 深墨", paper: "#142124", ink: "#ebe5d8", body: "#b8c2ba", accent: "#9fc6bf", seal: "#c98373", wash: "rgba(109, 162, 156, .36)" },
  silk: { label: "赭石 · 绢本", paper: "#f0e2c7", ink: "#3e3029", body: "#756050", accent: "#9f8066", seal: "#a66457", wash: "rgba(176, 137, 92, .28)" },
} as const;

type PosterTheme = PosterThemeName;

const RELATION_EDGES = [
  ["northern-song", "chanyuan", "边境秩序"], ["northern-song", "champa-rice", "农政阅读"],
  ["champa-rice", "qingli-war", "供给与边防"], ["qingli-war", "qingli-reforms", "边防与政务"],
  ["qingli-reforms", "wujing-zongyao", "军政与知识"], ["movable-type", "new-policies", "知识与制度"],
  ["new-policies", "iron-production", "制度与生产"], ["new-policies", "huizong-art", "北宋晚期"],
  ["huizong-art", "jin-rise", "北方格局"], ["jin-rise", "jingkang", "危局阅读"],
  ["jingkang", "linan", "政治南移"], ["linan", "linan-societies", "都城生活"],
  ["linan", "southern-sea-routes", "水路与海贸"], ["southern-sea-routes", "zhu-fan-zhi", "港口记录"],
  ["zhu-fan-zhi", "song-shipwreck", "海洋史料"], ["linan-societies", "linan-fall", "都城命运"],
  ["linan-fall", "end-of-song", "宋末行动"],
] as const;

function yearNumber(year: string) {
  if (year.includes("11世纪")) return 1040;
  const first = year.match(/\d{3,4}/)?.[0];
  return first ? Number(first) : 960;
}

export function ExploreLab({ events }: { events: ExploreEvent[] }) {
  const [saved, setSaved] = useState<string[]>([]);
  const [activeNode, setActiveNode] = useState<string>("linan");
  const [shared, setShared] = useState(false);
  const [posterTitle, setPosterTitle] = useState("我的阅读路径");
  const [posterSubtitle, setPosterSubtitle] = useState("北宋至南宋 · 微观时间轴");
  const [posterTheme, setPosterTheme] = useState<PosterTheme>("celadon");
  const [presetName, setPresetName] = useState("");
  const [presets, setPresets] = useState<PosterPreset[]>([]);
  const [presetNotice, setPresetNotice] = useState("");

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(STORAGE_KEY);
      if (stored) setSaved(JSON.parse(stored));
    } catch {
      setSaved([]);
    }
  }, []);

  useEffect(() => {
    setPresets(parsePosterPresets(window.localStorage.getItem(POSTER_PRESET_STORAGE_KEY)));
  }, []);

  const save = (next: string[]) => {
    setSaved(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  };

  const toggle = (id: string) => {
    save(saved.includes(id) ? saved.filter((item) => item !== id) : [...saved, id]);
  };

  const savePresets = (next: PosterPreset[]) => {
    setPresets(next);
    window.localStorage.setItem(POSTER_PRESET_STORAGE_KEY, JSON.stringify(next));
  };

  const saveCurrentPreset = () => {
    const nextPreset = makePosterPreset({ name: presetName, title: posterTitle, subtitle: posterSubtitle, theme: posterTheme });
    savePresets(addPosterPreset(presets, nextPreset));
    setPresetName("");
    setPresetNotice(`已保存「${nextPreset.name}」`);
  };

  const applyPreset = (preset: PosterPreset) => {
    const fields = posterFieldsFromPreset(preset);
    setPosterTitle(fields.title);
    setPosterSubtitle(fields.subtitle);
    setPosterTheme(fields.theme);
    setPresetNotice(`已应用「${preset.name}」`);
  };

  const removePreset = (id: string, name: string) => {
    savePresets(removePosterPreset(presets, id));
    setPresetNotice(`已移除「${name}」`);
  };

  const randomizePreset = () => {
    const randomPreset = pickRandomPosterPreset([...DEFAULT_POSTER_PRESETS, ...presets]);
    if (!randomPreset) {
      setPresetNotice("暂无可用的宋韵方案");
      return;
    }
    const fields = posterFieldsFromPreset(randomPreset);
    setPosterTitle(fields.title);
    setPosterSubtitle(fields.subtitle);
    setPosterTheme(fields.theme);
    setPresetNotice(`随机展开「${randomPreset.name}」`);
  };

  const move = (id: string, direction: -1 | 1) => {
    const index = saved.indexOf(id);
    const target = index + direction;
    if (index < 0 || target < 0 || target >= saved.length) return;
    const next = [...saved];
    [next[index], next[target]] = [next[target], next[index]];
    save(next);
  };

  const savedEvents = useMemo(
    () => saved.map((id) => events.find((event) => event.id === id)).filter((event): event is ExploreEvent => Boolean(event)),
    [events, saved]
  );

  const active = events.find((event) => event.id === activeNode) ?? events[0];
  const relationPositions = useMemo(() => relationshipPositions(events), [events]);
  const positionById = useMemo(() => new Map(relationPositions.map((position) => [position.id, position])), [relationPositions]);
  const linkedIds = new Set<string>(
    RELATION_EDGES.filter(([from, to]) => from === activeNode || to === activeNode).flatMap(([from, to]) => [from, to])
  );

  const makePoster = () => {
    const canvas = document.createElement("canvas");
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const theme = POSTER_THEMES[posterTheme];
    ctx.fillStyle = theme.paper;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < 150; i += 1) {
      const x = (i * 83) % canvas.width; const y = (i * 149) % canvas.height;
      ctx.fillStyle = `rgba(67, 83, 76, ${0.018 + (i % 4) * 0.006})`;
      ctx.fillRect(x, y, 1.2, 1.2);
    }
    const wash = ctx.createRadialGradient(845, 255, 30, 825, 280, 470);
    wash.addColorStop(0, theme.wash); wash.addColorStop(1, "rgba(118, 161, 153, 0)");
    ctx.fillStyle = wash; ctx.fillRect(0, 0, canvas.width, canvas.height);
    const inkMountain = (baseY: number, opacity: number, shift: number) => {
      ctx.beginPath(); ctx.moveTo(0, baseY); ctx.lineTo(0, baseY - 70);
      for (let x = 0; x <= canvas.width; x += 120) { const peak = baseY - 80 - ((x / 120 + shift) % 3) * 55; ctx.quadraticCurveTo(x + 48, peak, x + 120, baseY - 55 + ((x / 120 + shift) % 2) * 30); }
      ctx.lineTo(canvas.width, baseY); ctx.closePath(); ctx.fillStyle = posterTheme === "moon" ? `rgba(218, 231, 220, ${opacity})` : `rgba(47, 70, 68, ${opacity})`; ctx.fill();
    };
    inkMountain(1170, 0.11, 0); inkMountain(1230, 0.07, 1);
    ctx.strokeStyle = posterTheme === "moon" ? "rgba(235,229,216,.26)" : "rgba(40,48,46,.18)"; ctx.lineWidth = 2; ctx.strokeRect(48, 48, canvas.width - 96, canvas.height - 96);
    ctx.strokeStyle = theme.accent; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(96, 154); ctx.lineTo(334, 154); ctx.stroke();
    ctx.fillStyle = theme.accent; ctx.font = "500 25px 'IBM Plex Mono', monospace"; ctx.fillText("SONGLI / READING PATH", 96, 122);
    ctx.save(); ctx.scale(0.82, 1.16); ctx.fillStyle = theme.ink; ctx.font = "500 88px 'Noto Serif SC', serif"; ctx.fillText(posterTitle.slice(0, 12) || "我的阅读路径", 118, 250); ctx.restore();
    ctx.font = "400 28px 'Noto Sans SC', sans-serif"; ctx.fillStyle = theme.body; ctx.fillText(posterSubtitle.slice(0, 28) || "北宋至南宋 · 微观时间轴", 96, 332);
    ctx.strokeStyle = theme.accent; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(170, 435); ctx.lineTo(170, 1095); ctx.stroke();
    savedEvents.slice(0, 7).forEach((event, index) => {
      const y = 486 + index * 88;
      ctx.fillStyle = event.tone === "seal" ? theme.seal : theme.accent; ctx.beginPath(); ctx.arc(170, y - 8, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = theme.accent; ctx.font = "500 20px 'IBM Plex Mono', monospace"; ctx.fillText(event.year, 222, y - 15);
      ctx.save(); ctx.scale(0.9, 1.06); ctx.fillStyle = theme.ink; ctx.font = "500 39px 'Noto Serif SC', serif"; ctx.fillText(event.title, 246, y + 28); ctx.restore();
    });
    if (savedEvents.length === 0) {
      ctx.fillStyle = theme.body; ctx.font = "400 32px 'Noto Sans SC', sans-serif"; ctx.fillText("尚未收藏节点。回到时间轴，从一页开始。", 220, 510);
    }
    ctx.save(); ctx.translate(910, 985); ctx.rotate(-0.1); ctx.strokeStyle = theme.seal; ctx.lineWidth = 3; ctx.strokeRect(-38, -38, 76, 76); ctx.font = "500 22px 'Noto Serif SC', serif"; ctx.fillStyle = theme.seal; ctx.fillText("阅记", -22, 8); ctx.restore();
    ctx.fillStyle = theme.body; ctx.font = "400 22px 'Noto Sans SC', sans-serif"; ctx.fillText("宋历 · 以一条天青线重读两宋", 96, 1212);
    ctx.fillStyle = theme.accent; ctx.fillRect(96, 1242, 210, 2);
    const anchor = document.createElement("a");
    anchor.download = "songli-my-reading-path.png";
    anchor.href = canvas.toDataURL("image/png");
    anchor.click();
    setShared(true);
    window.setTimeout(() => setShared(false), 2200);
  };

  return (
    <section id="reading-path" className="border-y border-[#28302e]/10 bg-[#edf0e8] night:bg-[#101b1e]">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 lg:px-20 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[.75fr_1.25fr] lg:items-end">
          <div><p className="eyebrow">探索工作台</p><h2 className="mt-3 max-w-md font-serif text-4xl font-black tracking-[-0.055em] md:text-5xl">把历史读成自己的路径。</h2></div>
          <p className="max-w-[650px] justify-self-end text-base leading-8 text-[#53615d] night:text-[#b4b9b2]">收藏并排序感兴趣的节点，生成一张可分享的阅读海报；在关系图谱中切换焦点，观察制度、技术、外交与城市如何相互牵引。</p>
        </div>

        <div className="mt-12 grid border-y border-[#28302e]/15 lg:grid-cols-[.9fr_1.1fr]">
          <div className="border-b border-[#28302e]/15 px-0 py-8 lg:border-b-0 lg:border-r lg:px-9 lg:py-10">
            <div className="flex items-center justify-between"><div className="flex items-center gap-3"><Bookmark size={19} className="text-[#4f8c85]" strokeWidth={1.4} /><p className="eyebrow">我的阅读路径</p></div><span className="font-mono text-[10px] tracking-[0.14em] text-[#71817d]">{savedEvents.length.toString().padStart(2, "0")} SAVED</span></div>
            <div className="mt-7 divide-y divide-[#28302e]/12 border-y border-[#28302e]/12">
              {savedEvents.length ? savedEvents.map((event, index) => <div key={event.id} className="flex items-center justify-between gap-4 py-4"><div><p className="font-mono text-[10px] tracking-[0.16em] text-[#4f8c85]">{event.year}</p><p className="mt-1 font-serif text-xl font-bold">{event.title}</p></div><div className="flex items-center gap-1"><button type="button" disabled={index === 0} onClick={() => move(event.id, -1)} className="path-order-button" aria-label={`上移${event.title}`}><ChevronUp size={14} /></button><button type="button" disabled={index === savedEvents.length - 1} onClick={() => move(event.id, 1)} className="path-order-button" aria-label={`下移${event.title}`}><ChevronDown size={14} /></button><button type="button" onClick={() => toggle(event.id)} className="grid h-8 w-8 place-items-center text-[#71817d] transition hover:text-[#a66457]" aria-label={`移除${event.title}`}><X size={16} /></button></div></div>) : <p className="py-7 text-sm leading-7 text-[#71817d]">尚未收藏节点。在右侧索引中点选书签，即可形成个人的阅读线索。</p>}
            </div>
            <div className="mt-7 border-y border-[#28302e]/12 py-5">
              <p className="eyebrow">海报题签</p>
              <label className="poster-field mt-4"><span>标题</span><input value={posterTitle} maxLength={12} onChange={(event) => setPosterTitle(event.target.value)} aria-label="海报标题" /></label>
              <label className="poster-field mt-3"><span>副标题</span><input value={posterSubtitle} maxLength={28} onChange={(event) => setPosterSubtitle(event.target.value)} aria-label="海报副标题" /></label>
              <div className="mt-4"><span className="poster-field-label">宋韵配色</span><div className="mt-3 flex flex-wrap gap-2">{(Object.keys(POSTER_THEMES) as PosterTheme[]).map((key) => <button key={key} type="button" onClick={() => setPosterTheme(key)} className={`poster-theme ${posterTheme === key ? "poster-theme-active" : ""}`} aria-pressed={posterTheme === key}><i style={{ background: POSTER_THEMES[key].accent }} /><span>{POSTER_THEMES[key].label}</span></button>)}</div></div>
            </div>
            <div className="poster-preset-panel mt-6">
              <div className="flex items-center justify-between gap-4"><p className="eyebrow">我的宋韵预设</p><span className="font-mono text-[10px] tracking-[0.14em] text-[#71817d]">{presets.length.toString().padStart(2, "0")} / 08</span></div>
              <div className="mt-4 flex items-center justify-between gap-4 border-y border-[#28302e]/10 py-3"><p className="text-xs leading-6 text-[#71817d]">从内置与收藏方案中随机抽取一页。</p><button type="button" onClick={randomizePreset} className="random-preset-button" aria-label="随机应用一套宋韵海报方案"><Shuffle size={14} /> 随机宋韵</button></div>
              <div className="mt-4"><span className="poster-field-label">内置方案</span><div className="mt-3 flex flex-wrap gap-2">{DEFAULT_POSTER_PRESETS.map((preset) => <button key={preset.id} type="button" onClick={() => applyPreset(preset)} className="default-preset" aria-label={`应用默认方案${preset.name}`}><i style={{ background: POSTER_THEMES[preset.theme].accent }} />{preset.name}</button>)}</div></div>
              <div className="mt-4 flex gap-2"><input value={presetName} maxLength={18} onChange={(event) => setPresetName(event.target.value)} aria-label="预设名称" placeholder="为此方案命名" className="preset-name-input" /><button type="button" onClick={saveCurrentPreset} className="preset-save-button"><BookmarkPlus size={14} /> 保存</button></div>
              {presets.length ? <div className="mt-4 divide-y divide-[#28302e]/10 border-y border-[#28302e]/10">{presets.map((preset) => <div key={preset.id} className="flex items-center gap-2 py-3"><button type="button" onClick={() => applyPreset(preset)} className="preset-apply min-w-0 flex-1 text-left"><i style={{ background: POSTER_THEMES[preset.theme].accent }} /><span className="min-w-0"><strong>{preset.name}</strong><em>{POSTER_THEMES[preset.theme].label} · {preset.title}</em></span></button><button type="button" onClick={() => removePreset(preset.id, preset.name)} className="preset-delete" aria-label={`删除预设${preset.name}`}><Trash2 size={14} /></button></div>)}</div> : <p className="mt-4 text-xs leading-6 text-[#71817d]">保存常用的题签与配色，下一次可一键应用。</p>}
              <p className="sr-only" aria-live="polite">{presetNotice}</p>
            </div>
            <button type="button" onClick={makePoster} className="mt-7 inline-flex items-center gap-2 bg-[#28302e] px-4 py-3 text-sm text-[#f6f2e8] transition hover:bg-[#4f8c85] night:bg-[#78a9a1] night:text-[#0e161a]"><Share2 size={16} /> 生成分享海报 <Download size={14} /></button>
            {shared && <p className="mt-3 inline-flex items-center gap-2 text-xs text-[#4f8c85]"><Check size={14} /> 海报已下载，可直接分享。</p>}
          </div>

          <div className="px-0 py-8 lg:px-9 lg:py-10">
            <div className="flex items-center gap-3"><Network size={19} className="text-[#4f8c85]" strokeWidth={1.4} /><p className="eyebrow">节点关系图谱</p></div>
            <p className="mt-3 text-xs leading-6 text-[#71817d]">横向读年代，纵向读主题。全部节点各占一处；仅当前焦点的关联线显示文字注记，避免把史料索引糊成一团。</p>
            <div className="relation-board mt-7" role="group" aria-label="历史节点关联图谱">
              <div className="relation-axis relation-axis-x" aria-hidden="true"><span>960</span><span>北宋中期</span><span>1127</span><span>南宋</span><span>1279</span></div>
              <div className="relation-axis relation-axis-y" aria-hidden="true"><span>政治</span><span>军事</span><span>制度</span><span>经济</span><span>城市</span><span>知识</span><span>思想</span></div>
              <svg viewBox="0 0 720 420" className="absolute inset-0 h-full w-full" aria-hidden="true">
                {RELATION_EDGES.map(([from, to, label]) => {
                  const a = positionById.get(from);
                  const b = positionById.get(to);
                  if (!a || !b) return null;
                  const [x1, y1] = [a.x, a.y]; const [x2, y2] = [b.x, b.y];
                  const strong = from === activeNode || to === activeNode;
                  return <g key={`${from}-${to}`}><line x1={`${x1}%`} y1={`${y1}%`} x2={`${x2}%`} y2={`${y2}%`} className={strong ? "relation-line relation-line-active" : "relation-line"} />{strong && <text x={`${(x1+x2)/2}%`} y={`${(y1+y2)/2}%`} className="relation-label relation-label-active">{label}</text>}</g>;
                })}
              </svg>
              {events.map((event) => {
                const position = positionById.get(event.id);
                if (!position) return null;
                const focused = event.id === activeNode; const related = linkedIds.has(event.id);
                return <button key={event.id} type="button" onClick={() => setActiveNode(event.id)} style={{ left: `${position.x}%`, top: `${position.y}%` }} className={`relation-node ${focused ? "relation-node-active" : related ? "relation-node-related" : ""}`} aria-pressed={focused} title={`${event.year} · ${event.title}`}><span>{event.year.match(/\d{3,4}/)?.[0] ?? "11C"}</span><em>{event.title}</em></button>;
              })}
            </div>
            <div className="mt-6 border-t border-[#28302e]/12 pt-5"><p className="font-mono text-[10px] tracking-[0.16em] text-[#4f8c85]">当前焦点 · {active?.year}</p><p className="mt-2 font-serif text-2xl font-bold">{active?.title}</p><p className="mt-2 text-sm leading-7 text-[#71817d]">高亮连线显示与此节点直接相关的历史议题。图谱用于梳理叙事关系，不以线条表达因果强度或历史重要性。</p></div>
          </div>
        </div>

        <div className="mt-10 grid gap-x-8 gap-y-5 border-y border-[#28302e]/15 py-7 md:grid-cols-2 lg:grid-cols-4">
          {events.map((event) => <button type="button" key={event.id} onClick={() => toggle(event.id)} className={`reading-index ${saved.includes(event.id) ? "reading-index-active" : ""}`}><span>{saved.includes(event.id) ? <Check size={13} /> : <Bookmark size={13} />}</span><span className="font-mono text-[10px] text-[#4f8c85]">{event.year}</span><strong>{event.title}</strong></button>)}
        </div>
      </div>
    </section>
  );
}
