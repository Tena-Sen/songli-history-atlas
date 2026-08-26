/**
 * 设计提醒｜卷轴地志：空间图只提供州县、运河与港口的阅读锚点，
 * 不复原古代疆界、精确坐标或航行路线。
 */
import { useEffect, useMemo, useState } from "react";
import { Anchor, Landmark, MapPinned, Navigation, ShipWheel } from "lucide-react";
import { GEO_LAYERS, GEO_OVERLAY_POINTS, reconcileGeoSelection, type GeoLayerId, type GeoOverlayPoint, visibleGeoPointsAtYear } from "@/lib/spatialExplorer";

const EVENT_LABELS: Record<string, string> = {
  "northern-song": "建宋", chanyuan: "澶渊", "champa-rice": "占城稻", "qingli-war": "庆历战争", "qingli-reforms": "庆历改革", "wujing-zongyao": "《武经总要》", "movable-type": "活字", "new-policies": "熙宁新法", "iron-production": "铁业", "huizong-art": "徽宗画院", "jin-rise": "金朝建立", jingkang: "靖康", "zhu-xi": "朱熹", linan: "临安行在", "southern-sea-routes": "南方海路", "zhu-fan-zhi": "《诸蕃志》", "jin-end": "金朝终结", "linan-societies": "西湖社团", "linan-fall": "临安失守", "song-shipwreck": "宋末沉船", "end-of-song": "崖山之后",
};

function openTimelineEvent(id: string) {
  window.dispatchEvent(new CustomEvent("songli:select-event", { detail: id }));
  window.setTimeout(() => (document.getElementById("parallel-scroll") ?? document.getElementById("time-spine"))?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
}

function kindIcon(kind: GeoOverlayPoint["kind"]) {
  return kind === "港口" ? ShipWheel : kind === "运河" ? Navigation : Landmark;
}

export function GeographyMap() {
  const [activeLayers, setActiveLayers] = useState<GeoLayerId[]>(["administrative", "waterways", "ports"]);
  const [selected, setSelected] = useState<GeoOverlayPoint>(GEO_OVERLAY_POINTS.find((point) => point.id === "linan-prefecture") ?? GEO_OVERLAY_POINTS[0]);
  const [focusYear, setFocusYear] = useState<number>();
  const [autoPeriod, setAutoPeriod] = useState(true);
  const visible = useMemo(() => visibleGeoPointsAtYear(activeLayers, autoPeriod ? focusYear : undefined), [activeLayers, autoPeriod, focusYear]);
  const showWaterways = activeLayers.includes("waterways") && visible.some((point) => point.layerIds.includes("waterways"));
  const showPorts = activeLayers.includes("ports") && visible.some((point) => point.layerIds.includes("ports"));
  const KindIcon = kindIcon(selected.kind);

  useEffect(() => {
    const next = reconcileGeoSelection(selected.id, visible);
    if (next && next.id !== selected.id) setSelected(next);
  }, [selected.id, visible]);

  useEffect(() => {
    const receivePlace = (event: Event) => {
      const point = GEO_OVERLAY_POINTS.find((item) => item.id === (event as CustomEvent<string>).detail);
      if (!point) return;
      setSelected(point);
      window.setTimeout(() => document.getElementById("map-layer")?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
    };
    window.addEventListener("songli:select-place", receivePlace);
    return () => window.removeEventListener("songli:select-place", receivePlace);
  }, []);

  useEffect(() => {
    const receiveTime = (event: Event) => setFocusYear((event as CustomEvent<{ year?: number }>).detail?.year);
    window.addEventListener("songli:time-focus", receiveTime);
    return () => window.removeEventListener("songli:time-focus", receiveTime);
  }, []);

  const toggleLayer = (layerId: GeoLayerId) => {
    setActiveLayers((current) => {
      const next = current.includes(layerId) ? current.filter((id) => id !== layerId) : [...current, layerId];
      return next.length > 0 ? next : current;
    });
  };

  return (
    <section id="map-layer" className="border-y border-[#28302e]/10 bg-[#e7e3d8] night:bg-[#121d20]">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 lg:px-20 lg:py-28">
        <div className="grid gap-9 lg:grid-cols-[.74fr_1.26fr] lg:items-end">
          <div><p className="eyebrow">地理叠层</p><h2 className="mt-3 max-w-md font-serif text-4xl font-black tracking-[-0.055em] md:text-5xl">州县、运河与港口，叠在一卷地志上。</h2></div>
          <p className="max-w-[650px] justify-self-end text-base leading-8 text-[#53615d] night:text-[#b4b9b2]">切换州县、运河水路与港口海贸三层，查看同一空间如何服务于不同问题。点位是已核验的阅读锚点；它们不复原宋代疆界、府县范围、河道里程或航行路线。</p>
        </div>

        <div className="mt-10 flex flex-wrap gap-2 border-y border-[#28302e]/12 py-4" role="group" aria-label="选择地理叠层">
          {GEO_LAYERS.map((layer) => <button key={layer.id} type="button" onClick={() => toggleLayer(layer.id)} aria-pressed={activeLayers.includes(layer.id)} className={`map-filter ${activeLayers.includes(layer.id) ? "map-filter-active" : ""}`}><span>{layer.label}</span><small>{layer.note}</small></button>)}
          <button type="button" onClick={() => setAutoPeriod((value) => !value)} aria-pressed={autoPeriod} className={`map-filter ${autoPeriod ? "map-filter-active" : ""}`}><span>随时间轴显隐</span><small>{autoPeriod && focusYear ? `${focusYear} 年` : "显示全部时段"}</small></button>
        </div>

        <div className="mt-8 grid border-y border-[#28302e]/15 lg:grid-cols-[1fr_320px]">
          <div className="relative min-h-[540px] overflow-hidden border-b border-[#28302e]/15 lg:border-b-0 lg:border-r">
            <svg viewBox="0 0 900 540" aria-hidden="true" className="absolute inset-0 h-full w-full">
              <path d="M64 73 C187 10, 314 76, 392 146 C457 203, 439 269, 538 314 C650 365, 794 381, 892 500" className="map-ink-ridge" />
              <path d="M38 93 C181 97, 289 126, 430 202 C569 278, 730 284, 888 351" className="map-ink-ridge map-ink-ridge-soft" />
              {showWaterways && <><path d="M308 20 C340 98, 390 143, 465 193 C512 225, 560 255, 604 325 C640 382, 697 423, 890 505" className="map-river" /><path d="M497 259 C573 287, 657 305, 761 330 C807 344, 851 373, 896 421" className="map-river map-river-secondary" /><path d="M747 344 C711 403, 682 443, 642 521" className="map-river map-river-secondary" /></>}
              {showPorts && <><path d="M622 304 C676 310, 727 321, 750 328" className="map-route" /><path d="M752 332 C731 395, 690 452, 646 500" className="map-route" /></>}
              <text x="86" y="97" className="map-marginalia">北方</text><text x="727" y="478" className="map-marginalia">东南海域</text><text x="462" y="376" className="map-marginalia">江南水网</text>
            </svg>

            <div className="absolute left-5 top-5 bg-[#f6f2e8]/90 px-3 py-2 text-[11px] leading-5 text-[#53615d] backdrop-blur-sm night:bg-[#0e161a]/85 night:text-[#b4b9b2]"><p className="font-mono tracking-[.14em] text-[#4f8c85]">空间图例</p><p className="mt-1">府州县锚点 · 水路关联 · 港口海贸</p>{autoPeriod && <p className="mt-1 text-[#397b74]">随主轴年份显示：{focusYear ?? "等待定位"}</p>}</div>
            {visible.map((place) => <button key={place.id} type="button" onClick={() => setSelected(place)} className={`archive-map-node archive-map-node-${place.kind} ${selected.id === place.id ? "archive-map-node-active" : ""}`} style={{ left: `${place.x}%`, top: `${place.y}%` }} aria-label={`查看${place.ancientName}${place.name}说明`}><span>{place.kind === "州县" ? "州" : place.kind === "港口" ? "港" : "水"}</span><em>{place.ancientName}</em></button>)}
            <div className="absolute bottom-5 left-5 flex items-center gap-2 bg-[#f6f2e8]/90 px-3 py-2 text-[11px] text-[#53615d] backdrop-blur-sm night:bg-[#0e161a]/85 night:text-[#b4b9b2]"><Anchor size={14} className="text-[#4f8c85]" />天青线＝阅读关联，非路线或边界复原</div>
          </div>

          <aside className="px-0 py-7 lg:px-7 lg:py-9">
            <div className="flex items-center justify-between border-b border-[#28302e]/12 pb-5"><p className="font-mono text-[10px] tracking-[0.18em] text-[#4f8c85]">地点注释</p><KindIcon size={18} className="text-[#4f8c85]" strokeWidth={1.4} /></div>
            <p className="mt-7 font-mono text-[10px] tracking-[0.16em] text-[#71817d]">{selected.period}</p><h3 className="mt-2 font-serif text-4xl font-bold tracking-[-0.05em]">{selected.ancientName}</h3><p className="mt-1 text-sm text-[#4f8c85]">今 {selected.name} · {selected.kind}</p><p className="mt-6 text-sm leading-7 text-[#53615d] night:text-[#b4b9b2]">{selected.description}</p>
            <div className="mt-7"><p className="eyebrow">关联节点</p><div className="mt-3 flex flex-wrap gap-2">{selected.eventIds.map((eventId) => <button key={eventId} type="button" onClick={() => openTimelineEvent(eventId)} className="atlas-event-link">{EVENT_LABELS[eventId] ?? eventId}<span>↗</span></button>)}</div></div>
            <div className="mt-8 border-t border-[#28302e]/12 pt-5 text-xs leading-6 text-[#71817d]">资料线索：Harvard China Historical GIS 的行政层级说明；哥伦比亚大学宋代城市与对外贸易专题。本站以少量锚点辅助阅读，不作精确历史地图复原。</div>
          </aside>
        </div>
      </div>
    </section>
  );
}
