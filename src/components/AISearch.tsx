import { useState } from 'react'
import type { FlexProfile } from './FlexibilityProfile'

// Simulated AI parsing — maps natural language to structured profile
function parseIntent(input: string): { profile: FlexProfile; summary: string } {
  const lower = input.toLowerCase()

  const origins = lower.includes('杭州') ? ['HGH'] :
    lower.includes('南京') ? ['NKG'] :
    lower.includes('浦东') ? ['PVG'] : ['SHA']

  const regions = lower.includes('日本') || lower.includes('东京') || lower.includes('首尔') || lower.includes('韩国') ? ['东北亚'] :
    lower.includes('东南亚') || lower.includes('泰国') || lower.includes('曼谷') || lower.includes('巴厘') || lower.includes('新加坡') ? ['东南亚'] :
    lower.includes('国内') || lower.includes('成都') || lower.includes('广州') ? ['国内'] : []

  const budgetMatch = input.match(/(\d{3,5})\s*[元块]?/)
  const maxPrice = budgetMatch ? Number(budgetMatch[1]) : null

  const flexDate = lower.includes('随时') || lower.includes('灵活') || lower.includes('任意') || lower.includes('都行')

  const parts: string[] = []
  parts.push(`出发城市：${origins.join('/')}`)
  if (regions.length) parts.push(`目的地：${regions.join('/')}`)
  if (maxPrice) parts.push(`预算上限：¥${maxPrice}`)
  if (flexDate) parts.push('日期灵活')

  return { profile: { origins, regions, flexDate, maxPrice }, summary: parts.join(' · ') }
}

const EXAMPLES = [
  '下个月，预算800，想去东南亚，日期随便',
  '五一假期，从杭州出发，想去日本',
  '想去海边，预算1200，随时可以走',
]

interface Props {
  onResult: (profile: FlexProfile) => void
}

export default function AISearch({ onResult }: Props) {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<{ summary: string } | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSearch = () => {
    if (!input.trim()) return
    setLoading(true)
    setTimeout(() => {
      const { profile, summary } = parseIntent(input)
      setResult({ summary })
      onResult(profile)
      setLoading(false)
    }, 800)
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-4 space-y-3">
      <div className="text-xs text-gray-500">用自然语言描述你的需求</div>
      <div className="flex gap-2">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleSearch()}
          placeholder="如：下个月，预算800，想去东南亚"
          className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:border-blue-400"
        />
        <button onClick={handleSearch}
          className="bg-blue-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex-shrink-0">
          {loading ? '...' : 'AI匹配'}
        </button>
      </div>
      <div className="flex gap-2 flex-wrap">
        {EXAMPLES.map((e, i) => (
          <button key={i} onClick={() => { setInput(e); setResult(null) }}
            className="text-xs bg-gray-50 text-gray-500 px-2 py-1 rounded-lg border border-gray-100 hover:border-blue-300">
            {e}
          </button>
        ))}
      </div>
      {result && (
        <div className="bg-blue-50 rounded-xl px-3 py-2 text-xs text-blue-700">
          AI 已解析：{result.summary}
        </div>
      )}
    </div>
  )
}
