import { useState } from 'react'
import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Alerts from './pages/Alerts'
import RoundTrip from './pages/RoundTrip'
import SuixinFei from './pages/SuixinFei'
import Profile from './pages/Profile'
import ShowcaseBanner from './components/ShowcaseBanner'

const nav = [
  { to: '/', label: '发现', icon: '✈️' },
  { to: '/roundtrip', label: '往返', icon: '🔄' },
  { to: '/suixinfei', label: '随心飞', icon: '🎫' },
  { to: '/alerts', label: '提醒', icon: '🔔' },
  { to: '/profile', label: '我的', icon: '👤' },
]

export default function App() {
  const [showShowcase, setShowShowcase] = useState(true)
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-md mx-auto px-4 pt-6">
          {showShowcase && <ShowcaseBanner onClose={() => setShowShowcase(false)} />}
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/roundtrip" element={<RoundTrip />} />
            <Route path="/suixinfei" element={<SuixinFei />} />
            <Route path="/alerts" element={<Alerts />} />
            <Route path="/profile" element={<Profile />} />
          </Routes>
        </div>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-2 z-40">
          {nav.map(({ to, label, icon }) => (
            <NavLink key={to} to={to} end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center text-xs py-1 px-2 ${isActive ? 'text-blue-500' : 'text-gray-400'}`
              }>
              <span className="text-lg">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </BrowserRouter>
  )
}
