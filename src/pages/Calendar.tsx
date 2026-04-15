import PriceCalendar from '../components/PriceCalendar'

export default function Calendar() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 text-white">
        <div className="text-base font-bold">60天价格热力图</div>
        <div className="text-xs opacity-80 mt-1">携程只能查单日价格，这里一眼看出哪天最便宜，绿色=低价，红色=贵</div>
      </div>
      <PriceCalendar />
    </div>
  )
}
