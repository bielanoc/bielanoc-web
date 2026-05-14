import { test, expect } from '@playwright/test'

test.describe('Artists page', () => {
  test('renders artist grid with images', async ({ page }) => {
    await page.goto('/y2025/ba/umelci')
    await expect(page.locator('h1')).toContainText('Umelci')

    const artistCards = page.locator('a[href*="/umelci/"]')
    await expect(artistCards.first()).toBeVisible()
    const count = await artistCards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('artist detail page loads', async ({ page }) => {
    await page.goto('/y2025/ba/umelci')

    const firstCard = page.locator('a[href*="/umelci/"]').first()
    await firstCard.click()

    await expect(page).toHaveURL(/\/umelci\/\d+/)
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('text=Späť na zoznam')).toBeVisible()
  })

  test('back link returns to artist list', async ({ page }) => {
    await page.goto('/y2025/ba/umelci')
    const firstCard = page.locator('a[href*="/umelci/"]').first()
    await firstCard.click()

    await page.click('text=Späť na zoznam')
    await expect(page).toHaveURL(/\/umelci$/)
  })
})
