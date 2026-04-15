import { useState, useMemo } from 'react'
import FlexibilityProfile, { type FlexProfile } from '../components/FlexibilityProfile'
import FlightCard from '../components/FlightCard'
import { getFlightsByOrigins, type FlightOffer } from '../data/mockFlights'

const DEFAULT_PROFILE: FlexProfile = { origins: ['SHA'], regions: [], flexDate: false, maxPrice: null }

const SHOWCASES = [
  {
    label: '穷游党',
    desc: '预算¥700，日期随便，哪便宜去哪',
    profile: { origins: ['SHA', 'PVG', 'HGH'], regions: [], flexDate: true, maxPrice: 700 },
  },
  {
    label: '东南亚控',
    desc: '只看东南亚，免签优先',
    profile: { origins: ['SHA'], regions: ['东南亚'], flexDate: false, maxPrice: null },
  },
  {
    label: '周末说走就走',
    desc: '上海出发，近两周，直飞为主',
    profile: { origins: ['SHA', 'PVG'], regions: ['东北亚', '国内'], flexDate: false, maxPrice: null },
  },
]

export default function Home() {
  const [profile, setProfile] = useState<FlexProfile>(DEFAULT_PROFILE)
  const [selected, setSelected] = useState<FlightOffer | null>(null)
  const [activeShowcase, setActiveShowcase] = useState<number | null>(null)

  const applyShowcase = (i: number) => {
    setActiveShowcase(i)
    setProfile(SHOWCASES[i].profile)
  }

  const flights = useMemo(() => {
    let list = getFlightsByOrigins(profile.origins)
    if (profile.regions.length > 0) list = list.filter(f => profile.regions.includes(f.region))
    if (profile.maxPrice) list = list.filter(f => f.price <= profile.maxPrice!)
    if (!profile.flexDate) {
      // show only next 14 days
      const cutoff = new Date('2026-04-15')
      cutoff.setDate(cutoff.getDate() + 14)
      list = list.filter(f => new Date(f.date) <= cutoff)
    }
    return list.sort((a, b) => b.valueScore - a.valueScore).slice(0, 12)
  }, [profile])

  const extraCount = useMemo(() => {
    if (profile.flexDate) return 0
    const all = getFlightsByOrigins(profile.origins)
    const filtered = profile.regions.length > 0 ? all.filter(f => profile.regions.includes(f.region)) : all
    return filtered.length - flights.length
  }, [profile, flights])

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl p-5 text-white">
        <div className="text-xl font-bold">发现你的下一次旅行</div>
        <div className="text-sm opacity-80 mt-1">告诉我你愿意灵活的地方，我来找最划算的机票</div>
      </div>

      <div>
        <div className="text-xs text-gray-400 mb-2">场景演示</div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {SHOWCASES.map((s, i) => (
            <button
              key={i}
              onClick={() => applyShowcase(i)}
              className={`flex-shrink-0 px-3 py-2 rounded-xl border text-left transition-colors ${
                activeShowcase === i
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-700 border-gray-200'
              }`}
            >
              <div className="text-xs font-semibold">{s.label}</div>
              <div className={`text-xs mt-0.5 ${activeShowcase === i ? 'opacity-80' : 'text-gray-400'}`}>{s.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <FlexibilityProfile profile={profile} onChange={p => { setActiveShowcase(null); setProfile(p) }} />

      {!profile.flexDate && extraCount > 0 && (
        <div
          className="text-xs text-center text-blue-500 cursor-pointer"
          onClick={() => setProfile(p => ({ ...p, flexDate: true }))}
        >
          开启日期灵活，可多看 {extraCount} 个航班 →
        </div>
      )}

      <div className="text-xs font-semibold text-gray-500">今日精选 · 按质价比排序</div>

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
            <button className="w-full bg-orange-500 text-white rounded-xl py-3 font-semibold">
              查看购票渠道
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
