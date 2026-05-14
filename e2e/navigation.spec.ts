import { test, expect } from '@playwright/test'

test.describe('Navigation', () => {
  test('homepage loads and shows city links', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('text=BIELA NOC')).toBeVisible()
    await expect(page.locator('text=Bratislava')).toBeVisible()
    await expect(page.locator('text=Košice')).toBeVisible()
  })

  test('clicking Bratislava navigates to artists page', async ({ page }) => {
    await page.goto('/')
    await page.click('text=Bratislava')
    await expect(page).toHaveURL(/\/y\d{4}\/ba\/umelci/)
    await expect(page.locator('h1')).toContainText('Umelci')
  })

  test('navbar links work correctly', async ({ page }) => {
    await page.goto('/y2025/ba/umelci')

    await page.click('nav >> text=Mapa')
    await expect(page).toHaveURL('/y2025/ba/mapa')

    await page.click('nav >> text=Partneri')
    await expect(page).toHaveURL('/y2025/ba/partneri')
    await expect(page.locator('h1')).toContainText('Partneri')

    await page.click('nav >> text=Info')
    await expect(page).toHaveURL('/y2025/ba/info')
  })

  test('city switcher changes route', async ({ page }) => {
    await page.goto('/y2025/ba/umelci')
    await page.click('button:has-text("KE")')
    await expect(page).toHaveURL('/y2025/ke/umelci')
  })

  test('year switcher changes route', async ({ page }) => {
    await page.goto('/y2025/ba/umelci')
    await page.selectOption('select', '2024')
    await expect(page).toHaveURL('/y2024/ba/umelci')
  })
})
