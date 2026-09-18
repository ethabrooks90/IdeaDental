import { chromium } from 'playwright'

const outDir = 'C:/Users/admin/AppData/Local/Temp/claude/d--TIM-V6---Copy/f1e06e6f-68b8-4e10-9efb-1fa48f513cc0/scratchpad'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 390, height: 844 } })
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(300)
await page.screenshot({ path: `${outDir}/mobile-closed.png` })

// Header is intentionally hidden/non-interactive during the hero intro —
// scroll past the reveal point (844 * HERO_WRAPPER_VH * HERO_EXPAND_END) before using the nav.
await page.evaluate(() => window.scrollTo(0, 844 * 3.2 * 0.65 + 100))
await page.waitForTimeout(300)
await page.click('button[aria-label="Open menu"]')
await page.waitForTimeout(400)
await page.screenshot({ path: `${outDir}/mobile-menu-open.png` })

await browser.close()
