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
      <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-4 text-white">
        <div className="text-base font-bold">多出发城市聚合搜索</div>
        <div className="text-xs opacity-80 mt-1">携程需要分别搜3次，这里同时比较所有出发城市，自动找最优组合</div>
      </div>

      <div>
        <div className="text-xs text-gray-500 mb-2">选择出发城市（可多选）</div>
        <div className="flex gap-2 flex-wrap">
          {ORIGINS.map(o => (
            <button key={o} onClick={() => toggle(o)}
              className={`px-3 py-1.5 rounded-full text-sm border ${origins.includes(o) ? 'bg-purple-500 text-white border-purple-500' : 'border-gray-200 text-gray-600'}`}>
              {o}
            </button>
          ))}
        </div>
        {origins.length > 1 && (
          <div className="text-xs text-purple-600 mt-2 bg-purple-50 rounded-lg px-3 py-1.5">
            已聚合 {origins.length} 个城市出发的航班，按质价比取每个目的地最优
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400">共 {best.length} 个目的地 · 每个目的地取质价比最高航班</div>

      {selected ? (
        <div className="space-y-3">
          <button onClick={() => setSelected(null)} className="text-sm text-purple-500">← 返回地图</button>
          <FlightCard flight={selected} />
        </div>
      ) : (
        <PriceMap flights={best} onSelect={setSelected} />
      )}
    </div>
  )
}
