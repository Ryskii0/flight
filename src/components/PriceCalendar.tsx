import { useState } from 'react'
import { getCalendar, AVAILABLE_ROUTES, type DayPrice } from '../data/mockCalendar'

const levelColor = { low: 'bg-green-400', medium: 'bg-yellow-300', high: 'bg-red-400' }
const levelText = { low: '低价', medium: '正常', high: '偏高' }

interface Props {
  defaultRoute?: string
}

export default function PriceCalendar({ defaultRoute }: Props) {
  const [route, setRoute] = useState(defaultRoute ?? AVAILABLE_ROUTES[0])
  const [selected, setSelected] = useState<DayPrice | null>(null)
  const days = getCalendar(route)

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4">
      <div className="flex items-center justify-between mb-3">
        <div className="text-sm font-semibold text-gray-700">价格日历</div>
        <select
          value={route}
          onChange={e => { setRoute(e.target.value); setSelected(null) }}
          className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none"
        >
          {AVAILABLE_ROUTES.map(r => <option key={r} value={r}>{r.replace('-', ' → ')}</option>)}
        </select>
      </div>

      <div className="flex gap-3 mb-3 text-xs text-gray-500">
        {(['low', 'medium', 'high'] as const).map(l => (
          <span key={l} className="flex items-center gap-1">
            <span className={`w-2.5 h-2.5 rounded-sm inline-block ${levelColor[l]}`} />
            {levelText[l]}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {['日', '一', '二', '三', '四', '五', '六'].map(d => (
          <div key={d} className="text-center text-xs text-gray-400 py-1">{d}</div>
        ))}
        {/* offset for first day */}
        {Array.from({ length: new Date(days[0].date).getDay() }, (_, i) => (
          <div key={`e${i}`} />
        ))}
        {days.map(day => (
          <button
            key={day.date}
            onClick={() => setSelected(day)}
            className={`rounded-lg py-1.5 text-xs font-medium transition-all ${levelColor[day.level]} ${
              selected?.date === day.date ? 'ring-2 ring-blue-500 ring-offset-1' : ''
            } text-white`}
          >
            <div>{new Date(day.date).getDate()}</div>
            <div className="text-xs opacity-90">¥{day.price}</div>
          </button>
        ))}
      </div>

      {selected && (
        <div className="mt-3 p-3 bg-blue-50 rounded-xl text-sm">
          <span className="font-semibold">{selected.date}</span>
          <span className="ml-2 text-orange-500 font-bold">¥{selected.price}</span>
          <span className={`ml-2 text-xs ${selected.level === 'low' ? 'text-green-600' : selected.level === 'high' ? 'text-red-500' : 'text-gray-500'}`}>
            {levelText[selected.level]}
          </span>
        </div>
      )}
    </div>
  )
}
