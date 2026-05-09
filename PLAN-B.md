# E-Auto Blog 全自动管线改造方案 (Plan B)

**目标：** 爬取 → API翻译 → 存Vercel Blob → 前端ISR动态渲染。不再git push发文章。

**当前状态：** chinaev.vercel.app (Vercel Hobby), 源码在 GitHub, 内容在 `content/posts/*.md`

---

## 架构对比

```
【现在】
cron → scraper 爬中文 → Hermes手动翻译 → 写markdown → git push → Vercel全站重建
       问题：依赖人工、每篇push、全站慢

【方案B】
cron → scraper爬 → 调MiniMax API翻译 → POST /api/articles → 存Vercel Blob → ISR增量更新
      优势：全自动、不push、秒级上线、有网页管理
```

---

## 分步实施

### Step 1: Vercel Blob 存储

在 Vercel 控制台创建 Blob Store（免费 5GB）。

```bash
# Vercel Dashboard → Storage → Create → Blob → 命名 "eauto-articles"
```

环境变量会自动生成 `BLOB_READ_WRITE_TOKEN`。

文章存储结构：
```
blob://articles/index.json          # 文章索引 [{slug, title, date, ...}]
blob://articles/{slug}.json         # 单篇文章完整内容
```

---

### Step 2: API 端点 `/api/articles`

新建文件 `src/app/api/articles/route.ts`：

```typescript
// POST /api/articles — scraper 调用，写入文章
// GET /api/articles — 前端调用，获取文章列表
// PUT /api/articles/[slug] — 更新单篇（管理后台用）
// DELETE /api/articles/[slug] — 删除单篇
```

**POST 请求体（scraper 发的）：**
```json
{
  "title": "德语标题",
  "slug": "german-slug",
  "description": "德语摘要",
  "content": "HTML正文",
  "source": "Autohome NewEnergy",
  "brand": "BYD",
  "image": "https://...",
  "tags": ["tag1", "tag2"],
  "original_url": "https://...",
  "read_time_minutes": 5,
  "date": "2026-05-09T07:00:00+02:00"
}
```

**验证：** 用 API key 保护（`Authorization: Bearer xxx`），防止外部滥用。

---

### Step 3: Scraper 改造

在 `scripts/hermes-translate.py` 加两个新命令：

```bash
# translate — 只抓取+翻译（输出JSON，不发Vercel）
python3 scripts/hermes-translate.py translate --source autohome_newenergy --max 5

# auto — 全自动：抓取→翻译→POST到Vercel
python3 scripts/hermes-translate.py auto --source autohome_newenergy --max 5
```

**translate 命令逻辑：**

1. 调现有 `fetch_articles()` 拿到中文文章（title, content, url, image...）
2. 对每篇文章调 MiniMax Anthropic API 翻译：
   ```python
   # 用项目 .env 里已有的 ANTHROPIC_API_KEY + ANTHROPIC_BASE_URL
   # Base URL: https://api.minimax.io/anthropic/v1
   # Model: claude-sonnet-4-20250514（或其他可用模型）
   ```
3. 翻译 Prompt：
   ```
   把以下中文汽车新闻翻译成德语。汽车媒体风格，品牌名/人名保留原文。
   返回JSON：{"title": "...", "description": "...", "content": "HTML格式正文", "tags": ["tag1"]}
   ```
4. 输出 JSON 到 stdout

**auto 命令逻辑：**

1. 跑 translate
2. 遍历每篇翻译结果，POST 到 `https://chinaev.vercel.app/api/articles`
3. 打印结果

**关于 API KEY：** 用项目现有 `.env`：
```bash
ANTHROPIC_API_KEY=已配好
ANTHROPIC_BASE_URL=https://api.minimax.io/anthropic/v1
VERCEL_ARTICLE_API_KEY=新建一个（用来保护 /api/articles）
NEXT_PUBLIC_SITE_URL=https://chinaev.vercel.app
```

---

### Step 4: 前端数据源切换

**现状：** 所有页面从 `content/posts/*.md` 读文章（`lib/articles.ts` 里的 `getAllArticles()` 读文件系统）

**改成：** 从 Vercel Blob 读

**改法：** 新建 `lib/articles-blob.ts`，跟现有一样的接口签名：
```typescript
export async function getAllArticles(): Promise<Article[]>
export async function getArticleBySlug(slug: string): Promise<Article | null>
export async function getArticlesByBrand(brand: string): Promise<Article[]>
```

内部实现：
1. 先读 `blob://articles/index.json` 拿索引
2. 根据请求读具体 `blob://articles/{slug}.json`

然后所有页面文件（`page.tsx`）把 import 从 `@/lib/articles` 改成 `@/lib/articles-blob` 就行。

**ISR 配置：**
```typescript
// 每个页面加 revalidate
export const revalidate = 3600 // 每小时重新验证
```

这样新增文章后，最多1小时自动更新，不需要重建全站。

---

### Step 5: 管理后台 `/admin`

新建 `src/app/admin/page.tsx`：

功能：
- 文章列表（标题、来源、日期、状态）
- 删除文章
- 手动添加文章（直接写markdown → 翻译 → 发布）

用简单的 API key 登录保护（不搞复杂认证）。

---

### Step 6: Cron 替换

把现有的 cron prompt 替换成：

```
每天 7:00 执行：
cd /Users/lebin/Projects/E-Auto Blog
python3 scripts/hermes-translate.py auto --source autohome_newenergy --max 8
python3 scripts/hermes-translate.py auto --source chooseauto --max 5
python3 scripts/hermes-translate.py auto --source nev_ofweek --max 5
python3 scripts/hermes-translate.py auto --source autohome_all --max 5
```

---

## 文件清单

| 文件 | 操作 | 说明 |
|------|------|------|
| `src/app/api/articles/route.ts` | 新建 | POST/GET 文章 API |
| `src/lib/articles-blob.ts` | 新建 | Blob 数据源替代 markdown |
| `src/app/admin/page.tsx` | 新建 | 管理后台 |
| `src/app/**/page.tsx` | 改 import | `@/lib/articles` → `@/lib/articles-blob` |
| `scripts/hermes-translate.py` | 改 | 加 translate/auto 命令 |
| `.env` | 改 | 加 `VERCEL_ARTICLE_API_KEY` |
| `tsconfig.json` | 不改 | 已有 Vercel Blob SDK 类型 |

---

## 依赖

```bash
npm install @vercel/blob    # Vercel Blob SDK（前端用）
pip install anthropic       # Python Anthropic SDK（scraper用，可能已装）
```

---

## 执行顺序

1. **Vercel Dashboard** → 创建 Blob Store → 拿到 Token
2. 写 `src/app/api/articles/route.ts` → 部署测试 POST/GET
3. 写 `src/lib/articles-blob.ts` → 验证能读 Blob
4. 改 scraper 加 `translate` 命令 → 跑一遍验证翻译质量
5. 改 scraper 加 `auto` 命令 → 端到端测试
6. 切前端 import → 验证网站正常
7. 写 `/admin` 管理页
8. 改 cron → 全自动运行
9. 等域名开通 → Vercel 绑 `china-ev.de` → 改 `NEXT_PUBLIC_SITE_URL`

---

## 风险 & 注意

- **MiniMax API 费用：** 每篇翻译约 0.01-0.05€（取决于文章长度），每天5篇 ≈ 1-7€/月
- **Blob 读写次数：** 免费层100万次/月，完全够
- **翻译质量：** API 翻译可能偶尔不如人工，需要 `/admin` 给 Boss 改的机会
- **Vercel 降级：** 如果团队 Pro 降 Hobby，注意带宽限制（100GB/月，博客够用）
- **旧文章：** Plan B 上线后可以一次性把 `content/posts/*.md` 导入 Blob
