import { test, expect } from '@playwright/test'

test.describe('Artists page', () => {
  test('artists page renders', async ({ page }) => {
    await page.goto('/y2025/ba/umelci')
    // "Umelci" is the page title (there is no body <h1> on this route).
    await expect(page).toHaveTitle(/Umelci/)

    // The edition may or may not have seeded artists — accept either the grid
    // or the explicit empty state, so the test tracks the page working rather
    // than a specific data fixture.
    const artistCards = page.locator('a[href*="/umelci/"]')
    const emptyState = page.getByText(/Žiadni umelci/)
    await expect(artistCards.first().or(emptyState)).toBeVisible()
  })

  test('artist detail page loads', async ({ page }) => {
    await page.goto('/y2025/ba/umelci')

    const firstCard = page.locator('a[href*="/umelci/"]').first()
    test.skip((await firstCard.count()) === 0, 'no artists seeded for this edition')
    await firstCard.click()

    // Client-side navigation with view transitions can take over a second.
    await page.waitForURL(/\/umelci\/\d+/, { timeout: 15000 })
    await expect(page.getByRole('link', { name: /Späť na zoznam/ })).toBeVisible()
  })

  test('back link returns to artist list', async ({ page }) => {
    await page.goto('/y2025/ba/umelci')
    const firstCard = page.locator('a[href*="/umelci/"]').first()
    test.skip((await firstCard.count()) === 0, 'no artists seeded for this edition')
    await firstCard.click()
    await page.waitForURL(/\/umelci\/\d+/, { timeout: 15000 })

    await page.getByRole('link', { name: /Späť na zoznam/ }).click()
    await page.waitForURL(/\/umelci$/, { timeout: 15000 })
  })
})
