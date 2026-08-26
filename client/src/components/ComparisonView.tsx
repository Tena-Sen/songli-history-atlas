/**
 * 设计提醒｜卷轴地志：比较不是数据卡片，而是把不同线索放在同一册页的并读关系中。
 */
import { useState } from "react";
import { ArrowUpRight, BookOpen, Landmark, Scale, Waves } from "lucide-react";

type Lens = "制度" | "技术" | "城市" | "外交";

const LENSES: Record<
  Lens,
  { period: string; title: string; note: string; north: string[]; south: string[]; source: string; sourceUrl: string; icon: typeof Scale }
> = {
  制度: {
    period: "POLICY & GOVERNANCE",
    title: "制度：从文官秩序到南方政局",
    note: "把制度放进时间轴，不是给改革贴标签，而是观察国家如何回应财政、选官、军政与疆域变化。",
    north: ["1043—1045：庆历改革把官僚整饬与教育放入战时政治", "1069—1072：王安石新法触及财政、官员训练与军政", "新法争论成为北宋政治的重要张力"],
    south: ["1130—1200：朱熹的新儒学为思想与教育提供长期切片", "行在临安成为新的行政与城市重心", "政权南迁改变了资源与交通的组织方式"],
    source: "EBSCO Research Starters：Wang Anshi Introduces Bureaucratic Reforms",
    sourceUrl: "https://www.ebsco.com/research-starters/history/wang-anshi-introduces-bureaucratic-reforms/",
    icon: Scale,
  },
  技术: {
    period: "TECHNOLOGY & KNOWLEDGE",
    title: "技术：从雕版到活字的知识复制",
    note: "宋代技术的意义并不只在单项发明，而在农业、铁业、印刷与城市增长相互支撑的系统性变化。",
    north: ["1012：占城稻进入江淮，农政与水网可被并读", "1044：《武经总要》记录军技与火药配方", "1078：铁业规模提供生产与资源的观察点"],
    south: ["书籍与知识生产延续至南宋", "技术与市场共同塑造城市生活", "城市网络让商品与信息沿水陆流动"],
    source: "哥伦比亚大学 Asia for Educators：Song Dynasty China",
    sourceUrl: "https://afe.easia.columbia.edu/songdynasty-module/",
    icon: BookOpen,
  },
  城市: {
    period: "CITY & COMMERCE",
    title: "城市：从东京到临安的水路转向",
    note: "城市不是王朝背景。东京的城市记忆与临安的运河、商市、港口网络，让两宋的南北转换拥有具体的空间形态。",
    north: ["东京是北宋城市生活的重要场景", "《东京梦华录》留存都城风物的文字记忆", "城市化与商业化在北宋时期显著发展"],
    south: ["1138：临安成为行在所", "1225：《诸蕃志》让泉州市舶、货物与港口知识同页出现", "1277：沉船考古提供宋末海贸网络的一条切片"],
    source: "人民日报 / 中国大运河博物馆：南宋临安城专题",
    sourceUrl: "http://paper.people.com.cn/rmrb/pad/content/202512/27/content_30127489.html",
    icon: Landmark,
  },
  外交: {
    period: "BORDERS & EXCHANGE",
    title: "外交：北方边境与海上通道",
    note: "两宋一面面对北方强邻的持续压力，一面经由江南与沿海港口打开更广阔的贸易联系。",
    north: ["1005：宋辽缔约，边境关系进入相对稳定期", "1040—1044：西北战争再次让防务与财政承压", "1115：金朝建立后，北方格局重新排列"],
    south: ["南宋与北方政权长期对峙", "1234：金朝终结改变北方政治与军事环境", "泉州等沿海城市连接面向海外的航路"],
    source: "哥伦比亚大学 Asia for Educators：Song trade networks",
    sourceUrl: "https://afe.easia.columbia.edu/songdynasty-module/outside-trade.html",
    icon: Waves,
  },
};

export function ComparisonView() {
  const [lens, setLens] = useState<Lens>("制度");
  const active = LENSES[lens];
  const LensIcon = active.icon;

  return (
    <section id="comparison" className="mx-auto max-w-[1440px] border-x border-[#28302e]/10 px-6 py-20 md:px-12 lg:px-20 lg:py-28">
      <div className="grid gap-9 lg:grid-cols-[.72fr_1.28fr] lg:items-end">
        <div>
          <p className="eyebrow">比较视图</p>
          <h2 className="mt-3 max-w-md font-serif text-4xl font-black tracking-[-0.055em] md:text-5xl">一条时间线，四种观察法。</h2>
        </div>
        <p className="max-w-[640px] justify-self-end text-base leading-8 text-[#53615d] night:text-[#b4b9b2]">
          选择制度、技术、城市或外交，比较视图会将北宋与南宋的同类线索并置。这里不比较虚构指标，只比较历史变化发生在何处、以何种方式延续。
        </p>
      </div>

      <div className="mt-12 flex flex-wrap gap-x-6 gap-y-3 border-b border-[#28302e]/15 pb-4">
        {(Object.keys(LENSES) as Lens[]).map((item) => (
          <button
            type="button"
            key={item}
            onClick={() => setLens(item)}
            className={`compare-tab ${lens === item ? "compare-tab-active" : ""}`}
            aria-pressed={lens === item}
          >
            {item}
          </button>
        ))}
      </div>

      <div className="mt-8 grid border-y border-[#28302e]/15 lg:grid-cols-[.64fr_1.36fr]">
        <div className="border-b border-[#28302e]/15 px-0 py-7 lg:border-b-0 lg:border-r lg:px-8 lg:py-9">
          <LensIcon size={22} className="text-[#4f8c85]" strokeWidth={1.4} />
          <p className="mt-7 font-mono text-[10px] tracking-[0.18em] text-[#4f8c85]">{active.period}</p>
          <h3 className="mt-3 font-serif text-3xl font-bold tracking-[-0.045em]">{active.title}</h3>
          <p className="mt-5 text-sm leading-7 text-[#71817d]">{active.note}</p>
          <a href={active.sourceUrl} target="_blank" rel="noreferrer" className="mt-8 inline-flex items-center gap-2 text-xs text-[#4f8c85] hover:underline">
            查看资料来源 <ArrowUpRight size={14} />
          </a>
        </div>

        <div className="divide-y divide-[#28302e]/15 lg:divide-y-0 lg:divide-x lg:grid lg:grid-cols-2">
          {[
            ["北宋", "960—1127", active.north],
            ["南宋", "1127—1279", active.south],
          ].map(([title, period, lines]) => (
            <article key={title as string} className="px-0 py-7 lg:px-9 lg:py-9">
              <p className="font-mono text-[10px] tracking-[0.18em] text-[#4f8c85]">{period as string}</p>
              <h4 className="mt-2 font-serif text-3xl font-bold tracking-[-0.04em]">{title as string}</h4>
              <ol className="mt-7 space-y-5">
                {(lines as string[]).map((line, index) => (
                  <li key={line} className="grid grid-cols-[24px_1fr] gap-3 text-sm leading-7 text-[#53615d] night:text-[#b4b9b2]">
                    <span className="font-mono text-[10px] text-[#78A9A1]">0{index + 1}</span>
                    <span>{line}</span>
                  </li>
                ))}
              </ol>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
