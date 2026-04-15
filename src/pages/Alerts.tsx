import PriceAlert from '../components/PriceAlert'

export default function Alerts() {
  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl p-4 text-white">
        <div className="text-base font-bold">价格提醒</div>
        <div className="text-xs opacity-80 mt-1">设定目标价，低于时自动通知——不用反复刷新查价</div>
      </div>
      <PriceAlert />
    </div>
  )
}
