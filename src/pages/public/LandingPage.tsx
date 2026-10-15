import React from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  Zap,
  ArrowRight,
  TrendingUp,
  Smartphone,
  CheckCircle2,
  AlertTriangle,
  Store
} from 'lucide-react'
import { Navbar } from '../../components/Navbar'
import { useApp } from '../../context/AppContext'

export const LandingPage: React.FC = () => {
  const { store } = useApp()

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-emerald-500 selection:text-white">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-32">
        {/* Subtle background glow */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 bg-gradient-to-b from-emerald-100/40 via-teal-50/20 to-transparent blur-3xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Top Pill */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-xs sm:text-sm font-semibold mb-6 shadow-xs">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>El SaaS de ventas y conciliación para comercios en Venezuela</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-slate-950 tracking-tight max-w-4xl mx-auto leading-[1.12]">
            Vende en <span className="text-emerald-600">Dólares y Bolívares</span> sin miedo a comprobantes falsificados.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Ofrece una vitrina móvil ultra rápida a tasa oficial BCV y concilia Pago Móvil o transferencias con detección automática de referencias duplicadas.
          </p>

          {/* CTA Buttons */}
          <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/register"
              className="w-full sm:w-auto px-7 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-xl shadow-emerald-600/25 flex items-center justify-center gap-2 text-base transition-all hover:scale-105"
            >
              <span>Crear mi Tienda Gratis</span>
              <ArrowRight className="w-5 h-5 stroke-[2.5]" />
            </Link>

            <Link
              to={`/t/${store.slug}`}
              className="w-full sm:w-auto px-7 py-4 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-2xl border border-slate-300/80 shadow-xs flex items-center justify-center gap-2.5 text-base transition-all hover:border-slate-400"
            >
              <Store className="w-5 h-5 text-emerald-600" />
              <span>Ver Vitrina Demo ({store.name})</span>
            </Link>
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-xs text-slate-500">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Sin comisiones por venta
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Tasa BCV automática
            </span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Antifraude en vivo
            </span>
          </div>
        </div>

        {/* Visual Architecture Preview */}
        <div className="mt-16 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-slate-900 rounded-3xl p-3 sm:p-6 shadow-2xl ring-1 ring-slate-800">
            <div className="flex items-center justify-between pb-4 border-b border-slate-800 px-3">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-rose-500" />
                <div className="w-3 h-3 rounded-full bg-amber-500" />
                <div className="w-3 h-3 rounded-full bg-emerald-500" />
                <span className="ml-3 text-xs text-slate-400 font-mono hidden sm:inline">
                  Dos mundos, una misma base de datos: Portal Público + Panel Privado
                </span>
              </div>
              <Link
                to="/dashboard"
                className="text-xs font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1"
              >
                <span>Explorar Panel Comerciante</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {/* Two Worlds Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              {/* World 1: Portal Publico */}
              <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Smartphone className="w-4 h-4" />
                      1. Portal Público (Comprador)
                    </span>
                    <span className="text-[11px] bg-emerald-950 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-800">
                      Sin registro requerido
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Catálogo PWA & Checkout Antifraude
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Tu cliente ingresa a tu enlace personalizado (/t/tu-marca), ve los productos en USD con conversión automática a Bolívares al BCV, y reporta su pago en 3 simples pasos con su comprobante.
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-900/90 border border-slate-700/60 text-xs space-y-2">
                    <div className="flex justify-between items-center text-slate-300">
                      <span>Yogurt Griego Tradicional</span>
                      <strong className="text-white">$4.50 (Bs. { (4.50 * store.bcvRate).toFixed(2) })</strong>
                    </div>
                    <div className="flex justify-between items-center text-slate-400 text-[11px]">
                      <span>Tasa BCV del día sincronizada</span>
                      <span className="text-emerald-400 font-bold">{store.bcvRate.toFixed(2)} Bs/$</span>
                    </div>
                  </div>
                </div>

                <div className="mt-5">
                  <Link
                    to={`/t/${store.slug}`}
                    className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Abrir Catálogo del Comprador</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>

              {/* World 2: Portal Privado */}
              <div className="bg-slate-800/80 rounded-2xl p-5 border border-slate-700/80 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-bold text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      2. Portal Privado (Comerciante)
                    </span>
                    <span className="text-[11px] bg-rose-950 text-rose-300 px-2 py-0.5 rounded-full border border-rose-800">
                      Alerta Antifraude Activa
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mb-2">
                    Panel de Conciliación en Tiempo Real
                  </h3>
                  <p className="text-xs text-slate-300 leading-relaxed">
                    Visualiza las órdenes entrantes al instante. Si un cliente intenta reusar una referencia bancaria o comprobante anterior, el sistema lanza una alerta visual roja para evitar estafas.
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-xs">
                    <div className="flex items-center gap-2 text-rose-300 font-bold text-[11px] mb-1">
                      <AlertTriangle className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                      <span>Alerta: Referencia 839201 duplicada</span>
                    </div>
                    <p className="text-[11px] text-rose-200/80">
                      Compara el comprobante adjunto contra la orden previa con un solo clic.
                    </p>
                  </div>
                </div>

                <div className="mt-5">
                  <Link
                    to="/dashboard"
                    className="w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-600 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                  >
                    <span>Ir a la Consola de Conciliación</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-16 bg-white border-t border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Diseñado para el comercio real en Venezuela
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base">
              Elimina los dolores de cabeza de calcular tasas a mano, revisar capturas borrosas y sufrir estafas con comprobantes reutilizados.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-emerald-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Tasa BCV del Día</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Tus precios se fijan en USD y la plataforma recalcula automáticamente los totales en Bolívares según la tasa oficial, evitando pérdidas por devaluación.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-rose-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Detector Antifraude</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Si un comprador ingresa una referencia de Pago Móvil o transferencia que ya fue reportada anteriormente, el sistema la marca en rojo brillante de inmediato.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-teal-300 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center mb-4">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Checkout en 3 Pasos</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                Experiencia fluida sin registro obligatorio para el cliente: datos de entrega, copia rápida de datos bancarios y carga de comprobante con aviso a WhatsApp.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-slate-900 text-slate-400 py-10 text-xs text-center">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
            <span className="font-bold text-white text-sm">ConciliaYa</span>
            <span>— SaaS de Comercio y Conciliación Bancaria</span>
          </div>
          <div>
            <span>© {new Date().getFullYear()} ConciliaYa. Todos los derechos reservados.</span>
          </div>
        </div>
      </footer>
    </div>
  )
}
