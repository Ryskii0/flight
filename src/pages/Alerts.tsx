import PriceAlert from '../components/PriceAlert'

export default function Alerts() {
  return (
    <div className="space-y-4">
      <div className="text-sm font-semibold text-gray-700">价格提醒</div>
      <div className="text-xs text-gray-400">当航班价格低于你的目标价，我们会第一时间通知你</div>
      <PriceAlert />
    </div>
  )
}
