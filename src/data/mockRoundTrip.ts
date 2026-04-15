export interface DayCombo {
  outDate: string
  returnDate: string
  outPrice: number
  returnPrice: number
  total: number
}

const BASE_OUT = 800
const BASE_RET = 780

function price(base: number, dateStr: string): number {
  const d = new Date(dateStr)
  const dow = d.getDay()
  const dom = d.getDate()
  const weekend = (dow === 5 || dow === 6) ? 1.2 : 1.0
  const promo = (dow === 2 && Math.sin(dom * 7) > 0.6) ? 0.65 : 1.0
  return Math.round(base * weekend * promo)
}

// Generate all valid combos within a window
export function getRoundTripMatrix(
  earliestOut: string,
  latestReturn: string,
  minNights: number,
  maxNights: number
): DayCombo[] {
  const combos: DayCombo[] = []
  const start = new Date(earliestOut)
  const end = new Date(latestReturn)

  for (let o = new Date(start); o <= end; o.setDate(o.getDate() + 1)) {
    for (let n = minNights; n <= maxNights; n++) {
      const r = new Date(o)
      r.setDate(r.getDate() + n)
      if (r > end) break
      const outDate = o.toISOString().slice(0, 10)
      const returnDate = r.toISOString().slice(0, 10)
      const outPrice = price(BASE_OUT, outDate)
      const returnPrice = price(BASE_RET, returnDate)
      combos.push({ outDate, returnDate, outPrice, returnPrice, total: outPrice + returnPrice })
    }
  }
  return combos.sort((a, b) => a.total - b.total)
}

// Preset holiday windows
export const HOLIDAY_PRESETS = [
  { label: '五一假期', start: '2026-04-30', end: '2026-05-04' },
  { label: '端午假期', start: '2026-06-19', end: '2026-06-21' },
  { label: '国庆假期', start: '2026-10-01', end: '2026-10-07' },
]
