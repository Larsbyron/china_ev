/**
 * 截断错误（finish_reason=length）的共享定义。
 *
 * 单独一个模块：translator/index.ts 与 translator/editorial-review.ts 都要用同一个 class，
 * 而 index.ts 已经 import 了 editorial-review.ts（buildRevisionPrompt）。
 * 把 class 放在其中任一方都会形成循环依赖，求值顺序一变 instanceof 就可能拿到 undefined。
 *
 * 为什么把截断当错误而不是「成功但短」：
 * 7d 实测表明 43% 的截断调用仍返回非空 content —— 半截译文/半截reviews会静默流进
 * QA、重翻和发布路径，比直接失败危险得多。
 */
export class TruncatedResponseError extends Error {
  /** 本次调用使用的 max_tokens 预算，便于事后判断是不是预算不够 */
  readonly budget: number

  constructor(message: string, budget: number) {
    super(message)
    this.name = 'TruncatedResponseError'
    this.budget = budget
  }
}
