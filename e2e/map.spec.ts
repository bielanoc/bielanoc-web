import { test, expect } from '@playwright/test'

test.describe('Map page', () => {
  test('renders map and program list', async ({ page }) => {
    await page.goto('/y2025/ba/mapa')

    const mapContainer = page.locator('.leaflet-container')
    await expect(mapContainer).toBeVisible()

    const listItems = page.locator('ul >> li')
    const count = await listItems.count()
    expect(count).toBeGreaterThan(0)
  })

  test('clicking a list item highlights it', async ({ page }) => {
    await page.goto('/y2025/ba/mapa')

    const firstButton = page.locator('ul >> li >> button').first()
    await firstButton.click()

    await expect(firstButton).toHaveClass(/border-l-accent/)
  })

  test('clicking same list item deselects it', async ({ page }) => {
    await page.goto('/y2025/ba/mapa')

    const firstButton = page.locator('ul >> li >> button').first()
    await firstButton.click()
    await firstButton.click()

    await expect(firstButton).not.toHaveClass(/border-l-accent/)
  })

  test('map markers are visible', async ({ page }) => {
    await page.goto('/y2025/ba/mapa')

    const markers = page.locator('.custom-marker')
    await expect(markers.first()).toBeVisible()
    const count = await markers.count()
    expect(count).toBeGreaterThan(0)
  })
})
