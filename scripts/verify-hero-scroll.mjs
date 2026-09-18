import { chromium } from 'playwright'

const outDir = 'C:/Users/admin/AppData/Local/Temp/claude/d--TIM-V6---Copy/f1e06e6f-68b8-4e10-9efb-1fa48f513cc0/scratchpad'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
const errors = []
page.on('console', (m) => m.type() === 'error' && errors.push(m.text()))
page.on('pageerror', (e) => errors.push(String(e)))

await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })
await page.waitForTimeout(200)

await page.screenshot({ path: `${outDir}/scroll-0.png` })

// The pinned wrapper is 220vh tall -> ~1188px of scroll distance drives progress 0-1 at 900px viewport.
const steps = [150, 300, 500, 700, 900, 1050, 1188, 1400]
for (const y of steps) {
  await page.evaluate((y) => window.scrollTo(0, y), y)
  await page.waitForTimeout(150)
  await page.screenshot({ path: `${outDir}/scroll-${y}.png` })
}

console.log('console errors:', errors)
await browser.close()
