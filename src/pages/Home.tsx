import { useState, useMemo } from 'react'
import FlexibilityProfile, { type FlexProfile } from '../components/FlexibilityProfile'
import FlightCard from '../components/FlightCard'
import AISearch from '../components/AISearch'
import { getFlightsByOrigins, type FlightOffer } from '../data/mockFlights'

const DEFAULT_PROFILE: FlexProfile = { origins: ['SHA'], regions: [], flexDate: false, maxPrice: null }

const PERSONAS = [
  { label: '均衡', desc: '综合推荐', weights: { price: 0.45, duration: 0.25, stops: 0.20, time: 0.10 } },
  { label: '穷游优先', desc: '价格最重要', weights: { price: 0.70, duration: 0.15, stops: 0.10, time: 0.05 } },
  { label: '时间优先', desc: '直飞+快', weights: { price: 0.20, duration: 0.30, stops: 0.45, time: 0.05 } },
]

function calcPersonaScore(f: FlightOffer, w: typeof PERSONAS[0]['weights']): number {
  const priceScore = Math.max(0, 100 - (f.price / 15))
  const durationScore = Math.max(0, 100 - (f.duration - 60) / 4)
  const stopsScore = f.stops === 0 ? 100 : f.stops === 1 ? 60 : 20
  const timeScore = f.departureTime >= '07:00' && f.departureTime <= '21:00' ? 100 : 50
  return Math.round(priceScore * w.price + durationScore * w.duration + stopsScore * w.stops + timeScore * w.time)
}

export default function Home() {
  const [profile, setProfile] = useState<FlexProfile>(DEFAULT_PROFILE)
  const [selected, setSelected] = useState<FlightOffer | null>(null)
  const [personaIdx, setPersonaIdx] = useState(0)
  const [sortBy, setSortBy] = useState<'score' | 'price'>('score')

  const flights = useMemo(() => {
    let list = getFlightsByOrigins(profile.origins)
    if (profile.regions.length > 0) list = list.filter(f => profile.regions.includes(f.region))
    if (profile.maxPrice) list = list.filter(f => f.price <= profile.maxPrice!)
    if (!profile.flexDate) {
      const cutoff = new Date('2026-04-15')
      cutoff.setDate(cutoff.getDate() + 14)
      list = list.filter(f => new Date(f.date) <= cutoff)
    }
    const w = PERSONAS[personaIdx].weights
    return list
      .sort((a, b) => sortBy === 'price' ? a.price - b.price : calcPersonaScore(b, w) - calcPersonaScore(a, w))
      .slice(0, 12)
  }, [profile, sortBy, personaIdx])

  const extraCount = useMemo(() => {
    if (profile.flexDate) return 0
    const all = getFlightsByOrigins(profile.origins)
    const filtered = profile.regions.length > 0 ? all.filter(f => profile.regions.includes(f.region)) : all
    return filtered.length - flights.length
  }, [profile, flights])

  return (
    <div className="space-y-4">
      {/* 页面功能说明 */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
        <div className="text-xl font-bold">别搜了，让特价来找你</div>
        <div className="text-sm opacity-80 mt-1">告诉我你的预算和假期，匹配全网最高质价比飞行方案</div>
        <div className="mt-3 flex flex-wrap gap-1.5">
          {['灵活度驱动', '质价比排序', '多城市聚合'].map(t => (
            <span key={t} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{t}</span>
          ))}
        </div>
      </div>

      <AISearch onResult={p => setProfile(p)} />

      <FlexibilityProfile profile={profile} onChange={setProfile} />

      {/* 质价比偏好人格 */}
      <div>
        <div className="text-xs text-gray-500 mb-2">你更在意什么？</div>
        <div className="flex gap-2">
          {PERSONAS.map((p, i) => (
            <button key={i} onClick={() => { setPersonaIdx(i); setSortBy('score') }}
              className={`flex-1 py-2 rounded-xl border text-center transition-colors ${personaIdx === i && sortBy === 'score' ? 'bg-blue-500 text-white border-blue-500' : 'bg-white text-gray-600 border-gray-200'}`}>
              <div className="text-xs font-semibold">{p.label}</div>
              <div className={`text-xs mt-0.5 ${personaIdx === i && sortBy === 'score' ? 'opacity-80' : 'text-gray-400'}`}>{p.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {!profile.flexDate && extraCount > 0 && (
        <div className="text-xs text-center text-blue-500 cursor-pointer" onClick={() => setProfile(p => ({ ...p, flexDate: true }))}>
          开启日期灵活，可多看 {extraCount} 个航班 →
        </div>
      )}

      <div className="flex items-center justify-between">
        <div className="text-xs font-semibold text-gray-500">共 {flights.length} 个航班</div>
        <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
          <button onClick={() => setSortBy('score')} className={`text-xs px-2 py-1 rounded-md transition-colors ${sortBy === 'score' ? 'bg-white text-blue-600 shadow-sm font-medium' : 'text-gray-400'}`}>
            质价比排序
          </button>
          <button onClick={() => setSortBy('price')} className={`text-xs px-2 py-1 rounded-md transition-colors ${sortBy === 'price' ? 'bg-white text-blue-600 shadow-sm font-medium' : 'text-gray-400'}`}>
            价格排序
          </button>
        </div>
      </div>

      {sortBy === 'price' && (
        <div className="text-xs text-amber-600 bg-amber-50 rounded-lg px-3 py-2">
          提示：最低价不等于最划算，切换「质价比排序」看综合评分
        </div>
      )}

      {flights.length === 0 ? (
        <div className="text-center text-gray-400 py-8 text-sm">暂无符合条件的航班</div>
      ) : (
        <div className="space-y-3">
          {flights.map(f => (
            <FlightCard key={f.id} flight={f} onClick={() => setSelected(f)} />
          ))}
        </div>
      )}

      {selected && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end" onClick={() => setSelected(null)}>
          <div className="bg-white w-full rounded-t-2xl p-5 space-y-3" onClick={e => e.stopPropagation()}>
            <div className="text-base font-bold">{selected.originCity} → {selected.destCity}</div>
            <div className="text-3xl font-bold text-orange-500">¥{selected.price}</div>
            <div className="text-sm text-gray-500">{selected.date} · {selected.departureTime}–{selected.arrivalTime} · {selected.airline}</div>
            <div className="text-sm text-gray-500">{selected.stops === 0 ? '直飞' : `${selected.stops}次中转`} · {Math.floor(selected.duration/60)}h{selected.duration%60}m</div>
            <div className="bg-blue-50 rounded-xl p-3 text-sm text-blue-700">
              质价比评分 <span className="font-bold">{selected.valueScore}/100</span>：
              价格比均价低{Math.max(0, Math.round((1 - selected.price/selected.avgPrice)*100))}%，
              {selected.stops === 0 ? '直飞加分' : '有中转扣分'}，
              出发时间{selected.departureTime >= '07:00' && selected.departureTime <= '21:00' ? '合理' : '偏早/偏晚'}。
            </div>
            <button className="w-full bg-orange-500 text-white rounded-xl py-3 font-semibold">查看购票渠道</button>
          </div>
        </div>
      )}
    </div>
  )
}
