import React, { useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import {
  ShieldCheck,
  LayoutDashboard,
  Package,
  Settings,
  ExternalLink,
  LogOut,
  RefreshCw,
  Bell,
  Menu,
  X,
  TrendingUp,
  Store as StoreIcon
} from 'lucide-react'
import { useApp } from '../context/AppContext'

export const DashboardLayout: React.FC = () => {
  const { store, updateBcvRate, logout, orders } = useApp()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isEditingBcv, setIsEditingBcv] = useState(false)
  const [tempBcv, setTempBcv] = useState(store.bcvRate.toString())
  const navigate = useNavigate()

  const pendingCount = orders.filter(o => o.status === 'pending').length
  const fraudAlertCount = orders.filter(o => o.isFraudAlert && o.status === 'pending').length

  const handleBcvSave = () => {
    const val = parseFloat(tempBcv)
    if (!isNaN(val) && val > 0) {
      updateBcvRate(val)
      setIsEditingBcv(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const navItems = [
    {
      to: '/dashboard',
      label: 'Órdenes & Conciliador',
      icon: LayoutDashboard,
      badge: pendingCount > 0 ? pendingCount : null,
      badgeColor: fraudAlertCount > 0 ? 'bg-rose-500' : 'bg-amber-500'
    },
    {
      to: '/dashboard/products',
      label: 'Catálogo de Productos',
      icon: Package
    },
    {
      to: '/dashboard/settings',
      label: 'Ajustes del Negocio',
      icon: Settings
    }
  ]

  return (
    <div className="min-h-screen bg-slate-100/70 flex flex-col md:flex-row">
      {/* Mobile Top Header */}
      <div className="md:hidden bg-slate-900 text-white px-4 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-800">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center text-slate-950 font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <span className="font-extrabold text-base tracking-tight text-white">ConciliaYa</span>
        </Link>
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className="p-2 text-slate-400 hover:text-white"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between border-r border-slate-800 transition-transform duration-300 md:static md:translate-x-0 ${
          isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand header */}
          <div className="p-6 border-b border-slate-800/80 flex items-center justify-between">
            <Link to="/dashboard" className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center text-slate-950 shadow-md shadow-emerald-500/20">
                <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
              </div>
              <div>
                <span className="font-extrabold text-lg tracking-tight text-white">
                  Concilia<span className="text-emerald-400">Ya</span>
                </span>
                <span className="block text-[10px] text-slate-400 font-medium">Panel Comerciante</span>
              </div>
            </Link>
          </div>

          {/* Active Store Indicator */}
          <div className="px-4 py-4">
            <div className="p-3 rounded-2xl bg-slate-800/60 border border-slate-700/60 flex items-center gap-3">
              <img
                src={store.logo}
                alt={store.name}
                className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-600"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold text-white truncate">{store.name}</p>
                <p className="text-[11px] text-slate-400 truncate">/t/{store.slug}</p>
              </div>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-2 space-y-1">
            {navItems.map(item => {
              const Icon = item.icon
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/dashboard'}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-emerald-500/10 text-emerald-400 font-semibold border border-emerald-500/20'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </div>
                  {item.badge && (
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full text-white font-bold ${item.badgeColor}`}
                    >
                      {item.badge}
                    </span>
                  )}
                </NavLink>
              )
            })}
          </nav>
        </div>

        {/* Sidebar Footer: Public Link & Logout */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to={`/t/${store.slug}`}
            target="_blank"
            className="flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold text-emerald-300 bg-emerald-950/40 hover:bg-emerald-950/70 border border-emerald-800/50 transition-colors"
          >
            <div className="flex items-center gap-2">
              <StoreIcon className="w-4 h-4 text-emerald-400" />
              <span>Ver Tienda Pública</span>
            </div>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3.5 py-2 text-xs font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800/60 rounded-xl transition-colors cursor-pointer"
          >
            <LogOut className="w-4 h-4" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar on Desktop */}
        <header className="bg-white border-b border-slate-200/80 px-6 py-3.5 flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {/* Tasa BCV Dynamic Pill */}
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200/80 rounded-xl px-3 py-1.5 text-xs">
              <TrendingUp className="w-4 h-4 text-emerald-600" />
              <span className="font-medium text-slate-600">Tasa BCV del día:</span>
              {isEditingBcv ? (
                <div className="flex items-center gap-1">
                  <input
                    type="number"
                    step="0.01"
                    value={tempBcv}
                    onChange={e => setTempBcv(e.target.value)}
                    className="w-16 px-1.5 py-0.5 border border-emerald-400 rounded text-xs font-bold outline-none"
                    autoFocus
                  />
                  <button
                    onClick={handleBcvSave}
                    className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[11px] font-bold"
                  >
                    OK
                  </button>
                </div>
              ) : (
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-emerald-800">
                    Bs. {store.bcvRate.toFixed(2)}
                  </span>
                  <button
                    onClick={() => {
                      setTempBcv(store.bcvRate.toString())
                      setIsEditingBcv(true)
                    }}
                    title="Editar Tasa BCV manual"
                    className="text-slate-400 hover:text-emerald-700 p-0.5"
                  >
                    <RefreshCw className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>

            {fraudAlertCount > 0 && (
              <div className="hidden lg:flex items-center gap-1.5 text-xs font-bold bg-rose-50 text-rose-700 border border-rose-200 px-3 py-1.5 rounded-xl">
                <Bell className="w-3.5 h-3.5 animate-bounce" />
                <span>{fraudAlertCount} alerta(s) antifraude detectadas</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-500 hidden sm:inline">
              Comercio: <strong className="text-slate-800">{store.name}</strong>
            </span>
            <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Dashboard Router Outlet */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
