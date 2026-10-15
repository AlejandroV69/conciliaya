import React from 'react'
import { Link } from 'react-router-dom'
import { ShieldCheck, Store, ArrowRight, LayoutDashboard } from 'lucide-react'
import { useApp } from '../context/AppContext'

export const Navbar: React.FC = () => {
  const { store, isAuthenticated } = useApp()

  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200/80 bg-white/85 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-600 via-teal-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-6 h-6 stroke-[2.2]" />
          </div>
          <div>
            <span className="font-extrabold text-xl tracking-tight text-slate-900 group-hover:text-emerald-600 transition-colors">
              Concilia<span className="text-emerald-600">Ya</span>
            </span>
            <span className="hidden sm:inline-block ml-2 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              SaaS Antifraude
            </span>
          </div>
        </Link>

        {/* Navigation links & CTA */}
        <div className="flex items-center gap-3">
          <Link
            to={`/t/${store.slug}`}
            className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-sm font-medium text-slate-600 hover:text-emerald-600 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <Store className="w-4 h-4 text-emerald-600" />
            <span>Ver Vitrina Demo ({store.name})</span>
          </Link>

          {isAuthenticated ? (
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl shadow-sm transition-all hover:shadow-md"
            >
              <LayoutDashboard className="w-4 h-4 text-emerald-400" />
              <span>Ir al Panel</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="px-3.5 py-2 text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center gap-1.5 px-4 py-2 text-sm font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/20 transition-all hover:scale-[1.02]"
              >
                <span>Crear Tienda</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
