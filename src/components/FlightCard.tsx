import type { FlightOffer } from '../data/mockFlights'
import { getPriceDiff } from '../utils/valueScore'

interface Props {
  flight: FlightOffer
  onClick?: () => void
}

const scoreColor = (s: number) => s >= 80 ? 'text-green-600' : s >= 60 ? 'text-yellow-600' : 'text-red-500'

export default function FlightCard({ flight, onClick }: Props) {
  const diff = getPriceDiff(flight.price, flight.avgPrice)
  const h = Math.floor(flight.duration / 60)
  const m = flight.duration % 60

  return (
    <div onClick={onClick} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 cursor-pointer hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <div className="text-xs text-gray-400">{flight.originCity} → {flight.destCity}</div>
          <div className="text-lg font-bold text-gray-800 mt-0.5">
            {flight.departureTime} <span className="text-gray-400 font-normal text-sm">→</span> {flight.arrivalTime}
          </div>
          <div className="text-xs text-gray-400 mt-0.5">
            {flight.airline} · {h}h{m}m · {flight.stops === 0 ? '直飞' : `${flight.stops}次中转`}
            {flight.visaFree && <span className="ml-1 text-blue-500">免签</span>}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-orange-500">¥{flight.price}</div>
          {diff > 0 && (
            <div className="text-xs text-green-600 font-medium">比均价低{diff}%</div>
          )}
        </div>
      </div>

      <div className="mt-3 flex items-center justify-between">
        <div className="flex gap-1">
          {[
            { label: '价格', pct: 45 },
            { label: '时长', pct: 25 },
            { label: '直飞', pct: 20 },
            { label: '时段', pct: 10 },
          ].map(({ label, pct }) => (
            <span key={label} className="text-xs bg-gray-50 text-gray-500 px-1.5 py-0.5 rounded">
              {label}{pct}%
            </span>
          ))}
        </div>
        <div className={`text-sm font-bold ${scoreColor(flight.valueScore)}`}>
          {flight.valueScore}分
        </div>
      </div>

      <div className="mt-2 bg-gray-100 rounded-full h-1.5">
        <div
          className={`h-1.5 rounded-full ${flight.valueScore >= 80 ? 'bg-green-500' : flight.valueScore >= 60 ? 'bg-yellow-400' : 'bg-red-400'}`}
          style={{ width: `${flight.valueScore}%` }}
        />
      </div>
    </div>
  )
}
