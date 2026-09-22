import { appendFileSync } from 'fs'
import { resolve } from 'path'

const RUNLOG_FILE = resolve(process.cwd(), '.runlog.jsonl')

/**
 * 追加一行任意结构化日志到 .runlog.jsonl。
 * 永不抛出：日志失败绝不能影响流水线本身。
 * 该文件已被 daily.yml 提交回仓库，因此是跨运行可读的持久状态。
 */
export function appendRunLog(entry: Record<string, unknown>): void {
  try {
    appendFileSync(
      RUNLOG_FILE,
      JSON.stringify({ ts: new Date().toISOString(), ...entry }) + '\n',
      'utf-8'
    )
  } catch {
    /* non-fatal */
  }
}
