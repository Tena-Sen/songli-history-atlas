# 宋历｜北宋至南宋历史时间轴

> 沿一线天青，重读两宋。

**宋历**是一座以“卷轴地志”视觉语言组织的互动式宋史阅读网站。它不尝试用少数大事概括三百余年，而是把王朝转折、制度、城市、水路、人物与史料切片放进可筛选、可对照、可分享的阅读路径中。

**在线体验：** [songhistory-7qlpfkkp.manus.space](https://songhistory-7qlpfkkp.manus.space)

![宋历首页：宣纸底色、天青时间脊柱与两宋微观节点](.github/assets/songli-hero.png)

## 为什么做这个项目

两宋史不只是一条从建宋到崖山的单线叙事。宋历以 21 个经过来源核验的节点为起点，提供一条主时间脊柱与多条可交叉阅读的轨道。使用者可以从政治断裂进入，也可以沿城市、水路、技术或人物关系展开；所有连线均为**站内阅读关联**，不表示单一因果、影响强度或穷尽性解释。

## 核心功能

| 模块 | 可以做什么 |
|---|---|
| 主时间轴 | 在 **纲要 / 章节 / 细读** 三档密度间切换；支持年份范围、关键词、多维标签、快速定位和键盘导航。 |
| 并读卷轴 | 用共同年份脊柱同时比较政权、城市、人物、制度与知识技艺；可打开同年册页并固定两个节点对照差异。 |
| 史料网络 | 21 个中观历史节点，包含古籍短摘或研究资料转述、来源链接、人物入口与详情页。 |
| 城市—人物双轴 | 在东京、临安、明州、泉州之间阅读人与城市的关联；连线仅为进一步阅读的索引。 |
| 地理叠层 | 切换州县、运河水路、港口海贸三个层次；钱塘/仁和、明州外港等锚点会随时间轴年份自动显隐。 |
| 关系图谱 | 以年代为横轴、历史主题为纵轴，避免密集节点重叠；仅对焦点节点显示关系注记。 |
| 阅读与分享 | 收藏阅读路径、生成 PNG 海报、保存宋韵预设，并复制当前筛选视角或并读状态的可恢复链接。 |
| AI 研读 | 对部分古籍短摘提供逐句白话与结构化解读；该功能依赖部署环境中的服务端配置。 |

## 内容与表达边界

宋历将内容分为“主脊柱”“中观节点”“城市/人物切片”和“史料摘录”四层。年代、人物、城市关系与古籍引文均需回到公开的大学、博物馆、学术出版物或原始文献核验。对历史争议、战争和王朝终局，项目明确避免单因解释。

地理叠层是**阅读锚点示意**，并非古代行政边界、河道长度、港区范围或航线的精确复原。地方府州县标签用于提示城市内部和区域联系的层次，而不替代地方志或历史 GIS 数据库。

## 技术栈

| 领域 | 方案 |
|---|---|
| 前端 | React 19、TypeScript、Vite、Tailwind CSS 4、Wouter、Radix UI、Lucide |
| 服务端 | Express、tRPC、Drizzle、Manus OAuth |
| 测试 | Vitest |
| 设计系统 | 宣纸米白、墨绿黑、汝窑天青、朱砂方印；Noto Serif SC 与 IBM Plex Mono 的编辑式层级 |

## 本地运行

```bash
pnpm install
pnpm dev
```

在另一个终端执行质量检查：

```bash
pnpm check
pnpm test
pnpm build
```

项目中的 AI 研读、OAuth 与数据库能力依赖部署环境注入的服务端变量。克隆后若仅浏览前端档案和互动视图，无需提供密钥；如需启用相应服务，请按运行环境配置服务端变量，**不要提交密钥或 `.env` 文件**。

## 资料起点

项目中的来源索引会随节点详情页一同展示。以下机构资料构成本仓库史料筛选的主要公开入口：

1. [Columbia University, Asia for Educators：Song Dynasty](https://afe.easia.columbia.edu/songdynasty-module/)
2. [The Metropolitan Museum of Art：Southern Song Dynasty](https://www.metmuseum.org/essays/southern-song-dynasty-1127-1279)
3. [Harvard China Historical GIS](https://gis.harvard.edu/china-historical-gis)
4. [UNESCO World Heritage Centre：The Grand Canal](https://whc.unesco.org/en/list/1443/)
5. [Frontiers in Earth Science：杭州古城空间演变研究](https://www.frontiersin.org/journals/earth-science/articles/10.3389/feart.2025.1551117/full)

## 开源许可与引用说明

本仓库中的**程序代码**以 [MIT License](LICENSE) 发布。README 中的界面截图可随项目介绍转载，但不得移除项目名称与来源说明。项目对古籍、博物馆图片、论文、网页与数据库仅作链接、短摘或资料转述；其原始著作权、使用条件与再利用许可仍分别归属于对应来源。使用或扩展历史内容时，请保留出处，并自行确认每项原始资料的许可边界。

## 贡献与反馈

欢迎以 issue 或 pull request 形式补充来源、修正文案、改善可访问性或扩展阅读工具。若补充历史内容，请同时给出可访问的原始文献、大学/博物馆页面或学术出版来源，并清楚区分事实、研究解释与叙事性转述。

---

<p align="center">宋历 · 960—1279 · 以一条天青线重读两宋</p>
