import React from 'react'
import { ShoppingBag, Phone, TrendingUp, ShieldCheck, ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useApp } from '../context/AppContext'

interface PublicHeaderProps {
  showBackToCatalog?: boolean
}

export const PublicHeader: React.FC<PublicHeaderProps> = ({ showBackToCatalog = false }) => {
  const { store, cart, setIsCartOpen } = useApp()
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 shadow-xs">
      {/* Tasa BCV Floating Bar */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white text-xs font-medium py-1.5 px-4 text-center">
        <div className="max-w-7xl mx-auto flex items-center justify-between sm:justify-center gap-2">
          <div className="flex items-center gap-1.5">
            <span className="flex h-2 w-2 rounded-full bg-emerald-300 animate-ping" />
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tasa Oficial BCV del día:</span>
            <span className="font-bold underline decoration-emerald-300 underline-offset-2">
              Bs. {store.bcvRate.toFixed(2)} / USD
            </span>
          </div>
          <span className="hidden sm:inline-block text-emerald-100 text-[11px]">
            ({store.bcvRateLastUpdated})
          </span>
        </div>
      </div>

      {/* Main Store Nav */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {showBackToCatalog && (
            <Link
              to={`/t/${store.slug}`}
              className="p-2 -ml-2 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors"
              title="Volver al catálogo"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
          )}

          <Link to={`/t/${store.slug}`} className="flex items-center gap-3 group">
            <img
              src={store.logo}
              alt={store.name}
              className="w-11 h-11 rounded-2xl object-cover ring-2 ring-emerald-500/20 shadow-sm group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="font-bold text-lg text-slate-900 group-hover:text-emerald-600 transition-colors leading-tight">
                  {store.name}
                </h1>
                <span title="Comercio Verificado ConciliaYa">
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                </span>
              </div>
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                <Phone className="w-3 h-3 text-slate-400" />
                <span>{store.phone}</span>
              </p>
            </div>
          </Link>
        </div>

        {/* Right action: Cart button & WhatsApp contact */}
        <div className="flex items-center gap-2 sm:gap-3">
          <a
            href={`https://wa.me/${store.phone.replace(/[^0-9]/g, '')}?text=Hola,%20tengo%20una%20consulta%20sobre%20sus%20productos`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200/60 rounded-xl transition-colors"
          >
            <span>WhatsApp</span>
          </a>

          {!showBackToCatalog && (
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-sm shadow-sm transition-all active:scale-95"
              aria-label="Abrir carrito de compras"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-400" />
              <span className="hidden sm:inline">Carrito</span>
              {totalItems > 0 && (
                <span className="flex items-center justify-center min-w-5 h-5 px-1.5 text-xs font-bold text-slate-950 bg-emerald-400 rounded-full animate-bounce">
                  {totalItems}
                </span>
              )}
            </button>
          )}
        </div>
      </div>
    </header>
  )
}
