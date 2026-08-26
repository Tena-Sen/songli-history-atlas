import { describe, expect, it } from "vitest";
import { getHistoryChain, HISTORY_CHAINS, nextHistoryChainIndex, readingBranchesForChain } from "./historyChains";

describe("history chains", () => {
  it("provides three ordered stages for every time-axis node", () => {
    expect(HISTORY_CHAINS).toHaveLength(8);
    expect(HISTORY_CHAINS.every((chain) => chain.stages.map((stage) => stage.label).join("/") === "前因/当下冲突/后续余波")).toBe(true);
  });

  it("falls back to the first readable chain for an unknown identifier", () => {
    expect(getHistoryChain("unknown")?.id).toBe("northern-song");
    expect(getHistoryChain("jingkang")?.stages[2].nodeIds).toEqual(["linan"]);
  });

  it("cycles safely for keyboard-driven chain selection", () => {
    expect(nextHistoryChainIndex(8, 0, -1)).toBe(7);
    expect(nextHistoryChainIndex(8, 7, 1)).toBe(0);
    expect(nextHistoryChainIndex(0, 0, 1)).toBe(-1);
  });

  it("offers an alternate readable branch for every chain", () => {
    expect(HISTORY_CHAINS.every((chain) => readingBranchesForChain(chain.id).length > 0)).toBe(true);
    expect(readingBranchesForChain("jingkang").map((branch) => branch.targetId)).toEqual(["linan", "chanyuan"]);
  });
});
