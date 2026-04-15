import { useState, useEffect } from 'react'
import type { FlexProfile } from '../components/FlexibilityProfile'

export interface UserPrefs {
  persona: number
  profile: FlexProfile
  suixinfei: string[]
  savedRoutes: string[]
  totalSaved: number
}

const DEFAULT_PREFS: UserPrefs = {
  persona: 0,
  profile: { origins: ['SHA'], regions: [], flexDate: false, maxPrice: null },
  suixinfei: ['海航666夏秋'],
  savedRoutes: ['SHA-BKK', 'SHA-ICN'],
  totalSaved: 1240,
}

const PERSONA_LABELS = ['均衡', '穷游优先', '时间优先']
const PERSONA_DESCS = ['综合推荐', '价格最重要', '直飞+快']

export function useUserPrefs() {
  const [prefs, setPrefs] = useState<UserPrefs>(() => {
    try { return JSON.parse(localStorage.getItem('userPrefs') ?? '') } catch { return DEFAULT_PREFS }
  })
  const save = (p: UserPrefs) => { setPrefs(p); localStorage.setItem('userPrefs', JSON.stringify(p)) }
  return { prefs, save }
}

export default function Profile() {
  const { prefs, save } = useUserPrefs()
  const [editPersona, setEditPersona] = useState(false)

  return (
    <div className="space-y-4">
      <div className="bg-gradient-to-r from-violet-500 to-violet-600 rounded-2xl p-5 text-white">
        <div className="text-xl font-bold">我的旅行偏好</div>
        <div className="text-sm opacity-80 mt-1">记住你的偏好，每次打开自动匹配</div>
      </div>

      {/* 质价比人格 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="flex justify-between items-center mb-3">
          <div className="text-sm font-semibold text-gray-700">质价比偏好</div>
          <button onClick={() => setEditPersona(e => !e)} className="text-xs text-blue-500">{editPersona ? '完成' : '修改'}</button>
        </div>
        {editPersona ? (
          <div className="flex gap-2">
            {PERSONA_LABELS.map((l, i) => (
              <button key={i} onClick={() => save({ ...prefs, persona: i })}
                className={`flex-1 py-2 rounded-xl border text-center text-xs ${prefs.persona === i ? 'bg-violet-500 text-white border-violet-500' : 'border-gray-200 text-gray-600'}`}>
                <div className="font-semibold">{l}</div>
                <div className="opacity-70 mt-0.5">{PERSONA_DESCS[i]}</div>
              </button>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <span className="bg-violet-100 text-violet-700 px-3 py-1 rounded-full text-sm font-medium">{PERSONA_LABELS[prefs.persona]}</span>
            <span className="text-xs text-gray-400">{PERSONA_DESCS[prefs.persona]}</span>
          </div>
        )}
      </div>

      {/* 常用出发城市 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="text-sm font-semibold text-gray-700 mb-2">常用出发城市</div>
        <div className="flex gap-2 flex-wrap">
          {prefs.profile.origins.map(o => (
            <span key={o} className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-sm">{o}</span>
          ))}
        </div>
      </div>

      {/* 我的随心飞 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="text-sm font-semibold text-gray-700 mb-2">我的随心飞权益</div>
        {prefs.suixinfei.length === 0 ? (
          <div className="text-xs text-gray-400">暂无权益，去随心飞页面查看</div>
        ) : (
          <div className="space-y-2">
            {prefs.suixinfei.map(s => (
              <div key={s} className="flex items-center justify-between bg-teal-50 rounded-xl px-3 py-2">
                <span className="text-sm text-teal-700 font-medium">{s}</span>
                <span className="text-xs text-teal-500">已激活</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 关注航线 */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4">
        <div className="text-sm font-semibold text-gray-700 mb-2">关注的航线</div>
        <div className="space-y-2">
          {prefs.savedRoutes.map(r => (
            <div key={r} className="flex items-center justify-between">
              <span className="text-sm text-gray-700">{r.replace('-', ' → ')}</span>
              <span className="text-xs text-gray-400">监控中</span>
            </div>
          ))}
        </div>
      </div>

      {/* 解锁城市统计 */}
      <div className="bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl p-4 text-white">
        <div className="text-xs opacity-80">你已解锁的城市</div>
        <div className="text-3xl font-bold mt-1">8 座</div>
        <div className="flex flex-wrap gap-1.5 mt-2">
          {['曼谷', '首尔', '新加坡', '成都', '广州', '厦门', '冲绳', '河内'].map(c => (
            <span key={c} className="text-xs bg-white/20 px-2 py-0.5 rounded-full">{c}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
