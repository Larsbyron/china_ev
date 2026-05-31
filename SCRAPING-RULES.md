# E-Auto Blog 抓取 & 翻译规则

> 本文档定义从中文汽车新闻源抓取、筛选、翻译成德语文章的全部规则。
> 供人工审查和自动化开发参考。

---

## 一、信息源

| # | 源名 | 列表页 URL | 编码 | 备注 |
|---|---|---|---|---|
| 1 | Autohome NewEnergy⭐ | `autohome.com.cn/newenergy/` | UTF-8 | 主力源，纯新能源 |
| 2 | Autohome | `autohome.com.cn/news/` | UTF-8 | 综合新闻 |
| 3 | Autohome All 🆕 | `autohome.com.cn/all/` | GB2312 | 全站，自动过滤燃油车 |
| 4 | PCauto | `pcauto.com.cn/nation/` | GB2312 | 太平洋汽车 |
| 5 | Sina | `auto.sina.com.cn/news/` | UTF-8 | 新浪汽车 |
| 6 | ChooseAuto 🆕 | `chooseauto.com.cn/list/channel_1.shtml` | UTF-8 | 选车网新车频道 |
| 7 | OFweek NEV 🆕 | `nev.ofweek.com/CATList-71000-8200-nev.html` | UTF-8 | 维科新能源新品 |

### 非抓取来源（手工策划文章用）

除上述中文抓取源外，`src/lib/schemas.ts` 的 `source` 枚举还允许一批德语/国际权威源，
用于**手工撰写的欧盟政策/关税类文章**（如"Politik, Zölle & Regulierung"主题）：
`electrive`、`ADAC`、`MERICS`、`Reuters`、`Bloomberg`、`Euronews`、`CGTN`、`Bruegel`、`CEPR`、`CER`、`Europäische Kommission`。
这类文章带真实 `original_url`，为忠于原报道的德语摘要，不走自动翻译流水线。

---

## 二、链接抓取规则

### 通用规则
- 只抓文章详情页 URL，跳过列表页、搜索页、标签页
- 标题长度 ≥ 5 字符
- 排除 `javascript:` 和 `#` 伪链接
- 自动处理 `//` 协议相对路径，补全为 `https://`
- 同源去重（同 URL 只抓一次）

### 各源正则

| 源 | URL 正则 | 示例 |
|---|---|---|
| autohome 系列 | `/news/\d{6}/\d+\.html` | `/news/202605/1314167.html` |
| PCauto | `/nation/\d+/\d+\.html` | `/nation/1234/5678.html` |
| Sina | `/detail-` `/article/` `/content-` `/doc-` | `/doc-xxx.html` |
| ChooseAuto | `/news/` | `/news/897997.shtml` |
| OFweek NEV | `/ART-` | `/2026-04/ART-71008-8220-30686126.html` |

### 请求参数
```
User-Agent: Chrome 120 / macOS
Accept: text/html,application/xhtml+xml
Accept-Language: zh-CN,zh;q=0.9,en;q=0.8
重试: 最多3次，间隔2秒
延迟: 每请求间隔1秒
```

---

## 三、内容提取规则

### 最小字符数
- **< 300 字符**：丢弃（不是完整文章）

### 内容选择器（按源）

| 源 | 选择器 | 说明 |
|---|---|---|
| autohome 系列 | `class*="Article_Wrap_Box"` + `class*="tw-text-[32px]"` | Tailwind CSS Modules |
| PCauto | `.artText` + `h1.tit` | 传统类名 |
| Sina | 通用 fallback：`#articleContent` → `.article-content` → `.news-content` → `article` → `.art_content` | |
| ChooseAuto | `body`，移除 header/nav/footer/hot-*/related 等 | 清理大量尾部锅炉 |
| OFweek NEV | `body`，移除 header/nav/footer/side/hot/related/recommend 等 | 清理导航+招聘+侧栏 |

### 通用清洗
- 移除标签：`script, style, nav, header, footer, aside, iframe, noscript, form, button, input, select, svg, path`
- 移除 class：`ad, advertisement, comment, share, related, sidebar, toolbar, nav-bar, menu, btn, button, icon, logo, breadcrumb, pagination`
- 连续空行压缩为 1 行

### 图片提取（按源）

| 源 | 选择器 | 排除 |
|---|---|---|
| autohome 系列 | `[class*='Article_Wrap_Box'] img` `.editor-image img` | 含 `lazy` 的 URL |
| PCauto | `.artText img` | — |
| ChooseAuto | `img` | avatar, logo, icon, gif, pixel, 1x1, /ad/, gaicon |
| OFweek NEV | `img` | avatar, logo, icon, gif, pixel, 1x1, ofweek工具栏图标, 站标, 页脚图标, 招聘logo, beian.png, qrcode, weixin, wechat, online2.gif, loading.png |
| 通用 fallback | `img` | avatar, logo, icon, gif, pixel, 1x1, default_big.png, default, placeholder, empty, blank |

---

## 四、文章筛选规则（内容把关）

> 在翻译前执行，不符合直接丢弃

### ✅ 要的文章类型

- **新车发布**：全新车型、改款上市、价格公布
- **车型介绍**：配置规格、外观内饰、动力系统
- **试驾评测**：驾驶体验、性能测试
- **技术解析**：电池、智驾、800V、固态等
- **车展报道**：北京/上海/广州车展新车亮相
- **新能源车**：纯电(BEV)、插混(PHEV)、增程(EREV)、混动(HEV)

### ❌ 不要的文章类型

- **人物访谈**：CEO/高管专访（标题含"专访""访谈"或以人名开头）
- **企业战略**：品牌规划、公司财报、人事变动
- **行业分析**：市场趋势、销量数据、竞争格局
- **价格战**：促销活动、购车权益盘点
- **短视频/视频描述**：纯视频内容，文字不足500字
- **纯燃油车**：不含任何 EV/新能源关键词的燃油车新闻

### EV 关键词（autohome_all 自动过滤用）

```
电动, 纯电, 插混, 增程, 混动, 新能源, 电池, 充电, 续航,
NIO, 蔚来, BYD, 比亚迪, XPeng, 小鹏, 理想, Zeekr, 极氪,
小米, SU7, 特斯拉, Tesla, 埃安, 零跑, 大众ID, ID., EQ, iX, e-tron,
EQS, EQB, EQC, EQE, EQA, 新势力, Robotaxi,
华境, 铂智, 阿维塔, 奥迪E, AUDI E, 深蓝, 长安启源,
岚图, 仰望, 方程豹, 问界, 享界, 智界, 尚界, 尊界,
昊铂, 星途, 猛士, 坦克hi4, 哈弗Hi4
```

> 检测范围：标题 + 正文前 1000 字符

---

## 五、品牌识别规则

从标题+正文匹配品牌，用于文章分类。

| 品牌 | 匹配词 |
|---|---|
| BYD | BYD, 比亚迪, 腾势, 方程豹 |
| NIO | NIO, 蔚来 |
| XPeng | XPeng, Xpeng, 小鹏 |
| Li Auto | Li Auto, 理想 |
| Geely | Geely, 吉利, 领克 |
| Zeekr | Zeekr, 极氪 |
| Xiaomi | Xiaomi, 小米, SU7 |
| MG | MG, 名爵 |
| Aion | Aion, 埃安 |
| Leapmotor | Leapmotor, 零跑 |
| Onvo | Onvo, 乐道 |
| Tesla | Tesla, 特斯拉 |
| BMW | BMW, 宝马 |
| Mercedes | Mercedes, 奔驰 |
| Audi | Audi, 奥迪 |
| Volkswagen | Volkswagen, 大众 |
| Changan | Changan, 长安 |
| Avatr | Avatr, 阿维塔 |
| Hongqi | Hongqi, 红旗 |
| Deepal | Deepal, 深蓝 |
| Denza | Denza, 腾势 |
| Hyper | Hyper, 昊铂 |
| Arcfox | Arcfox, 极狐 |

---

## 六、去重规则

- **Fingerprint**：文本标准化（去HTML标签、小写、去空格）→ SHA-256
- **文件历史**：查 `processed_articles.json` 中有无相同 fingerprint
- **已有文章**：查 `content/posts/` 中 `original_url` 是否重复

---

## 七、翻译规则（中文→德语）

### 风格要求
- 德语汽车媒体风格（类似 Auto Motor Sport、Auto Bild）
- 专业但不生硬，面向德国汽车爱好者读者
- 保持原文信息密度，不添油加醋

### 处理规范
- **品牌名/车型名**：保留原文（BYD, NIO, XPeng, SU7, ID.ERA 9X...）
- **人名**：保留原文（李斌 = Li Bin，不翻成 Libin）
- **技术术语**：用德语行业标准译法
  - 纯电 = rein elektrisch
  - 续航 = Reichweite
  - 快充 = Schnellladung
  - 智驾 = Fahrassistenz / autonomes Fahren
  - 激光雷达 = Lidar
  - 800V 平台 = 800-Volt-Architektur
- **中文惯用语**：意译，不要字面翻译
  - "卷" = intensiver Wettbewerb / Preiskampf
  - "爆款" = Verkaufsschlager
  - "冰箱彩电大沙发" = Komfortausstattung (Kühlschrank, Displays, Sitze)
  - "真香" = überzeugend / attraktiv
- **数字格式**：德语习惯（28.98万元 = 28.980 Yuan ≈ ca. 3.700 Euro）

### 不要翻的
- 页脚导航、版权声明、友情链接
- 评论区内容
- "责任编辑：xxx"等元信息
- 重复的副标题/SEO关键词堆砌

### 内容结构
- **标题**：德语原创，抓眼球但准确（不直译中文标题）
- **摘要（description）**：1-2句概括，含品牌+核心亮点
- **正文**：HTML 格式，保留原文段落结构，适当分段
  - H2 标题用于新车各板块（设计、内饰、动力、智驾、价格）
  - 图片：抓取时保留（img 标签带 alt 描述），但**渲染期会过滤**（见下方规则）

### 正文图片渲染规则（render 期，`src/lib/markdown.ts`）

正文图片统一拉满正文栏宽（`.article-content img { width: 100% }`），因此构建时会用 `sharp` 读取每张图尺寸并**丢弃不适合满宽展示的图**：

- **竖图**（高 > 宽）：基本是人物/肖像照，对德国读者无意义 → 删除
- **小图**（宽 < 400px 或 高 < 225px）：来源 logo、小图标、方形头像，满宽会被放大模糊 → 删除
- 保留的横向内容图（车图/产品图）统一栏宽，删图后空 `<p>` 一并清除

> 原则：宁可少图也要统一。某文若没有合格内容图，正文就纯文字。

---

## 八、发布格式

### 文件名
```
content/posts/YYYY-MM-DD-{german-slug}-{source}-{id}.md
```
示例：`2026-05-09-audi-e7x-preis-bekannt-gegeben-autohome-1314167.md`

### Frontmatter
```yaml
---
title: "德语标题（纯文本，不用引号内嵌引号）"
date: 2026-05-09T07:00:00+02:00
description: "德语摘要，1-2句"
source: "Autohome NewEnergy"
image: null          # ⚠️ 用 null，不要用空字符串 ""
category: "news"
brand: "Audi"        # 来自品牌识别，无则为空字符串
tags: ["Audi", "E7X", "Elektro-SUV"]
draft: false
original_url: "https://www.autohome.com.cn/news/202605/1314167.html"
read_time_minutes: 5
---
```

### 注意事项
- ✅ `image: null`（不是 `""`）
- ✅ `date` 带时区 `+02:00`（柏林夏令时）
- ✅ YAML 描述中不要出现 ASCII 双引号 `"` 破坏解析
- ✅ `original_url` 保留中文原文链接

---

## 九、部署流程

### 当前（Plan A）
```
scraper 抓取 → 人工翻译 → 写 .md → git add → git commit → git push → Vercel 全站重建
```

### 计划中（Plan B）
```
scraper 抓取 → API 自动翻译 → POST /api/articles → 存 Vercel Blob → ISR 增量更新
```
> 详见 `PLAN-B.md`

---

*最后更新：2026-05-31*
