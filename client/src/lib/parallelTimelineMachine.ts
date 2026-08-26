import {
  DEFAULT_PARALLEL_TRACK_IDS,
  firstEventForChapter,
  type ParallelChapterId,
  type ParallelTrackId,
} from "./parallelTimeline";

export type ParallelMobilePanel = "closed" | "tracks" | "folio";

export type ParallelTimelineState = {
  chapterId: ParallelChapterId;
  visibleTrackIds: ParallelTrackId[];
  focusedEventId: string;
  folioEventId: string | null;
  pinnedEventIds: string[];
  mobilePanel: ParallelMobilePanel;
};

export type ParallelTimelineAction =
  | { type: "HYDRATE"; payload: Partial<ParallelTimelineState> }
  | { type: "SELECT_CHAPTER"; chapterId: ParallelChapterId }
  | { type: "TOGGLE_TRACK"; trackId: ParallelTrackId }
  | { type: "FOCUS_EVENT"; eventId: string }
  | { type: "OPEN_FOLIO"; eventId: string; mobile?: boolean }
  | { type: "CLOSE_FOLIO" }
  | { type: "PIN_EVENT"; eventId: string }
  | { type: "UNPIN_EVENT"; eventId: string }
  | { type: "SET_MOBILE_PANEL"; panel: ParallelMobilePanel };

export const initialParallelTimelineState: ParallelTimelineState = {
  chapterId: "all",
  visibleTrackIds: DEFAULT_PARALLEL_TRACK_IDS,
  focusedEventId: "northern-song",
  folioEventId: null,
  pinnedEventIds: [],
  mobilePanel: "closed",
};

function toggleTrack(trackIds: ParallelTrackId[], trackId: ParallelTrackId) {
  const next = trackIds.includes(trackId) ? trackIds.filter((item) => item !== trackId) : [...trackIds, trackId];
  return next.length > 0 ? next : trackIds;
}

export function pinAtMostTwo(current: string[], eventId: string) {
  if (current.includes(eventId)) return current;
  return [...current, eventId].slice(-2);
}

export function parallelTimelineReducer(state: ParallelTimelineState, action: ParallelTimelineAction): ParallelTimelineState {
  switch (action.type) {
    case "HYDRATE":
      return { ...state, ...action.payload, mobilePanel: "closed" };
    case "SELECT_CHAPTER":
      return {
        ...state,
        chapterId: action.chapterId,
        focusedEventId: firstEventForChapter(action.chapterId),
        folioEventId: null,
        mobilePanel: "closed",
      };
    case "TOGGLE_TRACK":
      return { ...state, visibleTrackIds: toggleTrack(state.visibleTrackIds, action.trackId) };
    case "FOCUS_EVENT":
      return { ...state, focusedEventId: action.eventId };
    case "OPEN_FOLIO":
      return { ...state, focusedEventId: action.eventId, folioEventId: action.eventId, mobilePanel: action.mobile ? "folio" : "closed" };
    case "CLOSE_FOLIO":
      return { ...state, folioEventId: null, mobilePanel: "closed" };
    case "PIN_EVENT":
      return { ...state, pinnedEventIds: pinAtMostTwo(state.pinnedEventIds, action.eventId) };
    case "UNPIN_EVENT":
      return { ...state, pinnedEventIds: state.pinnedEventIds.filter((id) => id !== action.eventId) };
    case "SET_MOBILE_PANEL":
      return { ...state, mobilePanel: action.panel };
  }
}

export function decodeParallelTimelineUrl(search: string): Partial<ParallelTimelineState> {
  const params = new URLSearchParams(search);
  const chapterId = params.get("parallelChapter") as ParallelChapterId | null;
  const validChapters: ParallelChapterId[] = ["all", "northern", "reform", "transition", "southern"];
  const validTracks: ParallelTrackId[] = ["politics", "city", "people", "institution", "knowledge"];
  const parsedTracks = (params.get("parallelTracks") ?? "").split(",").filter((track): track is ParallelTrackId => validTracks.includes(track as ParallelTrackId));
  const eventId = params.get("parallelEvent");
  return {
    ...(chapterId && validChapters.includes(chapterId) ? { chapterId } : {}),
    ...(parsedTracks.length > 0 ? { visibleTrackIds: parsedTracks } : {}),
    ...(eventId ? { focusedEventId: eventId } : {}),
  };
}

export function encodeParallelTimelineUrl(state: ParallelTimelineState) {
  const params = new URLSearchParams(window.location.search);
  params.set("parallelChapter", state.chapterId);
  params.set("parallelTracks", state.visibleTrackIds.join(","));
  params.set("parallelEvent", state.focusedEventId);
  return `${window.location.pathname}?${params.toString()}${window.location.hash}`;
}
