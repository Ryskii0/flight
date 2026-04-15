export function calcValueScore(price: number, duration: number, stops: number, departureHour: number): number {
  const priceScore = Math.max(0, 100 - (price / 15))
  const durationScore = Math.max(0, 100 - (duration - 60) / 4)
  const stopsScore = stops === 0 ? 100 : stops === 1 ? 60 : 20
  const timeScore = departureHour >= 7 && departureHour <= 21 ? 100 : 50
  return Math.round(priceScore * 0.45 + durationScore * 0.25 + stopsScore * 0.20 + timeScore * 0.10)
}

export function getPriceLevel(price: number, avgPrice: number): 'low' | 'medium' | 'high' {
  const ratio = price / avgPrice
  if (ratio < 0.8) return 'low'
  if (ratio > 1.2) return 'high'
  return 'medium'
}

export function getPriceDiff(price: number, avgPrice: number): number {
  return Math.round((1 - price / avgPrice) * 100)
}
