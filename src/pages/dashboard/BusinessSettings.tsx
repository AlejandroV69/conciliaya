import React, { useState } from 'react'
import {
  Store,
  Phone,
  Link2,
  Copy,
  Check,
  CreditCard,
  Building,
  TrendingUp,
  Save,
  ExternalLink,
  ShieldCheck
} from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const BusinessSettings: React.FC = () => {
  const { store, updateStore, updateBcvRate } = useApp()
  const [copiedLink, setCopiedLink] = useState(false)
  const [savedSuccess, setSavedSuccess] = useState(false)

  // Local form state initialized from store
  const [profile, setProfile] = useState({
    name: store.name,
    slug: store.slug,
    phone: store.phone,
    description: store.description || '',
    logo: store.logo,
    bcvRate: store.bcvRate
  })

  const [paymentMethods, setPaymentMethods] = useState(store.paymentMethods)

  const publicUrl = `${window.location.origin}/t/${profile.slug}`

  const copyPublicLink = () => {
    navigator.clipboard.writeText(publicUrl)
    setCopiedLink(true)
    setTimeout(() => setCopiedLink(false), 2000)
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateStore({
      name: profile.name,
      slug: profile.slug,
      phone: profile.phone,
      description: profile.description,
      logo: profile.logo,
      paymentMethods
    })
    updateBcvRate(Number(profile.bcvRate))
    setSavedSuccess(true)
    setTimeout(() => setSavedSuccess(false), 3000)
  }

  return (
    <div className="space-y-6 max-w-4xl">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Ajustes del Negocio
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Personaliza el perfil de tu comercio, tus cuentas receptoras y comparte tu enlace público.
          </p>
        </div>

        {savedSuccess && (
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-100 text-emerald-800 text-xs font-bold animate-fade-in">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Ajustes guardados correctamente</span>
          </div>
        )}
      </div>

      {/* Public Store Link Card (Ready to copy for Instagram bio & WhatsApp status) */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-3xl p-6 text-white shadow-xl border border-slate-800">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                Tu Enlace Oficial
              </span>
              <span className="text-xs text-slate-400">Listo para compartir en Instagram y WhatsApp</span>
            </div>
            <h3 className="text-lg font-bold text-white">Vitrina Pública de tu Comercio</h3>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`/t/${profile.slug}`}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Visitar</span>
            </a>
          </div>
        </div>

        <div className="mt-4 flex items-center gap-2 bg-slate-950/80 p-3 rounded-2xl border border-slate-700/80">
          <Link2 className="w-4 h-4 text-emerald-400 shrink-0 ml-1" />
          <span className="font-mono text-xs sm:text-sm text-emerald-300 truncate select-all flex-1">
            {publicUrl}
          </span>
          <button
            onClick={copyPublicLink}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
              copiedLink
                ? 'bg-emerald-500 text-slate-950'
                : 'bg-emerald-600 hover:bg-emerald-500 text-white'
            }`}
          >
            {copiedLink ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>¡Copiado!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copiar Link</span>
              </>
            )}
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-4">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <Store className="w-4 h-4 text-emerald-600" />
            Perfil de la Tienda
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nombre Comercial
              </label>
              <input
                type="text"
                value={profile.name}
                onChange={e => setProfile({ ...profile, name: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Slug URL (/t/[slug])
              </label>
              <input
                type="text"
                value={profile.slug}
                onChange={e =>
                  setProfile({
                    ...profile,
                    slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '')
                  })
                }
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-mono text-emerald-700 font-bold focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                WhatsApp de Notificaciones
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={profile.phone}
                  onChange={e => setProfile({ ...profile, phone: e.target.value })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Tasa BCV del Día (Bs / USD)
              </label>
              <div className="relative">
                <TrendingUp className="w-4 h-4 text-emerald-600 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="number"
                  step="0.01"
                  value={profile.bcvRate}
                  onChange={e => setProfile({ ...profile, bcvRate: parseFloat(e.target.value) || 0 })}
                  className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-black text-slate-900 focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Descripción / Bio de la Tienda
              </label>
              <textarea
                rows={2}
                value={profile.description}
                onChange={e => setProfile({ ...profile, description: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                URL del Logo
              </label>
              <input
                type="url"
                value={profile.logo}
                onChange={e => setProfile({ ...profile, logo: e.target.value })}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Payment Methods Config */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-slate-900 pb-3 border-b border-slate-100 flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-emerald-600" />
            Cuentas Receptoras de Pago
          </h3>

          {/* Pago Movil */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-emerald-600" />
                Pago Móvil
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Activo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Banco</label>
                <input
                  type="text"
                  value={paymentMethods.pagoMovil.bank}
                  onChange={e =>
                    setPaymentMethods({
                      ...paymentMethods,
                      pagoMovil: { ...paymentMethods.pagoMovil, bank: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Teléfono</label>
                <input
                  type="text"
                  value={paymentMethods.pagoMovil.phone}
                  onChange={e =>
                    setPaymentMethods({
                      ...paymentMethods,
                      pagoMovil: { ...paymentMethods.pagoMovil, phone: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Cédula / RIF</label>
                <input
                  type="text"
                  value={paymentMethods.pagoMovil.idNumber}
                  onChange={e =>
                    setPaymentMethods({
                      ...paymentMethods,
                      pagoMovil: { ...paymentMethods.pagoMovil, idNumber: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium outline-none"
                />
              </div>
            </div>
          </div>

          {/* Transferencia Bancaria */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <Building className="w-3.5 h-3.5 text-emerald-600" />
                Transferencia Bancaria
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Activo
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Banco</label>
                <input
                  type="text"
                  value={paymentMethods.transferencia.bank}
                  onChange={e =>
                    setPaymentMethods({
                      ...paymentMethods,
                      transferencia: { ...paymentMethods.transferencia, bank: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-medium outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-bold text-slate-600 mb-1">Número de Cuenta (20 dígitos)</label>
                <input
                  type="text"
                  value={paymentMethods.transferencia.accountNumber}
                  onChange={e =>
                    setPaymentMethods({
                      ...paymentMethods,
                      transferencia: { ...paymentMethods.transferencia, accountNumber: e.target.value }
                    })
                  }
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium outline-none"
                />
              </div>
            </div>
          </div>

          {/* USDT */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Billetera USDT TRC20 / Binance
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                Activo
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">Dirección de Billetera (TRC20)</label>
              <input
                type="text"
                value={paymentMethods.usdt.walletAddress}
                onChange={e =>
                  setPaymentMethods({
                    ...paymentMethods,
                    usdt: { ...paymentMethods.usdt, walletAddress: e.target.value }
                  })
                }
                className="w-full px-3 py-2 bg-white border border-slate-200 rounded-xl text-xs font-mono font-medium outline-none"
              />
            </div>
          </div>
        </div>

        {/* Save button */}
        <div className="flex justify-end">
          <button
            type="submit"
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs sm:text-sm shadow-md shadow-emerald-600/20 active:scale-95 transition-all flex items-center gap-2 cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Guardar Configuración</span>
          </button>
        </div>
      </form>
    </div>
  )
}
