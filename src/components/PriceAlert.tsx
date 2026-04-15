import { useState, useEffect } from 'react'

interface Alert {
  id: string
  route: string
  threshold: number
  triggered: boolean
}

const DEMO_ALERTS: Alert[] = [
  { id: '1', route: 'SHA-BKK', threshold: 700, triggered: true },
  { id: '2', route: 'SHA-ICN', threshold: 500, triggered: false },
]

export default function PriceAlert() {
  const [alerts, setAlerts] = useState<Alert[]>(() => {
    try { return JSON.parse(localStorage.getItem('alerts') ?? '') } catch { return DEMO_ALERTS }
  })
  const [route, setRoute] = useState('SHA-BKK')
  const [threshold, setThreshold] = useState('')

  useEffect(() => { localStorage.setItem('alerts', JSON.stringify(alerts)) }, [alerts])

  const add = () => {
    if (!threshold) return
    setAlerts(prev => [...prev, { id: Date.now().toString(), route, threshold: Number(threshold), triggered: false }])
    setThreshold('')
  }

  const remove = (id: string) => setAlerts(prev => prev.filter(a => a.id !== id))

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
        <div className="text-sm font-semibold text-gray-700">新建价格提醒</div>
        <div className="flex gap-2">
          <input
            value={route}
            onChange={e => setRoute(e.target.value)}
            placeholder="如 SHA-BKK"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm flex-1 focus:outline-none focus:border-blue-400"
          />
          <input
            type="number"
            value={threshold}
            onChange={e => setThreshold(e.target.value)}
            placeholder="¥ 目标价"
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-28 focus:outline-none focus:border-blue-400"
          />
        </div>
        <button onClick={add} className="w-full bg-blue-500 text-white rounded-xl py-2 text-sm font-medium">
          添加提醒
        </button>
      </div>

      <div className="space-y-2">
        {alerts.map(a => (
          <div key={a.id} className={`bg-white rounded-xl border p-3 flex items-center justify-between ${a.triggered ? 'border-green-300 bg-green-50' : 'border-gray-100'}`}>
            <div>
              <div className="text-sm font-semibold text-gray-800">{a.route.replace('-', ' → ')}</div>
              <div className="text-xs text-gray-500">目标价 ¥{a.threshold}</div>
              {a.triggered && <div className="text-xs text-green-600 font-medium mt-0.5">已触发！当前有低于目标价的航班</div>}
            </div>
            <button onClick={() => remove(a.id)} className="text-gray-300 hover:text-red-400 text-lg leading-none">×</button>
          </div>
        ))}
      </div>
    </div>
  )
}
