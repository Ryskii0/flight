import type { FlightOffer } from '../data/mockFlights'
import { getPriceDiff } from '../utils/valueScore'

interface Props {
  flights: FlightOffer[]
  onSelect: (f: FlightOffer) => void
}

const regionOrder = ['东南亚', '东北亚', '国内']

export default function PriceMap({ flights, onSelect }: Props) {
  const byRegion = regionOrder.map(region => ({
    region,
    items: flights.filter(f => f.region === region),
  })).filter(g => g.items.length > 0)

  return (
    <div className="space-y-4">
      {byRegion.map(({ region, items }) => (
        <div key={region}>
          <div className="text-xs font-semibold text-gray-500 mb-2">{region}</div>
          <div className="grid grid-cols-2 gap-2">
            {items.map(f => {
              const diff = getPriceDiff(f.price, f.avgPrice)
              return (
                <button
                  key={f.id}
                  onClick={() => onSelect(f)}
                  className="bg-white rounded-xl border border-gray-100 p-3 text-left hover:shadow-md transition-shadow"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="text-sm font-semibold text-gray-800">{f.destCity}</div>
                      <div className="text-xs text-gray-400">{f.stops === 0 ? '直飞' : `${f.stops}转`} · {Math.floor(f.duration/60)}h{f.duration%60}m</div>
                      {f.visaFree && <div className="text-xs text-blue-500 mt-0.5">免签</div>}
                    </div>
                    <div className="text-right">
                      <div className="text-base font-bold text-orange-500">¥{f.price}</div>
                      {diff > 0 && <div className="text-xs text-green-600">↓{diff}%</div>}
                    </div>
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
