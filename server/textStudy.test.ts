import { describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";
import { invokeLLM } from "./_core/llm";
import { appRouter } from "./routers";

vi.mock("./_core/llm", () => ({ invokeLLM: vi.fn() }));

describe("textStudy.analyze", () => {
  it("uses a structured server-side model call and returns sentence-level analysis", async () => {
    vi.mocked(invokeLLM).mockResolvedValue({
      id: "mock",
      created: 0,
      model: "gpt-5-mini",
      choices: [
        {
          index: 0,
          finish_reason: "stop",
          message: {
            role: "assistant",
            content: JSON.stringify({
              sentences: [{ original: "庆历中", modern: "庆历年间", note: "时间状语" }],
              deepAnalysis: "这是技术记载的起笔。",
              readingHint: "可与印刷史材料对读。",
              caveat: "仅作阅读辅助，不替代校勘本。",
            }),
          },
        },
      ],
    } as never);

    const ctx = { user: null, req: {} as TrpcContext["req"], res: {} as TrpcContext["res"] } as TrpcContext;
    const result = await appRouter.createCaller(ctx).textStudy.analyze({
      excerpt: "庆历中，有布衣毕昇，又为活板。",
      title: "活字印刷",
      source: "《梦溪笔谈·技艺》",
    });

    expect(result.sentences[0]?.modern).toBe("庆历年间");
    expect(invokeLLM).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gpt-5-mini",
        response_format: expect.objectContaining({ type: "json_schema" }),
      })
    );
  });
});
