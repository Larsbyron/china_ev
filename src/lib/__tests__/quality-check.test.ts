import { describe, it, expect } from 'vitest'
import { runQualityCheck, formatQualityReport } from '../translator/quality-check'

const LONG_CN = '比亚迪海豹今日在中国上市发布，新车售价18.98万元起，最高续航里程达700公里。车辆采用全新海洋美学设计语言，搭载刀片电池和800V高压平台。同时配备了激光雷达和高阶智能驾驶辅助系统，预计将于下月开始交付。'.repeat(2)

function makeInput(overrides: Partial<{
  title: string
  description: string
  content: string
  originalContent: string
  brandOfficialName: string
}> = {}) {
  return {
    title: 'BYD Seal startet in China für 23.800 €',
    description: 'Der BYD Seal kommt mit 700 km Reichweite nach China. Marktstart in Deutschland ungewiss.',
    content: '## BYD Seal vorgestellt\n\nDer BYD Seal wurde heute in China vorgestellt. Der Preis beginnt bei 18,98 Wan Yuan (ca. 24.300 €).\n\nDie Reichweite beträgt 700 km (CLTC) — entspricht ca. 595 km (WLTP-Schätzwert).\n\n## In Deutschland\n\nBYD ist bereits auf dem deutschen Markt vertreten. Der Seal wird voraussichtlich 2026 auch in Deutschland erhältlich sein.',
    originalContent: LONG_CN,
    brandOfficialName: 'BYD',
    ...overrides,
  }
}

describe('runQualityCheck', () => {
  it('通过合格的翻译', () => {
    const result = runQualityCheck(makeInput())
    expect(result.passed).toBe(true)
    expect(result.errorCount).toBe(0)
  })

  it('检测中文残留', () => {
    const result = runQualityCheck(makeInput({
      title: 'BYD 海豹 Seal startet in China',
    }))
    expect(result.passed).toBe(false)
    const chineseCheck = result.checks.find((c) => c.name === '无中文残留')
    expect(chineseCheck?.passed).toBe(false)
  })

  it('检测标题过长', () => {
    const result = runQualityCheck(makeInput({
      title: 'A'.repeat(100),
    }))
    expect(result.passed).toBe(false)
  })

  it('检测标题过短', () => {
    const result = runQualityCheck(makeInput({
      title: 'Hi',
    }))
    expect(result.passed).toBe(false)
  })

  it('自动剥离残留指令词', () => {
    const result = runQualityCheck(makeInput({
      title: 'TITEL: BYD Seal vorgestellt',
      content: 'INHALT: Der BYD Seal wurde heute in China vorgestellt. Der Preis beginnt bei 18,98 Wan Yuan (ca. 24.300 €).\n\nDie Reichweite beträgt 700 km (CLTC) — entspricht ca. 595 km (WLTP-Schätzwert).\n\n## In Deutschland\n\nBYD ist bereits auf dem deutschen Markt vertreten.',
    }))
    expect(result.title).toBe('BYD Seal vorgestellt')
    expect(result.content).not.toContain('INHALT:')
  })

  it('检测 HTML 标签不平衡', () => {
    const result = runQualityCheck(makeInput({
      content: '<div>Text mit unbalanciertem Tag',
    }))
    // <div> has both < and > so balanced. Need truly unbalanced.
    // Let's use < without >
    const result2 = runQualityCheck(makeInput({
      content: 'Text mit < ohne schließende Klammer',
    }))
    expect(result2.passed).toBe(false)
    const htmlCheck = result2.checks.find((c) => c.name === 'HTML标签平衡')
    expect(htmlCheck?.passed).toBe(false)
  })

  it('检测译文过短', () => {
    const longOriginal = '这是一篇很长的文章，包含大量内容需要翻译处理，但译文非常简短不足百分之六十。'.repeat(10)
    const result = runQualityCheck(makeInput({
      content: 'Kurzer Text.',
      originalContent: longOriginal,
    }))
    expect(result.passed).toBe(false)
    const ratioCheck = result.checks.find((c) => c.name === '长度比例')
    expect(ratioCheck?.passed).toBe(false)
  })

  it('检测品牌名未出现', () => {
    const result = runQualityCheck(makeInput({
      brandOfficialName: 'XPeng',
      title: 'Neuer Elektro-SUV vorgestellt',
      content: 'Ein neuer Elektro-SUV wurde vorgestellt. Kein Markenname hier.\n\n## In Deutschland\n\nXPeng ist in mehreren nordeuropäischen Ländern vertreten.',
    }))
    // Note: XPeng IS in content now (In Deutschland section) — let's make sure it's truly missing
    const result2 = runQualityCheck(makeInput({
      brandOfficialName: 'XPeng',
      title: 'Neuer Elektro-SUV vorgestellt',
      content: 'Ein neuer Elektro-SUV wurde vorgestellt. Kein Markenname hier.\n\n## In Deutschland\n\nDieser Hersteller ist in mehreren nordeuropäischen Ländern vertreten.',
    }))
    const brandCheck = result2.checks.find((c) => c.name === '品牌名出现')
    expect(brandCheck?.passed).toBe(false)
  })

  it('无品牌信息时跳过品牌检查', () => {
    const result = runQualityCheck(makeInput({
      brandOfficialName: undefined,
    }))
    const brandCheck = result.checks.find((c) => c.name === '品牌名检查')
    expect(brandCheck?.passed).toBe(true)
  })

  it('原文有价格时检测 € 符号', () => {
    const result = runQualityCheck(makeInput({
      originalContent: '售价18.98万元起',
      content: 'Preis: 18,98 万元.',  // 没有 € 符号
    }))
    const currencyCheck = result.checks.find((c) => c.name === '货币换算')
    expect(currencyCheck?.passed).toBe(false)
  })

  it('原文无价格时跳过货币检查', () => {
    const result = runQualityCheck(makeInput({
      originalContent: '新车发布，外观设计出色。',
    }))
    const currencyCheck = result.checks.find((c) => c.name === '货币换算')
    expect(currencyCheck?.passed).toBe(true)
  })

  it('检测文末缺少本地化模块', () => {
    const result = runQualityCheck(makeInput({
      content: 'Der BYD Seal wurde vorgestellt.',
    }))
    const moduleCheck = result.checks.find((c) => c.name === '本地化模块')
    expect(moduleCheck?.passed).toBe(false)
  })

  it('检测摘要过短', () => {
    const result = runQualityCheck(makeInput({
      description: 'Kurz.',
    }))
    const descCheck = result.checks.find((c) => c.name === '摘要长度 20-200')
    expect(descCheck?.passed).toBe(false)
  })

  it('原文有续航时检测 CLTC/WLTP 标注', () => {
    const result = runQualityCheck(makeInput({
      originalContent: '续航700公里',
      content: 'Reichweite: 700 km.',  // 没有 CLTC/WLTP 标注
    }))
    const rangeCheck = result.checks.find((c) => c.name === '续航标准标注')
    expect(rangeCheck?.passed).toBe(false)
  })
})

describe('formatQualityReport', () => {
  it('产生可读的摘要', () => {
    const input = makeInput()
    const result = runQualityCheck(input)
    const report = formatQualityReport(result)
    expect(report).toContain('质量检测通过')
    expect(typeof report).toBe('string')
  })
})
