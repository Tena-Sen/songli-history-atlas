import { describe, expect, it } from "vitest";
import { atlasCityForPerson, ATLAS_CITIES, peopleForAtlasCity } from "./cityPeopleAtlas";

describe("city people atlas", () => {
  it("keeps every city connected to at least one station person", () => {
    expect(ATLAS_CITIES.every((city) => peopleForAtlasCity(city.id).length > 0)).toBe(true);
  });

  it("locates the city reading anchor for a person", () => {
    expect(atlasCityForPerson("song-gaozong")?.id).toBe("linan");
    expect(atlasCityForPerson("unknown")).toBeUndefined();
  });
});
