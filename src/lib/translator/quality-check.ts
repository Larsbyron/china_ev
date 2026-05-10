/**
 * 翻译质量自动检测
 *
 * 规则来源：SCRAPING-RULES.md 第十节
 * 不合格文章 → 存 drafts 目录，不发布
 */

// ============================================================================
// Types
// ============================================================================

export interface QualityCheckItem {
  name: string
  passed: boolean
  severity: 'error' | 'warning'
  message: string
}

export interface QualityCheckResult {
  passed: boolean
  checks: QualityCheckItem[]
}

// ============================================================================
// 中文字符检测
// ============================================================================

const CHINESE_CHAR_REGEX = /[一-鿿]/g
const RESIDUAL_INSTRUCTION_REGEX = /\b(TITEL|INHALT|Übersetzung|BESCHREIBUNG|IN_DEUTSCHLAND)\s*[：:]/gi
const HTML_TAG_REGEX = /<[^>]+>/g

/**
 * 检测译文中是否含有中文字符
 * 允许括号内的中文（品牌名第一次出现格式：BYD (比亚迪)）
 */
function checkNoChinese(content: string, title: string, description: string): QualityCheckItem {
  // Strip Chinese inside parentheses — intentional brand-name format: BYD (比亚迪)
  const fullText = `${title} ${description} ${content}`.replace(/\([^)]*[一-鿿][^)]*\)/g, '')
  const matches = fullText.match(CHINESE_CHAR_REGEX)
  const count = matches ? matches.length : 0
  // Allow up to 5 stray chars (e.g. model names DeepSeek occasionally leaves in)
  if (count > 5) {
    return {
      name: '无中文残留',
      passed: false,
      severity: 'error',
      message: `发现 ${count} 个中文字符残留（括号外）`,
    }
  }
  return { name: '无中文残留', passed: true, severity: 'error', message: '' }
}

/**
 * 检测译文长度是否在合理范围内（原文 60%-200%）
 */
function checkLengthRatio(translatedContent: string, originalContent: string): QualityCheckItem {
  const translatedLen = translatedContent.replace(HTML_TAG_REGEX, '').trim().length
  const originalLen = originalContent.replace(HTML_TAG_REGEX, '').trim().length

  if (originalLen === 0) {
    return { name: '长度比例', passed: true, severity: 'error', message: '原文为空，跳过长度检查' }
  }

  const ratio = translatedLen / originalLen
  if (ratio < 0.6) {
    return {
      name: '长度比例',
      passed: false,
      severity: 'error',
      message: `译文过短：${translatedLen} 字符 vs 原文 ${originalLen} 字符（${(ratio * 100).toFixed(0)}%）`,
    }
  }
  if (ratio > 2.0) {
    return {
      name: '长度比例',
      passed: false,
      severity: 'error',
      message: `译文过长：${translatedLen} 字符 vs 原文 ${originalLen} 字符（${(ratio * 100).toFixed(0)}%）`,
    }
  }
  return { name: '长度比例', passed: true, severity: 'error', message: '' }
}

/**
 * 检测并自动剥离残留指令词
 */
function checkNoResidualInstructions(title: string, description: string, content: string): {
  check: QualityCheckItem
  cleanedTitle: string
  cleanedDescription: string
  cleanedContent: string
} {
  let cleanedTitle = title
  let cleanedDescription = description
  let cleanedContent = content
  let foundCount = 0

  if (RESIDUAL_INSTRUCTION_REGEX.test(title)) {
    cleanedTitle = title.replace(RESIDUAL_INSTRUCTION_REGEX, '').trim()
    foundCount++
  }
  if (RESIDUAL_INSTRUCTION_REGEX.test(description)) {
    cleanedDescription = description.replace(RESIDUAL_INSTRUCTION_REGEX, '').trim()
    foundCount++
  }
  const contentMatches = content.match(RESIDUAL_INSTRUCTION_REGEX)
  if (contentMatches) {
    cleanedContent = content.replace(RESIDUAL_INSTRUCTION_REGEX, '').trim()
    foundCount += contentMatches.length
  }

  // 重置 regex 的 lastIndex
  RESIDUAL_INSTRUCTION_REGEX.lastIndex = 0

  return {
    check: {
      name: '无残留指令词',
      passed: true, // 自动剥离，总是通过
      severity: 'warning',
      message: foundCount > 0 ? `自动剥离 ${foundCount} 处残留指令词` : '',
    },
    cleanedTitle,
    cleanedDescription,
    cleanedContent,
  }
}

/**
 * 检测 HTML 标签平衡性
 */
function checkHtmlBalance(content: string): QualityCheckItem {
  const openCount = (content.match(/</g) || []).length
  const closeCount = (content.match(/>/g) || []).length
  if (openCount !== closeCount) {
    return {
      name: 'HTML标签平衡',
      passed: false,
      severity: 'error',
      message: `标签不匹配：${openCount} 个 < vs ${closeCount} 个 >`,
    }
  }
  return { name: 'HTML标签平衡', passed: true, severity: 'error', message: '' }
}

/**
 * 检测标题长度
 */
function checkTitleLength(title: string): QualityCheckItem {
  if (title.length > 80) {
    return {
      name: '标题长度 ≤ 80',
      passed: false,
      severity: 'error',
      message: `标题过长：${title.length} 字符（限制 80）`,
    }
  }
  if (title.length < 10) {
    return {
      name: '标题长度 ≥ 10',
      passed: false,
      severity: 'error',
      message: `标题过短：${title.length} 字符`,
    }
  }
  return { name: '标题长度', passed: true, severity: 'warning', message: '' }
}

/**
 * 检测 description 长度
 */
function checkDescriptionLength(description: string): QualityCheckItem {
  const len = description.length
  if (len < 20) {
    return {
      name: '摘要长度 20-200',
      passed: false,
      severity: 'warning',
      message: `摘要过短：${len} 字符`,
    }
  }
  if (len > 250) {
    return {
      name: '摘要长度 20-200',
      passed: false,
      severity: 'warning',
      message: `摘要过长：${len} 字符`,
    }
  }
  return { name: '摘要长度', passed: true, severity: 'warning', message: '' }
}

/**
 * 检测是否提到品牌官方英语名
 */
function checkBrandMentioned(content: string, title: string, brandName?: string): QualityCheckItem {
  if (!brandName) {
    return { name: '品牌名检查', passed: true, severity: 'error', message: '无品牌信息，跳过' }
  }
  const fullText = `${title} ${content}`
  if (!fullText.includes(brandName)) {
    return {
      name: '品牌名出现',
      passed: false,
      severity: 'error',
      message: `品牌"${brandName}"未在译文中出现`,
    }
  }
  return { name: '品牌名出现', passed: true, severity: 'error', message: '' }
}

/**
 * 如果原文含价格，检测译文是否有 € 符号
 */
function checkCurrencyConverted(translatedContent: string, originalContent: string): QualityCheckItem {
  const hasPrice = /[万元]/.test(originalContent)
  if (!hasPrice) {
    return { name: '货币换算', passed: true, severity: 'warning', message: '原文无价格信息' }
  }
  if (!translatedContent.includes('€') && !translatedContent.includes('Euro')) {
    return {
      name: '货币换算',
      passed: false,
      severity: 'error',
      message: '原文有价格信息但译文未发现 € 符号',
    }
  }
  return { name: '货币换算', passed: true, severity: 'error', message: '' }
}

/**
 * 如果原文含续航，检测译文是否有 CLTC/WLTP 标注
 */
function checkRangeStandard(translatedContent: string, originalContent: string): QualityCheckItem {
  const hasRange = /续航/.test(originalContent)
  if (!hasRange) {
    return { name: '续航标准标注', passed: true, severity: 'warning', message: '原文无续航信息' }
  }
  if (!/CLTC|WLTP/i.test(translatedContent)) {
    return {
      name: '续航标准标注',
      passed: false,
      severity: 'warning',
      message: '原文有续航信息但译文未标注 CLTC/WLTP',
    }
  }
  return { name: '续航标准标注', passed: true, severity: 'warning', message: '' }
}

/**
 * 检测文末"本地化模块"是否存在
 */
function checkInDeutschlandSection(content: string): QualityCheckItem {
  if (!/## In Deutschland|## In Europa/.test(content)) {
    return {
      name: '本地化模块',
      passed: false,
      severity: 'error',
      message: '文末缺少"## In Deutschland"或"## In Europa"模块',
    }
  }
  // 提取模块内容，检查长度
  const match = content.match(/## In (?:Deutschland|Europa)(?: nicht erhältlich)?\n\n([\s\S]{30,})/)
  if (!match || match[1].trim().length < 50) {
    return {
      name: '本地化模块长度 ≥ 50',
      passed: false,
      severity: 'warning',
      message: '本地化模块内容过短',
    }
  }
  return { name: '本地化模块', passed: true, severity: 'error', message: '' }
}

// ============================================================================
// 主入口
// ============================================================================

export interface QualityCheckInput {
  title: string
  description: string
  content: string
  originalContent: string
  brandOfficialName?: string
}

export interface QualityCheckOutput {
  passed: boolean
  title: string
  description: string
  content: string
  checks: QualityCheckItem[]
  errorCount: number
  warningCount: number
}

/**
 * 对翻译结果运行全部质量检测
 * 返回通过/不通过及清洗后的内容
 */
export function runQualityCheck(input: QualityCheckInput): QualityCheckOutput {
  const { originalContent, brandOfficialName } = input

  // 先自动剥离残留指令词（会修改内容）
  const { cleanedTitle, cleanedDescription, cleanedContent, check: instructionCheck } =
    checkNoResidualInstructions(input.title, input.description, input.content)

  const checks: QualityCheckItem[] = [
    instructionCheck,
    checkNoChinese(cleanedContent, cleanedTitle, cleanedDescription),
    checkLengthRatio(cleanedContent, originalContent),
    checkHtmlBalance(cleanedContent),
    checkTitleLength(cleanedTitle),
    checkDescriptionLength(cleanedDescription),
    checkBrandMentioned(cleanedContent, cleanedTitle, brandOfficialName),
    checkCurrencyConverted(cleanedContent, originalContent),
    checkRangeStandard(cleanedContent, originalContent),
    checkInDeutschlandSection(cleanedContent),
  ]

  const errors = checks.filter((c) => c.severity === 'error' && !c.passed)
  const warnings = checks.filter((c) => c.severity === 'warning' && !c.passed)

  // 只有 "error" 级别的失败才阻止发布
  const passed = errors.length === 0

  return {
    passed,
    title: cleanedTitle,
    description: cleanedDescription,
    content: cleanedContent,
    checks,
    errorCount: errors.length,
    warningCount: warnings.length,
  }
}

/**
 * 格式化检测结果为人类可读的摘要
 */
export function formatQualityReport(output: QualityCheckOutput): string {
  const lines: string[] = []
  lines.push(output.passed ? '✅ 质量检测通过' : `❌ 质量检测失败（${output.errorCount} 项错误）`)

  for (const check of output.checks) {
    if (check.passed && !check.message) continue
    const icon = check.passed ? '  ✓' : '  ✗'
    const tag = check.severity === 'error' ? '[ERROR]' : '[WARN]'
    lines.push(`${icon} ${tag} ${check.name}${check.message ? ` — ${check.message}` : ''}`)
  }

  return lines.join('\n')
}
