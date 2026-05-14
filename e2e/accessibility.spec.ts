import { test, expect } from '@playwright/test'
import AxeBuilder from '@axe-core/playwright'

test.describe('Accessibility', () => {
  test('homepage has no critical a11y violations', async ({ page }) => {
    await page.goto('/')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )
    expect(critical, formatViolations(critical)).toHaveLength(0)
  })

  test('artists page has no critical a11y violations', async ({ page }) => {
    await page.goto('/y2025/ba/umelci')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )
    expect(critical, formatViolations(critical)).toHaveLength(0)
  })

  test('map page has no critical a11y violations', async ({ page }) => {
    await page.goto('/y2025/ba/mapa')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )
    expect(critical, formatViolations(critical)).toHaveLength(0)
  })

  test('info page has no critical a11y violations', async ({ page }) => {
    await page.goto('/y2025/ba/info')
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze()

    const critical = results.violations.filter(
      (v) => v.impact === 'critical' || v.impact === 'serious'
    )
    expect(critical, formatViolations(critical)).toHaveLength(0)
  })
})

function formatViolations(violations: { impact?: string | null; id: string; description: string; nodes: unknown[] }[]): string {
  return violations
    .map((v) => `[${v.impact}] ${v.id}: ${v.description} (${v.nodes.length} nodes)`)
    .join('\n')
}
