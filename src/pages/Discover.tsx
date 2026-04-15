import { useState, useMemo } from 'react'
import { getBestByDestination, type FlightOffer } from '../data/mockFlights'
import PriceMap from '../components/PriceMap'
import FlightCard from '../components/FlightCard'

const ORIGINS = ['SHA', 'PVG', 'HGH', 'NKG']

export default function Discover() {
  const [origins, setOrigins] = useState(['SHA'])
  const [selected, setSelected] = useState<FlightOffer | null>(null)

  const best = useMemo(() => getBestByDestination(origins), [origins])

  const toggle = (o: string) => {
    const next = origins.includes(o) ? origins.filter(x => x !== o) : [...origins, o]
    if (next.length > 0) setOrigins(next)
  }

  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-gray-700">从哪里出发？</div>
      <div className="flex gap-2 flex-wrap">
        {ORIGINS.map(o => (
          <button key={o} onClick={() => toggle(o)}
            className={`px-3 py-1.5 rounded-full text-sm border ${origins.includes(o) ? 'bg-blue-500 text-white border-blue-500' : 'border-gray-200 text-gray-600'}`}>
            {o}
          </button>
        ))}
      </div>

      <div className="text-xs text-gray-400">共找到 {best.length} 个目的地的最优航班，按质价比排序</div>

      {selected ? (
        <div className="space-y-3">
          <button onClick={() => setSelected(null)} className="text-sm text-blue-500">← 返回地图</button>
          <FlightCard flight={selected} />
        </div>
      ) : (
        <PriceMap flights={best} onSelect={setSelected} />
      )}
    </div>
  )
}
