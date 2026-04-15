import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Home from './pages/Home'
import Discover from './pages/Discover'
import Calendar from './pages/Calendar'
import Alerts from './pages/Alerts'

const nav = [
  { to: '/', label: '首页', icon: '✈️' },
  { to: '/discover', label: '发现', icon: '🗺️' },
  { to: '/calendar', label: '日历', icon: '📅' },
  { to: '/alerts', label: '提醒', icon: '🔔' },
]

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 pb-20">
        <div className="max-w-md mx-auto px-4 pt-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/discover" element={<Discover />} />
            <Route path="/calendar" element={<Calendar />} />
            <Route path="/alerts" element={<Alerts />} />
          </Routes>
        </div>
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 flex justify-around py-2 z-40">
          {nav.map(({ to, label, icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `flex flex-col items-center text-xs py-1 px-3 ${isActive ? 'text-blue-500' : 'text-gray-400'}`
              }
            >
              <span className="text-lg">{icon}</span>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </BrowserRouter>
  )
}
