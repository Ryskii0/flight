import PriceCalendar from '../components/PriceCalendar'

export default function Calendar() {
  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-gray-700">选择航线，查看60天价格走势</div>
      <PriceCalendar />
    </div>
  )
}
