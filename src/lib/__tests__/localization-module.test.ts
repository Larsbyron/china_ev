import { describe, it, expect } from 'vitest'
import { ensureModuleHeading, buildInDeutschlandSection } from '../translator/brand-glossary'
import { runQualityCheck } from '../translator/quality-check'

const FALLBACK = '## In Europa\n\nDieses Fahrzeug bzw. Modell ist in Europa aktuell nicht offiziell erhältlich.'
const BODY = 'BYD ist in mehreren EU-Ländern erhältlich, der Markteintritt in Deutschland steht noch aus.'

describe('ensureModuleHeading', () => {
  it('已带 ## In Deutschland 的段落原样返回', () => {
    const section = `## In Deutschland\n\n${BODY}`
    expect(ensureModuleHeading(section, FALLBACK)).toBe(section)
  })

  it('只带正文无标题的段落被补上 ## In Deutschland 开头，且正文仍保留', () => {
    const section = BODY
    const result = ensureModuleHeading(section, FALLBACK)
    expect(result.startsWith('## In Deutschland\n\n')).toBe(true)
    expect(result).toContain(BODY)
    // 补完标题后必须能通过 QA 硬门槛的标题判定
    expect(/## In Deutschland|## In Europa/.test(result)).toBe(true)
    expect(result).not.toBe(FALLBACK)
  })

  it('空字符串 / undefined / 纯空白 → 返回 fallback', () => {
    expect(ensureModuleHeading('', FALLBACK)).toBe(FALLBACK)
    expect(ensureModuleHeading(undefined, FALLBACK)).toBe(FALLBACK)
    expect(ensureModuleHeading('   \n  ', FALLBACK)).toBe(FALLBACK)
  })

  it('已含 ## In Europa 的段落不被重复加标题', () => {
    const section = `## In Europa\n\n${BODY}`
    const result = ensureModuleHeading(section, FALLBACK)
    expect(result).toBe(section)
    expect(result.match(/##\s*In /g)?.length).toBe(1)
  })

  it('## 与标题文字之间有空格时也视为已有标题', () => {
    const section = `##   In Deutschland\n\n${BODY}`
    expect(ensureModuleHeading(section, FALLBACK)).toBe(section)
  })

  it('代码模板生成的段落始终带标题（无需兜底）', () => {
    for (const brand of ['BYD', 'Xiaomi', 'Zeekr', 'Unbekannt']) {
      const generated = buildInDeutschlandSection(brand)
      expect(ensureModuleHeading(generated, FALLBACK)).toBe(generated)
      expect(/## In Deutschland|## In Europa/.test(generated)).toBe(true)
    }
  })

  it('端到端：模型自写的无标题段补标题后能通过 QA 硬门槛', () => {
    // 与 quality-check.test.ts 中可通过的固件一致，仅把本地化模块换成"模型自写、无标题"的正文
    const base =
      '## BYD Seal vorgestellt\n\nDer BYD Seal wurde heute in China vorgestellt. Der Preis beginnt bei 18,98 Wan Yuan (ca. 24.300 €).\n\nDie Reichweite beträgt 700 km (CLTC) — entspricht ca. 595 km (WLTP-Schätzwert).\n\n'
    const originalContent =
      '比亚迪海豹今日在中国上市发布，新车售价18.98万元起，最高续航里程达700公里。车辆采用全新海洋美学设计语言，搭载刀片电池和800V高压平台。'.repeat(2)
    const makeInput = (content: string) => ({
      title: 'BYD Seal startet in China für 23.800 €',
      description:
        'Der BYD Seal kommt mit 700 km Reichweite nach China. Der Marktstart in Deutschland ist ungewiss.',
      content,
      originalContent,
      brandOfficialName: 'BYD',
    })

    // 未兜底：缺标题 → QA 判死 → 整篇进 drafts
    const withoutFix = runQualityCheck(makeInput(`${base}${BODY}`))
    expect(withoutFix.passed).toBe(false)
    expect(withoutFix.checks.some((c) => c.name === '本地化模块' && !c.passed)).toBe(true)

    // 兜底后：QA 通过
    const withFix = runQualityCheck(makeInput(`${base}${ensureModuleHeading(BODY, FALLBACK)}`))
    expect(withFix.errorCount).toBe(0)
    expect(withFix.passed).toBe(true)
  })
})
