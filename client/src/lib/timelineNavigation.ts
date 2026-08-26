export type TimelineDirection = -1 | 1;

/** 计算时间轴键盘导航的下一节点索引；空列表返回 -1。 */
export function nextTimelineIndex(length: number, currentIndex: number, direction: TimelineDirection) {
  if (length <= 0) return -1;
  const safeIndex = currentIndex < 0 ? 0 : currentIndex;
  return (safeIndex + direction + length) % length;
}
