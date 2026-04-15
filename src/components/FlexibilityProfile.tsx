import { useState } from 'react'
import { AIRPORTS } from '../data/mockFlights'

export interface FlexProfile {
  origins: string[]
  regions: string[]
  flexDate: boolean
  maxPrice: number | null
}

const ORIGIN_OPTIONS = ['SHA', 'PVG', 'HGH', 'NKG']
const REGION_OPTIONS = ['东南亚', '东北亚', '国内']

interface Props {
  profile: FlexProfile
  onChange: (p: FlexProfile) => void
}

export default function FlexibilityProfile({ profile, onChange }: Props) {
  const [showBudget, setShowBudget] = useState(false)

  const toggleOrigin = (code: string) => {
    const next = profile.origins.includes(code)
      ? profile.origins.filter(o => o !== code)
      : [...profile.origins, code]
    if (next.length > 0) onChange({ ...profile, origins: next })
  }

  const toggleRegion = (r: string) => {
    const next = profile.regions.includes(r)
      ? profile.regions.filter(x => x !== r)
      : [...profile.regions, r]
    onChange({ ...profile, regions: next })
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 space-y-4">
      <div>
        <div className="text-xs font-semibold text-gray-500 mb-2">从哪里出发？（可多选）</div>
        <div className="flex flex-wrap gap-2">
          {ORIGIN_OPTIONS.map(code => (
            <button
              key={code}
              onClick={() => toggleOrigin(code)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                profile.origins.includes(code)
                  ? 'bg-blue-500 text-white border-blue-500'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {AIRPORTS[code].city} {AIRPORTS[code].name}
            </button>
          ))}
        </div>
      </div>

      <div>
        <div className="text-xs font-semibold text-gray-500 mb-2">想去哪个方向？（可多选，不选=全部）</div>
        <div className="flex flex-wrap gap-2">
          {REGION_OPTIONS.map(r => (
            <button
              key={r}
              onClick={() => toggleRegion(r)}
              className={`px-3 py-1.5 rounded-full text-sm border transition-colors ${
                profile.regions.includes(r)
                  ? 'bg-orange-400 text-white border-orange-400'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {r}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2 cursor-pointer">
          <div
            onClick={() => onChange({ ...profile, flexDate: !profile.flexDate })}
            className={`w-10 h-5 rounded-full transition-colors relative ${profile.flexDate ? 'bg-blue-500' : 'bg-gray-200'}`}
          >
            <div className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${profile.flexDate ? 'translate-x-5' : 'translate-x-0.5'}`} />
          </div>
          <span className="text-sm text-gray-700">日期灵活（看全部日期最低价）</span>
        </label>
      </div>

      <div>
        <button
          onClick={() => setShowBudget(!showBudget)}
          className="text-xs text-blue-500 underline"
        >
          {showBudget ? '取消预算限制' : '+ 设置预算上限'}
        </button>
        {showBudget && (
          <div className="mt-2 flex items-center gap-2">
            <span className="text-sm text-gray-600">¥</span>
            <input
              type="number"
              placeholder="如 800"
              className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm w-28 focus:outline-none focus:border-blue-400"
              value={profile.maxPrice ?? ''}
              onChange={e => onChange({ ...profile, maxPrice: e.target.value ? Number(e.target.value) : null })}
            />
          </div>
        )}
      </div>
    </div>
  )
}
