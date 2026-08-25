/**
 * 设计提醒｜卷轴地志：以站内地志示意层表现水路、港口与都城关系。
 * 该图不复原古代疆界与精确航线，路线仅作为可筛选的历史阅读引导。
 */
import { useMemo, useState } from "react";
import { Anchor, MapPinned, Navigation, ShipWheel } from "lucide-react";

type MapKind = "都城" | "港口" | "水路";
type MapFilter = "全部" | MapKind;

type GeoPoint = {
  id: string;
  name: string;
  ancientName: string;
  x: number;
  y: number;
  kind: MapKind;
  period: string;
  description: string;
};

const PLACES: GeoPoint[] = [
  { id: "dongjing", name: "开封", ancientName: "东京", x: 33, y: 15, kind: "都城", period: "960—1127", description: "北宋政治中心。东京的城市生活后来由《东京梦华录》等文本留下浓厚记忆。" },
  { id: "linan", name: "杭州", ancientName: "临安", x: 67, y: 55, kind: "都城", period: "1138—1276", description: "南宋行在与实际国都。运河、水路和商市共同组织其城市生活。" },
  { id: "mingzhou", name: "宁波", ancientName: "明州", x: 83, y: 60, kind: "港口", period: "南宋时期", description: "临安东侧的重要港口，浙东运河与沿海贸易共同提升其枢纽位置。" },
  { id: "quanzhou", name: "泉州", ancientName: "刺桐港", x: 64, y: 84, kind: "港口", period: "两宋时期", description: "东南沿海的重要国际贸易港口，是观察宋代海贸网络的关键节点。" },
  { id: "grand-canal", name: "江淮中段", ancientName: "运河节点", x: 52, y: 35, kind: "水路", period: "两宋时期", description: "以江淮中段示意南北水路联系，用于辅助理解都城、腹地与江南之间的交通关系。" },
];

const filters: MapFilter[] = ["全部", "都城", "港口", "水路"];

export function GeographyMap() {
  const [filter, setFilter] = useState<MapFilter>("全部");
  const [selected, setSelected] = useState<GeoPoint>(PLACES[1]);
  const visible = useMemo(() => PLACES.filter((place) => filter === "全部" || place.kind === filter), [filter]);
  const KindIcon = selected.kind === "港口" ? ShipWheel : selected.kind === "水路" ? Navigation : MapPinned;

  return (
    <section id="map-layer" className="border-y border-[#28302e]/10 bg-[#e7e3d8] night:bg-[#121d20]">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 lg:px-20 lg:py-28">
        <div className="grid gap-9 lg:grid-cols-[.74fr_1.26fr] lg:items-end">
          <div>
            <p className="eyebrow">地理图层</p>
            <h2 className="mt-3 max-w-md font-serif text-4xl font-black tracking-[-0.055em] md:text-5xl">都城、河道与海港，落在同一张图上。</h2>
          </div>
          <p className="max-w-[650px] justify-self-end text-base leading-8 text-[#53615d] night:text-[#b4b9b2]">
            以东京、临安、明州与泉州为阅读锚点，动态筛选都城、港口与水路节点。细线只表达历史关联，不代表精确古代航线复原。
          </p>
        </div>

        <div className="mt-12 grid border-y border-[#28302e]/15 lg:grid-cols-[1fr_320px]">
          <div className="relative min-h-[500px] overflow-hidden border-b border-[#28302e]/15 lg:border-b-0 lg:border-r">
            <svg viewBox="0 0 900 540" aria-hidden="true" className="absolute inset-0 h-full w-full">
              <path d="M64 73 C187 10, 314 76, 392 146 C457 203, 439 269, 538 314 C650 365, 794 381, 892 500" className="map-ink-ridge" />
              <path d="M38 93 C181 97, 289 126, 430 202 C569 278, 730 284, 888 351" className="map-ink-ridge map-ink-ridge-soft" />
              <path d="M308 20 C340 98, 390 143, 465 193 C512 225, 560 255, 604 325 C640 382, 697 423, 890 505" className="map-river" />
              <path d="M497 259 C573 287, 657 305, 761 330 C807 344, 851 373, 896 421" className="map-river map-river-secondary" />
              <path d="M747 344 C711 403, 682 443, 642 521" className="map-river map-river-secondary" />
              <path d="M297 83 C387 133, 451 181, 515 229 C565 267, 596 286, 624 302" className="map-route" />
              <path d="M622 304 C676 310, 727 321, 750 328" className="map-route" />
              <path d="M752 332 C731 395, 690 452, 646 500" className="map-route" />
              <text x="86" y="97" className="map-marginalia">北方</text>
              <text x="727" y="478" className="map-marginalia">东南海域</text>
              <text x="462" y="376" className="map-marginalia">江南水网</text>
            </svg>

            <div className="absolute left-5 top-5 flex flex-wrap gap-2 bg-[#f6f2e8]/90 p-2 backdrop-blur-sm night:bg-[#0e161a]/85">
              {filters.map((item) => (
                <button key={item} type="button" onClick={() => setFilter(item)} className={`map-filter ${filter === item ? "map-filter-active" : ""}`} aria-pressed={filter === item}>
                  {item}
                </button>
              ))}
            </div>

            {visible.map((place) => (
              <button
                key={place.id}
                type="button"
                onClick={() => setSelected(place)}
                className={`archive-map-node archive-map-node-${place.kind} ${selected.id === place.id ? "archive-map-node-active" : ""}`}
                style={{ left: `${place.x}%`, top: `${place.y}%` }}
                aria-label={`查看${place.ancientName}${place.name}说明`}
              >
                <span>{place.kind === "都城" ? "都" : place.kind === "港口" ? "港" : "水"}</span>
                <em>{place.ancientName}</em>
              </button>
            ))}

            <div className="absolute bottom-5 left-5 flex items-center gap-2 bg-[#f6f2e8]/90 px-3 py-2 text-[11px] text-[#53615d] backdrop-blur-sm night:bg-[#0e161a]/85 night:text-[#b4b9b2]">
              <Anchor size={14} className="text-[#4f8c85]" />
              天青虚线＝水路 / 沿海贸易关联示意
            </div>
          </div>

          <aside className="px-0 py-7 lg:px-7 lg:py-9">
            <div className="flex items-center justify-between border-b border-[#28302e]/12 pb-5">
              <p className="font-mono text-[10px] tracking-[0.18em] text-[#4f8c85]">地点注释</p>
              <KindIcon size={18} className="text-[#4f8c85]" strokeWidth={1.4} />
            </div>
            <p className="mt-7 font-mono text-[10px] tracking-[0.16em] text-[#71817d]">{selected.period}</p>
            <h3 className="mt-2 font-serif text-4xl font-bold tracking-[-0.05em]">{selected.ancientName}</h3>
            <p className="mt-1 text-sm text-[#4f8c85]">今 {selected.name}</p>
            <p className="mt-6 text-sm leading-7 text-[#53615d] night:text-[#b4b9b2]">{selected.description}</p>
            <div className="mt-8 border-t border-[#28302e]/12 pt-5 text-xs leading-6 text-[#71817d]">资料线索：哥伦比亚大学宋代贸易专题；人民日报 / 中国大运河博物馆临安城专题。</div>
          </aside>
        </div>
      </div>
    </section>
  );
}
