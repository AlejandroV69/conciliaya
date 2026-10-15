import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShieldCheck, ArrowRight, Store, Phone, Link2 } from 'lucide-react'
import { useApp } from '../../context/AppContext'

export const RegisterPage: React.FC = () => {
  const { register, updateStore } = useApp()
  const navigate = useNavigate()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [storeName, setStoreName] = useState('')
  const [slug, setSlug] = useState('')
  const [phone, setPhone] = useState('')

  const handleStoreNameChange = (val: string) => {
    setStoreName(val)
    // Auto-generate slug
    setSlug(
      val
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '')
    )
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    register(name, email, storeName, slug)
    if (phone) {
      updateStore({ phone })
    }
    navigate('/dashboard')
  }

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-lg text-center">
        <Link to="/" className="inline-flex items-center gap-2 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-500 flex items-center justify-center text-white shadow-lg shadow-emerald-600/25 group-hover:scale-105 transition-transform">
            <ShieldCheck className="w-7 h-7 stroke-[2.2]" />
          </div>
          <span className="font-black text-2xl tracking-tight text-slate-900">
            Concilia<span className="text-emerald-600">Ya</span>
          </span>
        </Link>
        <h2 className="mt-4 text-2xl font-black text-slate-900 tracking-tight">
          Crea tu Tienda y Activa la Conciliación
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Configura tu vitrina pública y tu panel de control en menos de 2 minutos.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg px-4">
        <div className="bg-white py-8 px-6 shadow-xl rounded-3xl border border-slate-200 sm:px-10">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Tu Nombre
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Roberto Gómez"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  required
                  placeholder="roberto@mitienda.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Nombre de tu Negocio / Comercio
              </label>
              <div className="relative">
                <Store className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Ej. Hamburguesas El Ávila"
                  value={storeName}
                  onChange={e => handleStoreNameChange(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                Enlace Personalizado de tu Tienda (Slug)
              </label>
              <div className="flex items-center bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-xs">
                <Link2 className="w-4 h-4 text-slate-400 mr-2 shrink-0" />
                <span className="text-slate-400 font-mono">conciliaya.app/t/</span>
                <input
                  type="text"
                  required
                  placeholder="hamburguesas-el-avila"
                  value={slug}
                  onChange={e => setSlug(e.target.value)}
                  className="w-full bg-transparent font-mono font-bold text-emerald-700 outline-none pl-1"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                WhatsApp de Notificaciones de Pedidos
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+584121234567"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 transition-all flex items-center justify-center gap-2 cursor-pointer mt-2"
            >
              <span>Comenzar Ahora</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-xs text-slate-500">
            ¿Ya tienes una cuenta registrada?{' '}
            <Link to="/login" className="font-bold text-emerald-600 hover:text-emerald-500">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
