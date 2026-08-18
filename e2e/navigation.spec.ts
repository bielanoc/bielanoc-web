import { test, expect, type Page } from '@playwright/test'

// The nav lives in a slide-in dialog that is ALWAYS in the DOM — it is moved
// off-screen with `translate-x-full` and slid in with `translate-x-0`. Because
// a transform-hidden element still reports as "visible" to Playwright, we must
// wait for the panel to actually be on-screen (translate-x-0) before clicking
// anything inside it, otherwise clicks land on an off-viewport target.
const openMenu = async (page: Page) => {
  await page.getByRole('button', { name: 'Open menu' }).click()
  const dialog = page.getByRole('dialog', { name: 'Navigácia' })
  await expect(dialog).toHaveClass(/translate-x-0/)
  await expect(page.getByRole('button', { name: 'Close menu' })).toBeVisible()
}

// Client-side navigations (with view transitions) can take north of a second,
// so wait explicitly rather than relying on toHaveURL's short default timeout.
const expectURL = (page: Page, url: string | RegExp) =>
  page.waitForURL(url, { timeout: 15000 })

test.describe('Navigation', () => {
  test('homepage loads and shows city links', async ({ page }) => {
    await page.goto('/')
    // The logo is an SVG image with an accessible name, not literal text.
    await expect(page.getByRole('link', { name: 'Biela Noc' }).first()).toBeVisible()
    // In festival mode the homepage is a split-screen of two city links whose
    // accessible name comes from the city image alt. Scoping by role+name
    // avoids matching the always-present (off-screen) nav links in the dialog.
    await expect(page.getByRole('link', { name: 'Bratislava' })).toBeVisible()
    await expect(page.getByRole('link', { name: 'Košice' })).toBeVisible()
  })

  test('clicking Bratislava navigates to artists page', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('link', { name: 'Bratislava' }).click()
    await expectURL(page, /\/y\d{4}\/ba\/umelci/)
  })

  test('menu links work correctly', async ({ page }) => {
    await page.goto('/y2025/ba/umelci')

    await openMenu(page)
    await page.locator('nav a[href="/y2025/ba/mapa"]').click()
    await expectURL(page, /\/y2025\/ba\/mapa/)

    await openMenu(page)
    await page.locator('nav a[href="/y2025/ba/partneri"]').click()
    await expectURL(page, /\/y2025\/ba\/partneri/)

    await openMenu(page)
    await page.locator('nav a[href="/y2025/ba/info"]').click()
    await expectURL(page, /\/y2025\/ba\/info/)
  })

  test('city switcher changes route', async ({ page }) => {
    await page.goto('/y2025/ba/umelci')
    await openMenu(page)
    // City switch buttons are labelled by city name, not code.
    await page.locator('nav').getByRole('button', { name: 'Košice' }).click()
    await expectURL(page, /\/y2025\/ke\/umelci/)
  })

  test('year switcher changes route', async ({ page }) => {
    await page.goto('/y2025/ba/umelci')
    await openMenu(page)
    await page.selectOption('nav select', '2024')
    await expectURL(page, /\/y2024\/ba\/umelci/)
  })
})
