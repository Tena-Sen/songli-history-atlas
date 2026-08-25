import { COOKIE_NAME } from "@shared/const";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { invokeLLM } from "./_core/llm";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";

const textStudyOutput = z.object({
  sentences: z.array(z.object({ original: z.string(), modern: z.string(), note: z.string() })).min(1).max(12),
  deepAnalysis: z.string().min(1),
  readingHint: z.string().min(1),
  caveat: z.string().min(1),
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  textStudy: router({
    analyze: publicProcedure
      .input(z.object({ excerpt: z.string().min(2).max(600), title: z.string().min(1).max(80), source: z.string().min(1).max(120) }))
      .mutation(async ({ input }) => {
        const response = await invokeLLM({
          model: "gpt-5-mini",
          messages: [
            { role: "system", content: "你是一名谨慎的中国古籍阅读辅助工具。只依据用户提供的原文翻译和解释；不要补造史实、异文、作者意图或版本结论。输出简体中文，面向普通读者；明确区分白话翻译与阅读提示。" },
            { role: "user", content: `请对以下古籍短摘做逐句白话翻译和深度解析。标题：${input.title}。来源题签：${input.source}。原文：${input.excerpt}` },
          ],
          response_format: {
            type: "json_schema",
            json_schema: {
              name: "ancient_text_study",
              strict: true,
              schema: {
                type: "object",
                properties: {
                  sentences: { type: "array", items: { type: "object", properties: { original: { type: "string" }, modern: { type: "string" }, note: { type: "string" } }, required: ["original", "modern", "note"], additionalProperties: false } },
                  deepAnalysis: { type: "string" }, readingHint: { type: "string" }, caveat: { type: "string" },
                },
                required: ["sentences", "deepAnalysis", "readingHint", "caveat"], additionalProperties: false,
              },
            },
          },
        });
        const content = response.choices[0]?.message.content;
        if (typeof content !== "string") throw new Error("古籍解析服务未返回可读文本");
        return textStudyOutput.parse(JSON.parse(content));
      }),
  }),

  // TODO: add feature routers here, e.g.
  // todo: router({
  //   list: protectedProcedure.query(({ ctx }) =>
  //     db.getUserTodos(ctx.user.id)
  //   ),
  // }),
});

export type AppRouter = typeof appRouter;
