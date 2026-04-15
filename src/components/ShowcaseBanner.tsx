import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const SHOWCASES = [
  {
    tag: 'OTA: 必须填目的地和日期',
    title: 'AI 模糊意图匹配',
    desc: '输入"下个月、预算800、想去东南亚"，AI 自动解析成筛选条件',
    page: '/',
  },
  {
    tag: 'OTA: 只能按价格/时长单维排序',
    title: '质价比偏好人格',
    desc: '选"时间优先"→直飞权重提高，结果和最低价排序完全不同',
    page: '/',
  },
  {
    tag: 'OTA: 按行程天数搜索',
    title: '请假窗口往返联动',
    desc: '输入节假日+最多请几天假，找总价最低的去回组合',
    page: '/roundtrip',
  },
  {
    tag: 'OTA: 卖完权益不管你怎么用',
    title: '随心飞航线解读',
    desc: '按班期、航线类型筛选，算回本次数，找最值得飞的路线',
    page: '/suixinfei',
  },
]

export default function ShowcaseBanner({ onClose }: { onClose: () => void }) {
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState(false)
  return (
    <div className="bg-indigo-50 border border-indigo-200 rounded-2xl p-4 mb-4">
      <div className="flex justify-between items-center">
        <button onClick={() => setExpanded(e => !e)} className="flex items-center gap-2 flex-1 text-left">
          <span className="text-xs font-bold text-indigo-600 uppercase tracking-wide">核心差异化 Showcase</span>
          <span className="text-xs text-indigo-400">{expanded ? '收起 ▲' : '展开查看 ▼'}</span>
        </button>
        <button onClick={onClose} className="text-gray-300 hover:text-gray-500 text-xl leading-none ml-2">×</button>
      </div>
      {expanded && (
        <div className="mt-3 space-y-2">
          {SHOWCASES.map((s, i) => (
            <button key={i} onClick={() => navigate(s.page)}
              className="w-full bg-white rounded-xl border border-indigo-100 p-3 text-left hover:border-indigo-300 transition-colors">
              <div className="text-xs text-gray-400 line-through mb-0.5">{s.tag}</div>
              <div className="flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-800">{s.title}</span>
                <span className="text-xs text-indigo-500 flex-shrink-0 ml-2">演示 →</span>
              </div>
              <div className="text-xs text-gray-400 mt-1">{s.desc}</div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
