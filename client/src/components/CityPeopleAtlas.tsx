/**
 * 设计提醒｜卷轴地志：以城市为左轴、人物为右轴，连接只提供阅读方向，
 * 不将复杂历史压缩为人物决定城市的单一因果。
 */
import { useMemo, useState } from "react";
import { ArrowUpRight, MapPinned, Route, UserRound } from "lucide-react";
import { ATLAS_CITIES, ATLAS_PEOPLE, peopleForAtlasCity } from "@/lib/cityPeopleAtlas";
import { archiveEntriesForCity } from "@/lib/expandedSongArchive";

const EVENT_NAMES: Record<string, { year: string; title: string }> = {
  "northern-song": { year: "960", title: "建宋" }, chanyuan: { year: "1005", title: "澶渊" }, "movable-type": { year: "11世纪", title: "活字印刷" }, "new-policies": { year: "1069—1072", title: "熙宁新法" }, jingkang: { year: "1127", title: "靖康" }, linan: { year: "1138", title: "临安行在" }, "linan-fall": { year: "1276", title: "临安失守" }, "end-of-song": { year: "1279", title: "崖山之后" },
};

function openTimelineEvent(id: string) {
  window.dispatchEvent(new CustomEvent("songli:select-event", { detail: id }));
  window.setTimeout(() => (document.getElementById("parallel-scroll") ?? document.getElementById("time-spine"))?.scrollIntoView({ behavior: "smooth", block: "start" }), 0);
}

export function CityPeopleAtlas() {
  const [cityId, setCityId] = useState("linan");
  const [personId, setPersonId] = useState("song-gaozong");
  const city = ATLAS_CITIES.find((item) => item.id === cityId) ?? ATLAS_CITIES[0];
  const people = useMemo(() => peopleForAtlasCity(city.id), [city.id]);
  const archiveEntries = useMemo(() => archiveEntriesForCity(city.id), [city.id]);
  const person = ATLAS_PEOPLE.find((item) => item.id === personId) ?? people[0];

  const selectCity = (nextCityId: string) => {
    const nextPeople = peopleForAtlasCity(nextCityId);
    setCityId(nextCityId);
    setPersonId(nextPeople[0]?.id ?? "");
  };

  return (
    <section id="city-people-atlas" className="border-y border-[#28302e]/10 bg-[#e9e7db] night:bg-[#111d20]">
      <div className="mx-auto max-w-[1440px] px-6 py-20 md:px-12 lg:px-20 lg:py-28">
        <div className="grid gap-8 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
          <div><p className="eyebrow">城市人物双轴</p><h2 className="mt-3 max-w-md font-serif text-4xl font-black tracking-[-0.055em] md:text-5xl">一座城，一组人，一段可追踪的局势。</h2></div>
          <p className="max-w-[650px] justify-self-end text-base leading-8 text-[#53615d] night:text-[#b4b9b2]">左轴为城市，右轴为站内人物索引。选择一座城，查看它与人物、事件之间可继续阅读的关联；细线不是人物决定城市的因果图，而是一张地志式阅读索引。</p>
        </div>

        <div className="atlas-sheet mt-12">
          <div className="atlas-cities" role="listbox" aria-label="选择城市阅读锚点">
            <div className="atlas-axis-title"><MapPinned size={17} /><span>城市轴</span></div>
            {ATLAS_CITIES.map((item) => <button key={item.id} type="button" role="option" aria-selected={city.id === item.id} onClick={() => selectCity(item.id)} className={`atlas-city ${city.id === item.id ? "atlas-city-active" : ""}`}><span>{item.period}</span><strong>{item.name}</strong><em>{item.currentName}</em></button>)}
          </div>

          <div className="atlas-link-zone">
            <div className="atlas-axis-title"><Route size={17} /><span>阅读关联</span></div>
            <div className="atlas-selected-city"><p className="font-mono text-[10px] tracking-[.16em] text-[#4f8c85]">{city.period}</p><h3 className="mt-2 font-serif text-4xl font-bold tracking-[-.05em]">{city.name}</h3><p className="mt-1 text-sm text-[#4f8c85]">{city.currentName}</p><p className="mt-5 text-sm leading-7 text-[#71817d]">{city.note}</p></div>
            <div className="atlas-event-threads mt-7"><p className="eyebrow">相关事件</p><div className="mt-3 flex flex-wrap gap-2">{city.eventIds.map((id) => { const event = EVENT_NAMES[id]; return event ? <button key={id} type="button" onClick={() => openTimelineEvent(id)} className="atlas-event-link"><span>{event.year}</span>{event.title}<ArrowUpRight size={12} /></button> : null; })}</div></div>
            {archiveEntries.length > 0 && <div className="atlas-event-threads mt-6"><p className="eyebrow">扩展史料切片</p><div className="mt-3 flex flex-wrap gap-2">{archiveEntries.map((entry) => <button key={entry.id} type="button" onClick={() => openTimelineEvent(entry.id)} className="atlas-event-link"><span>{entry.year}</span>{entry.title}<ArrowUpRight size={12} /></button>)}</div></div>}
            <p className="mt-8 border-t border-[#28302e]/12 pt-4 text-[11px] leading-5 text-[#71817d]">资料线索：哥伦比亚大学宋代城市与对外贸易专题。城市、人物与事件的连线仅指向本站的阅读入口，不表达影响强度或穷尽全部历史关联。</p>
          </div>

          <div className="atlas-people">
            <div className="atlas-axis-title"><UserRound size={17} /><span>人物轴</span></div>
            <div className="mt-5 space-y-2">{people.map((item, index) => <button key={item.id} type="button" onClick={() => setPersonId(item.id)} className={`atlas-person ${person?.id === item.id ? "atlas-person-active" : ""}`}><span>{String(index + 1).padStart(2, "0")}</span><div><strong>{item.name}</strong><small>{item.role}</small></div></button>)}</div>
            {person && <a href={`/event/${person.eventId}?person=${person.id}`} className="atlas-person-read mt-7"><span>查看 {person.name} 的人物小传</span><ArrowUpRight size={15} /></a>}
          </div>
        </div>
      </div>
    </section>
  );
}
