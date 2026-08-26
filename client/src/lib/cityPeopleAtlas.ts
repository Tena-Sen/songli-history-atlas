export type AtlasCity = {
  id: string;
  name: string;
  currentName: string;
  period: string;
  note: string;
  eventIds: string[];
};

export type AtlasPerson = {
  id: string;
  name: string;
  role: string;
  eventId: string;
};

export const ATLAS_CITIES: AtlasCity[] = [
  { id: "dongjing", name: "东京", currentName: "今开封", period: "960—1127", note: "北宋政治中心；本站将其与北方关系、朝廷决策和靖康危局并读。", eventIds: ["northern-song", "chanyuan", "jingkang"] },
  { id: "linan", name: "临安", currentName: "今杭州", period: "1138—1276", note: "南宋行在和都城；本站将其与政权南迁、运河城市生活和宋末人物并读。", eventIds: ["jingkang", "linan", "linan-fall", "end-of-song"] },
  { id: "mingzhou", name: "明州", currentName: "今宁波", period: "南宋时期", note: "临安东侧的重要港口；本站仅以水路与沿海联系作为阅读线索。", eventIds: ["linan"] },
  { id: "quanzhou", name: "泉州", currentName: "今泉州", period: "两宋时期", note: "宋代重要沿海城市；本站以海贸、港口与知识记录的关联切入。", eventIds: ["movable-type", "linan"] },
];

export const ATLAS_PEOPLE: AtlasPerson[] = [
  { id: "zhao-kuangyin", name: "赵匡胤", role: "建宋", eventId: "northern-song" },
  { id: "song-zhenzong", name: "宋真宗", role: "北方关系", eventId: "chanyuan" },
  { id: "kou-zhun", name: "寇准", role: "边境外交", eventId: "chanyuan" },
  { id: "song-huizong", name: "宋徽宗", role: "北方危局", eventId: "jingkang" },
  { id: "song-qinzong", name: "宋钦宗", role: "东京危局", eventId: "jingkang" },
  { id: "song-gaozong", name: "宋高宗", role: "南迁承接", eventId: "linan" },
  { id: "zhao-rugua", name: "赵汝适", role: "泉州市舶司", eventId: "linan" },
  { id: "wen-tianxiang", name: "文天祥", role: "宋末政治", eventId: "linan-fall" },
  { id: "lu-xiufu", name: "陆秀夫", role: "海上政局", eventId: "end-of-song" },
];

const CITY_PERSON_LINKS: Record<string, string[]> = {
  dongjing: ["zhao-kuangyin", "song-zhenzong", "kou-zhun", "song-huizong", "song-qinzong"],
  linan: ["song-gaozong", "wen-tianxiang", "lu-xiufu"],
  mingzhou: ["song-gaozong"],
  quanzhou: ["zhao-rugua"],
};

export function peopleForAtlasCity(cityId: string) {
  const ids = CITY_PERSON_LINKS[cityId] ?? [];
  return ATLAS_PEOPLE.filter((person) => ids.includes(person.id));
}

export function atlasCityForPerson(personId: string) {
  return ATLAS_CITIES.find((city) => (CITY_PERSON_LINKS[city.id] ?? []).includes(personId));
}
