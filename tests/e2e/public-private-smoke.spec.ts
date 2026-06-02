import { expect, test } from '@playwright/test'

test.describe('public website', () => {
  test('public pages load without authentication', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('body')).toContainText('PULSE-R')
    await expect(page.getByRole('link', { name: /staff login/i })).toBeVisible()

    await page.goto('/news')
    await expect(page.locator('body')).toContainText('Published Intelligence')

    await page.goto('/latest')
    await expect(page.locator('body')).toContainText('Latest Published Briefs')

    await page.goto('/public-search')
    await expect(page.locator('body')).toContainText('Search Published Reports')
  })

  test('private dashboard redirects anonymous users to staff login', async ({ page }) => {
    await page.goto('/dashboard')
    await expect(page).toHaveURL(/\/auth\/signin/)
    await expect(page.locator('body')).toContainText('Sign in')
  })
})

test.describe('staff authentication', () => {
  test('seeded analyst can sign in and reach the dashboard', async ({ page }) => {
    await page.goto('/auth/signin')
    await expect(page.locator('input[name="csrfToken"]')).not.toHaveValue('')

    await page.getByLabel('Email').fill(process.env.DEMO_ANALYST_EMAIL ?? 'analyst@pulse-r24.local')
    await page.getByLabel('Password').fill(process.env.DEMO_PASSWORD ?? 'DemoPass123!')
    await page.getByRole('button', { name: /sign in with email/i }).click()

    await expect(page).toHaveURL(/\/dashboard/)
    await expect(page.locator('body')).toContainText('Strategic Intelligence Dashboard')
  })
})
