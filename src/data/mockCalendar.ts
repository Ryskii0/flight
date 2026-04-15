export interface DayPrice {
  date: string
  price: number
  level: 'low' | 'medium' | 'high'
}

const BASE_PRICES: Record<string, number> = {
  'SHA-BKK': 800, 'SHA-SIN': 950, 'SHA-KUL': 700, 'SHA-NRT': 1200,
  'SHA-ICN': 600, 'PVG-BKK': 750, 'HGH-BKK': 680, 'SHA-CAN': 380,
}

function level(price: number, base: number): 'low' | 'medium' | 'high' {
  const r = price / base
  return r < 0.82 ? 'low' : r > 1.18 ? 'high' : 'medium'
}

export function getCalendar(route: string): DayPrice[] {
  const base = BASE_PRICES[route] ?? 800
  const today = new Date('2026-04-15')
  return Array.from({ length: 60 }, (_, i) => {
    const d = new Date(today)
    d.setDate(d.getDate() + i + 1)
    const dateStr = d.toISOString().slice(0, 10)
    const dow = d.getDay()
    const dom = d.getDate()
    const weekend = (dow === 5 || dow === 6) ? 1.2 : 1.0
    const promo = (dow === 2 && Math.sin(dom * 7) > 0.6) ? 0.62 : 1.0
    const price = Math.round(base * weekend * promo)
    return { date: dateStr, price, level: level(price, base) }
  })
}

export const AVAILABLE_ROUTES = Object.keys(BASE_PRICES)
