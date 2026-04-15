import { calcValueScore } from '../utils/valueScore'

export interface FlightOffer {
  id: string
  origin: string
  originCity: string
  destination: string
  destCity: string
  date: string
  price: number
  duration: number
  stops: number
  airline: string
  departureTime: string
  arrivalTime: string
  valueScore: number
  avgPrice: number
  region: string
  visaFree: boolean
  layoverCity?: string
  layoverDuration?: number // minutes
}

export const AIRPORTS: Record<string, { city: string; name: string; region: string }> = {
  SHA: { city: '上海', name: '虹桥', region: '华东' },
  PVG: { city: '上海', name: '浦东', region: '华东' },
  HGH: { city: '杭州', name: '萧山', region: '华东' },
  NKG: { city: '南京', name: '禄口', region: '华东' },
  BKK: { city: '曼谷', name: '素万那普', region: '东南亚' },
  SIN: { city: '新加坡', name: '樟宜', region: '东南亚' },
  KUL: { city: '吉隆坡', name: '国际机场', region: '东南亚' },
  DPS: { city: '巴厘岛', name: '恩古拉赖', region: '东南亚' },
  HAN: { city: '河内', name: '内排', region: '东南亚' },
  NRT: { city: '东京', name: '成田', region: '东北亚' },
  ICN: { city: '首尔', name: '仁川', region: '东北亚' },
  OKA: { city: '冲绳', name: '那霸', region: '东北亚' },
  CAN: { city: '广州', name: '白云', region: '国内' },
  CTU: { city: '成都', name: '天府', region: '国内' },
  XMN: { city: '厦门', name: '高崎', region: '国内' },
}

const ROUTES: { origin: string; dest: string; basePrice: number; duration: number; stops: number; airline: string; depHour: number; layoverCity?: string; layoverDuration?: number }[] = [
  { origin: 'SHA', dest: 'BKK', basePrice: 800, duration: 315, stops: 0, airline: '东方航空', depHour: 9 },
  { origin: 'SHA', dest: 'SIN', basePrice: 950, duration: 360, stops: 0, airline: '新加坡航空', depHour: 10 },
  { origin: 'SHA', dest: 'KUL', basePrice: 700, duration: 420, stops: 1, airline: '亚洲航空', depHour: 14, layoverCity: '吉隆坡', layoverDuration: 540 },
  { origin: 'SHA', dest: 'DPS', basePrice: 1100, duration: 480, stops: 1, airline: '东方航空', depHour: 8, layoverCity: '新加坡', layoverDuration: 600 },
  { origin: 'SHA', dest: 'HAN', basePrice: 650, duration: 270, stops: 0, airline: '越南航空', depHour: 11 },
  { origin: 'SHA', dest: 'NRT', basePrice: 1200, duration: 195, stops: 0, airline: '全日空', depHour: 9 },
  { origin: 'SHA', dest: 'ICN', basePrice: 600, duration: 120, stops: 0, airline: '韩亚航空', depHour: 7 },
  { origin: 'SHA', dest: 'OKA', basePrice: 850, duration: 150, stops: 0, airline: '东方航空', depHour: 13 },
  { origin: 'PVG', dest: 'BKK', basePrice: 750, duration: 320, stops: 0, airline: '泰国航空', depHour: 22 },
  { origin: 'PVG', dest: 'SIN', basePrice: 900, duration: 365, stops: 0, airline: '东方航空', depHour: 8 },
  { origin: 'HGH', dest: 'BKK', basePrice: 680, duration: 380, stops: 1, airline: '亚洲航空', depHour: 6, layoverCity: '曼谷', layoverDuration: 480 },
  { origin: 'HGH', dest: 'ICN', basePrice: 580, duration: 130, stops: 0, airline: '济州航空', depHour: 10 },
  { origin: 'NKG', dest: 'BKK', basePrice: 720, duration: 350, stops: 1, airline: '东方航空', depHour: 15, layoverCity: '广州', layoverDuration: 300 },
  { origin: 'SHA', dest: 'CAN', basePrice: 380, duration: 150, stops: 0, airline: '南方航空', depHour: 8 },
  { origin: 'SHA', dest: 'CTU', basePrice: 420, duration: 180, stops: 0, airline: '川航', depHour: 9 },
  { origin: 'SHA', dest: 'XMN', basePrice: 350, duration: 120, stops: 0, airline: '厦门航空', depHour: 7 },
]

const VISA_FREE = new Set(['BKK', 'SIN', 'KUL', 'DPS', 'HAN', 'ICN', 'OKA', 'NRT'])

function generatePrice(base: number, dateStr: string): number {
  const d = new Date(dateStr)
  const dow = d.getDay()
  const dom = d.getDate()
  const month = d.getMonth()
  const weekend = (dow === 5 || dow === 6) ? 1.2 : 1.0
  const holiday = (month === 4 && dom <= 5) || (month === 9 && dom <= 7) ? 1.5 : 1.0
  const promo = (dow === 2 && Math.sin(dom * 7) > 0.6) ? 0.62 : 1.0
  return Math.round(base * weekend * holiday * promo)
}

function addMinutes(time: string, mins: number): string {
  const [h, m] = time.split(':').map(Number)
  const total = h * 60 + m + mins
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`
}

let idCounter = 0
export const ALL_FLIGHTS: FlightOffer[] = []

const today = new Date('2026-04-15')
for (const route of ROUTES) {
  const avgPrice = route.basePrice
  for (let i = 0; i < 45; i++) {
    const d = new Date(today)
    d.setDate(d.getDate() + i + 1)
    const dateStr = d.toISOString().slice(0, 10)
    const price = generatePrice(route.basePrice, dateStr)
    const depStr = `${String(route.depHour).padStart(2, '0')}:${String(Math.floor(Math.random() * 4) * 15).padStart(2, '0')}`
    ALL_FLIGHTS.push({
      id: `f${++idCounter}`,
      origin: route.origin,
      originCity: AIRPORTS[route.origin].city,
      destination: route.dest,
      destCity: AIRPORTS[route.dest].city,
      date: dateStr,
      price,
      duration: route.duration,
      stops: route.stops,
      airline: route.airline,
      departureTime: depStr,
      arrivalTime: addMinutes(depStr, route.duration),
      valueScore: calcValueScore(price, route.duration, route.stops, route.depHour),
      avgPrice,
      region: AIRPORTS[route.dest].region,
      visaFree: VISA_FREE.has(route.dest),
      layoverCity: route.layoverCity,
      layoverDuration: route.layoverDuration,
    })
  }
}

export function getFlightsByOrigins(origins: string[]): FlightOffer[] {
  return ALL_FLIGHTS.filter(f => origins.includes(f.origin))
}

export function getBestByDestination(origins: string[]): FlightOffer[] {
  const map = new Map<string, FlightOffer>()
  for (const f of getFlightsByOrigins(origins)) {
    const key = f.destination
    if (!map.has(key) || f.valueScore > map.get(key)!.valueScore) map.set(key, f)
  }
  return [...map.values()].sort((a, b) => b.valueScore - a.valueScore)
}
