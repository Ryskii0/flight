import { useState, useMemo } from 'react'
import { getRoundTripMatrix, HOLIDAY_PRESETS } from '../data/mockRoundTrip'

export default function RoundTrip() {
  const [preset, setPreset] = useState(0)
  const [extraDays, setExtraDays] = useState(1)
  const [route] = useState('SHA → BKK')

  const holiday = HOLIDAY_PRESETS[preset]
  const holidayDays = Math.round(
    (new Date(holiday.end).getTime() - new Date(holiday.start).getTime()) / 86400000
  ) + 1

  const earliest = (() => {
    const d = new Date(holiday.start)
    d.setDate(d.getDate() - extraDays)
    return d.toISOString().slice(0, 10)
  })()
  const latest = (() => {
    const d = new Date(holiday.end)
    d.setDate(d.getDate() + extraDays)
    return d.toISOString().slice(0, 10)
  })()

  const combos = useMemo(
    () => getRoundTripMatrix(earliest, latest, holidayDays, holidayDays + extraDays * 2).slice(0, 20),
    [earliest, latest, holidayDays, extraDays]
  )

  const minTotal = combos[0]?.total ?? 0

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-rose-500 to-rose-600 rounded-2xl p-4 text-white">
        <div className="text-base font-bold">请假窗口往返联动</div>
        <div className="text-xs opacity-80 mt-1">
          告诉我节假日区间 + 最多额外请几天假，找总价最低的去回组合
        </div>
        <div className="text-xs mt-2 bg-white/20 rounded-lg px-2 py-1 inline-block">
          携程只能选"行程天数"，无法按请假约束搜索
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        <div>
          <div className="text-xs text-gray-500 mb-2">选择节假日</div>
          <div className="flex gap-2">
            {HOLIDAY_PRESETS.map((p, i) => (
              <button key={i} onClick={() => setPreset(i)}
                className={`px-3 py-1.5 rounded-full text-sm border ${preset === i ? 'bg-rose-500 text-white border-rose-500' : 'border-gray-200 text-gray-600'}`}>
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div>
          <div className="text-xs text-gray-500 mb-2">额外最多请几天假</div>
          <div className="flex gap-2">
            {[0, 1, 2, 3].map(n => (
              <button key={n} onClick={() => setExtraDays(n)}
                className={`w-10 h-10 rounded-full text-sm border ${extraDays === n ? 'bg-rose-500 text-white border-rose-500' : 'border-gray-200 text-gray-600'}`}>
                {n}天
              </button>
            ))}
          </div>
        </div>

        <div className="text-xs text-gray-400">
          搜索窗口：{earliest} ~ {latest} · 航线：{route}（模拟数据）
        </div>
      </div>

      <div className="text-xs font-semibold text-gray-500">
        共 {combos.length} 个去回组合 · 按总价排序
      </div>

      <div className="space-y-2">
        {combos.map((c, i) => (
          <div key={i}
            className={`bg-white rounded-xl border p-3 flex items-center justify-between ${i === 0 ? 'border-rose-300 bg-rose-50' : 'border-gray-100'}`}>
            <div>
              <div className="text-sm font-semibold text-gray-800">
                去 {c.outDate} · 回 {c.returnDate}
              </div>
              <div className="text-xs text-gray-400 mt-0.5">
                去程 ¥{c.outPrice} + 回程 ¥{c.returnPrice}
              </div>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-rose-500">¥{c.total}</div>
              {i === 0 && <div className="text-xs text-rose-500 font-medium">最低总价</div>}
              {i > 0 && <div className="text-xs text-gray-400">+¥{c.total - minTotal}</div>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
