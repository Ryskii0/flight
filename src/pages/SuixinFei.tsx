import { useState, useMemo } from 'react'
import { SUIXINFEI_PRODUCTS, formatWeekdays } from '../data/mockSuixinFei'

const TYPE_LABELS = { depart: '出发', arrive: '到达', roundtrip: '往返', transit: '转机' }
const TYPE_KEYS = ['depart', 'arrive', 'roundtrip', 'transit'] as const

// Simulated: single-trip market price per route
const MARKET_PRICES: Record<string, number> = {
  'PEK-HAK': 380, 'PEK-SYX': 420, 'PEK-XMN': 350,
  'SHA-HAK': 360, 'SHA-CTU': 320,
  'HGH-SZX': 280, 'HGH-CKG': 300, 'HGH-KMG': 350,
  'SHA-SZX': 260, 'SHA-CAN': 240, 'SHA-KMG': 330, 'SHA-XIY': 290,
}

export default function SuixinFei() {
  const [productId, setProductId] = useState(SUIXINFEI_PRODUCTS[0].id)
  const [tab, setTab] = useState<typeof TYPE_KEYS[number]>('depart')
  const [cityFilter, setCityFilter] = useState('')
  const [flownTimes, setFlownTimes] = useState(2)

  const product = SUIXINFEI_PRODUCTS.find(p => p.id === productId)!

  const routes = useMemo(() => {
    let list = product.routes.filter(r => r.type === tab)
    if (cityFilter.trim()) {
      list = list.filter(r =>
        r.originCity.includes(cityFilter) || r.destCity.includes(cityFilter)
      )
    }
    return list
  }, [product, tab, cityFilter])

  // 回本计算
  const avgMarketPrice = useMemo(() => {
    const prices = product.routes.map(r => MARKET_PRICES[`${r.origin}-${r.destination}`] ?? 300)
    return Math.round(prices.reduce((a, b) => a + b, 0) / prices.length)
  }, [product])

  const savedSoFar = flownTimes * avgMarketPrice
  const breakEvenTimes = Math.ceil(product.price / avgMarketPrice)
  const isBreakEven = flownTimes >= breakEvenTimes

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-2xl p-4 text-white">
        <div className="text-base font-bold">随心飞航线解读</div>
        <div className="text-xs opacity-80 mt-1">买了随心飞不知道怎么用？找最值得飞的航线，算清楚回没回本</div>
      </div>

      {/* 产品选择 */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {SUIXINFEI_PRODUCTS.map(p => (
          <button key={p.id} onClick={() => { setProductId(p.id); setFlownTimes(2) }}
            className={`flex-shrink-0 px-3 py-2 rounded-xl border text-left ${productId === p.id ? 'bg-teal-500 text-white border-teal-500' : 'bg-white text-gray-700 border-gray-200'}`}>
            <div className="text-xs font-semibold">{p.name}</div>
            <div className={`text-xs mt-0.5 ${productId === p.id ? 'opacity-80' : 'text-gray-400'}`}>¥{p.price} · 至{p.validUntil.slice(5)}</div>
          </button>
        ))}
      </div>

      {/* 回本计算器 */}
      <div className={`rounded-2xl border p-4 space-y-2 ${isBreakEven ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
        <div className="text-sm font-semibold text-gray-700">权益回本计算</div>
        <div className="text-xs text-gray-500">该套餐航线均价约 ¥{avgMarketPrice}/次，购买价 ¥{product.price}</div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-600">已飞次数</span>
          <div className="flex items-center gap-2">
            <button onClick={() => setFlownTimes(n => Math.max(0, n - 1))} className="w-6 h-6 rounded-full bg-white border border-gray-200 text-sm">-</button>
            <span className="text-sm font-bold w-4 text-center">{flownTimes}</span>
            <button onClick={() => setFlownTimes(n => n + 1)} className="w-6 h-6 rounded-full bg-white border border-gray-200 text-sm">+</button>
          </div>
          <span className="text-xs text-gray-500">已节省 ¥{savedSoFar}</span>
        </div>
        {isBreakEven ? (
          <div className="text-xs text-green-700 font-medium">已回本！每多飞一次额外省 ¥{avgMarketPrice}</div>
        ) : (
          <div className="text-xs text-amber-700">还需飞 <span className="font-bold">{breakEvenTimes - flownTimes}</span> 次回本（共需{breakEvenTimes}次）</div>
        )}
      </div>

      {/* 城市筛选 */}
      <input
        value={cityFilter}
        onChange={e => setCityFilter(e.target.value)}
        placeholder="搜索城市，如：北京、成都"
        className="w-full border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
      />

      {/* Tab */}
      <div className="flex bg-gray-100 rounded-xl p-1 gap-1">
        {TYPE_KEYS.map(t => (
          <button key={t} onClick={() => setTab(t)}
            className={`flex-1 py-1.5 rounded-lg text-xs font-medium transition-colors ${tab === t ? 'bg-white text-teal-600 shadow-sm' : 'text-gray-400'}`}>
            {TYPE_LABELS[t]}({product.routes.filter(r => r.type === t).length})
          </button>
        ))}
      </div>

      {routes.length === 0 ? (
        <div className="text-center text-gray-400 py-8 text-sm">暂无匹配航线</div>
      ) : (
        <div className="space-y-2">
          {routes.map(r => {
            const mktPrice = MARKET_PRICES[`${r.origin}-${r.destination}`] ?? 300
            return (
              <div key={r.id} className="bg-white rounded-xl border border-gray-100 p-3">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-sm font-semibold text-gray-800">{r.originCity} → {r.destCity}</div>
                    <div className="text-xs text-gray-400 mt-0.5">{r.flightNo} · {r.depTime}–{r.arrTime} · {Math.floor(r.duration/60)}h{r.duration%60}m</div>
                    <div className="text-xs text-green-600 mt-0.5">用随心飞飞一次省 ¥{mktPrice}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs bg-teal-100 text-teal-700 px-2 py-0.5 rounded-full font-medium">{formatWeekdays(r.weekdays)}</div>
                    <div className="text-xs text-gray-400 mt-1">首班 {r.firstDate.slice(5)}</div>
                  </div>
                </div>
                {r.visaFree && <div className="text-xs text-blue-500 mt-1">免签</div>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
