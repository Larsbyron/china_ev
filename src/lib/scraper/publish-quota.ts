/**
 * 每轮发布配额（2026-10-23 老大定：每轮最多 3 篇）。
 *
 * 为什么要有这道闸：站点已有 3,200+ 篇近重复机器翻译稿，GSC 实测 28 天只有 1 点击 /
 * 369 曝光 —— 瓶颈是曝光与内容独特性，不是产量。继续每轮 6–16 篇只会同时推高
 * DeepSeek 成本并加深「无独特价值」的判定。省下的配额转做原创。
 *
 * 口径（重要，别改成「发布成功数」）：配额计的是**进入翻译的篇数**。
 * 翻译 / QA / 责任编辑审校的 LLM 调用在成败两种结局上都已真实发生，若用发布成功数
 * 计配额，失败篇会不断「退还」额度 → 成本照样翻倍，闸门等于没有。
 */

export const DEFAULT_MAX_ARTICLES_PER_RUN = 3

export interface PublishQuota {
  /** 本轮允许进入翻译的篇数（≥1） */
  readonly limit: number
  /** 已占用额度（= 已进入翻译的篇数） */
  used: number
  /** 因配额被拦下的候选数（只统计，便于日志与测试） */
  blocked: number
}

/**
 * 解析每轮上限。来源优先级：显式参数 > 环境变量 MAX_ARTICLES_PER_RUN > 默认 3。
 * 非法值（非数字 / 0 / 负数）一律回落默认值 —— 绝不把 0 当成「无限」或「全禁」。
 */
export function resolveMaxArticlesPerRun(raw?: string): number {
  const value = raw ?? process.env.MAX_ARTICLES_PER_RUN
  if (value === undefined || value.trim() === '') return DEFAULT_MAX_ARTICLES_PER_RUN
  const parsed = Number.parseInt(value.trim(), 10)
  if (!Number.isFinite(parsed) || parsed <= 0) return DEFAULT_MAX_ARTICLES_PER_RUN
  return parsed
}

export function createPublishQuota(limit: number): PublishQuota {
  const safe = Number.isFinite(limit) && limit >= 1 ? Math.floor(limit) : DEFAULT_MAX_ARTICLES_PER_RUN
  return { limit: safe, used: 0, blocked: 0 }
}

/**
 * 申请一个翻译名额。返回 false = 本轮额度已满，调用方必须停止该源的循环。
 */
export function tryAcquirePublishSlot(quota: PublishQuota): boolean {
  if (quota.used >= quota.limit) {
    quota.blocked += 1
    return false
  }
  quota.used += 1
  return true
}

export function isQuotaExhausted(quota: PublishQuota): boolean {
  return quota.used >= quota.limit
}
