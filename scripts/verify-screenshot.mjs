import { chromium } from 'playwright'

const outDir = 'C:/Users/admin/AppData/Local/Temp/claude/d--TIM-V6---Copy/f1e06e6f-68b8-4e10-9efb-1fa48f513cc0/scratchpad'

const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } })
await page.goto('http://localhost:5173', { waitUntil: 'networkidle' })

// Scroll through the whole page in steps so whileInView reveals actually fire,
// same as a real visitor scrolling.
const height = await page.evaluate(() => document.body.scrollHeight)
for (let y = 0; y < height; y += 500) {
  await page.evaluate((y) => window.scrollTo(0, y), y)
  await page.waitForTimeout(120)
}
await page.evaluate(() => window.scrollTo(0, 0))
await page.waitForTimeout(400)

await page.screenshot({ path: `${outDir}/verified-full.png`, fullPage: true })

const errors = []
page.on('console', (msg) => {
  if (msg.type() === 'error') errors.push(msg.text())
})
await page.reload({ waitUntil: 'networkidle' })
await page.waitForTimeout(500)
console.log('console errors:', errors)

await browser.close()
