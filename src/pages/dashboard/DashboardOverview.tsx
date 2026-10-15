import React, { useState } from 'react'
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Search,
  DollarSign,
  ShieldAlert,
  Eye,
  Phone
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import type { Order, OrderStatus } from '../../types'
import { VerificationModal } from '../../components/VerificationModal'

export const DashboardOverview: React.FC = () => {
  const { orders } = useApp()
  const [statusFilter, setStatusFilter] = useState<'all' | OrderStatus>('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)

  // Calculate KPIs
  const pendingOrders = orders.filter(o => o.status === 'pending')
  const verifiedOrders = orders.filter(o => o.status === 'verified')
  const fraudAlertOrders = orders.filter(o => o.isFraudAlert && o.status === 'pending')

  const totalUSDVerified = verifiedOrders.reduce((sum, o) => sum + o.totalUSD, 0)
  const totalBsVerified = verifiedOrders.reduce((sum, o) => sum + o.totalBs, 0)

  // Filter and sort orders (newest first)
  const filteredOrders = orders
    .filter(order => {
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter
      const query = searchQuery.toLowerCase()
      const matchesSearch =
        order.orderNumber.toLowerCase().includes(query) ||
        order.customer.fullName.toLowerCase().includes(query) ||
        order.paymentReport.referenceNumber.toLowerCase().includes(query) ||
        order.customer.phone.includes(query)

      return matchesStatus && matchesSearch
    })
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

  return (
    <div className="space-y-6">
      {/* Top Welcome Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
            Panel de Conciliación Bancaria
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Monitorea pagos de clientes en tiempo real y detecta intentos de comprobantes duplicados.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 shadow-2xs flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            Conciliador en Vivo
          </span>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Pendientes de verificar */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Por Verificar
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-amber-600">
                {pendingOrders.length}
              </span>
              <span className="text-xs text-slate-400">pedidos</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 2: Total Ingresado Hoy (USD) */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Ingresos Verificados
            </span>
            <div className="mt-1 flex items-baseline gap-1">
              <span className="text-3xl font-black text-slate-900">
                ${totalUSDVerified.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-medium">USD</span>
            </div>
            <span className="text-[11px] font-bold text-emerald-600 mt-0.5 block">
              ≈ Bs. {totalBsVerified.toFixed(2)}
            </span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 3: Pedidos Completados */}
        <div className="bg-white p-5 rounded-3xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
              Conciliados con Éxito
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-emerald-600">
                {verifiedOrders.length}
              </span>
              <span className="text-xs text-slate-400">órdenes</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <CheckCircle className="w-6 h-6" />
          </div>
        </div>

        {/* KPI 4: Alertas Antifraude */}
        <div
          className={`p-5 rounded-3xl border shadow-xs flex items-center justify-between transition-colors ${
            fraudAlertOrders.length > 0
              ? 'bg-rose-50 border-rose-300 ring-2 ring-rose-400/20'
              : 'bg-white border-slate-200/80'
          }`}
        >
          <div>
            <span className="text-xs font-bold uppercase tracking-wider block text-rose-700">
              Alertas Antifraude
            </span>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-black text-rose-600">
                {fraudAlertOrders.length}
              </span>
              <span className="text-xs text-rose-500 font-medium">sospechosas</span>
            </div>
            {fraudAlertOrders.length > 0 && (
              <span className="text-[10px] font-bold text-rose-700 block mt-0.5">
                ¡Referencias repetidas!
              </span>
            )}
          </div>
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
              fraudAlertOrders.length > 0 ? 'bg-rose-200 text-rose-700 animate-pulse' : 'bg-slate-100 text-slate-400'
            }`}
          >
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Order Table Container */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-sm overflow-hidden">
        {/* Table Filters & Search Header */}
        <div className="p-4 sm:p-6 border-b border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4 bg-slate-50/50">
          {/* Status filter buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-slate-900 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Todas ({orders.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                statusFilter === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Pendientes ({pendingOrders.length})
            </button>
            <button
              onClick={() => setStatusFilter('verified')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'verified'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Verificadas ({verifiedOrders.length})
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                statusFilter === 'rejected'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              Rechazadas ({orders.filter(o => o.status === 'rejected').length})
            </button>
          </div>

          {/* Search box */}
          <div className="relative w-full md:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por cliente, orden o referencia..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 outline-none"
            />
          </div>
        </div>

        {/* Interactive Orders Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-bold uppercase tracking-wider">
              <tr>
                <th className="py-3.5 px-4 sm:px-6">Orden / Hora</th>
                <th className="py-3.5 px-4">Cliente</th>
                <th className="py-3.5 px-4">Monto ($ / Bs.)</th>
                <th className="py-3.5 px-4">Referencia Bancaria</th>
                <th className="py-3.5 px-4">Estado / Alerta</th>
                <th className="py-3.5 px-4 sm:px-6 text-right">Acción</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    No hay órdenes con este criterio de búsqueda.
                  </td>
                </tr>
              ) : (
                filteredOrders.map(order => {
                  const timeFormatted = new Date(order.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit'
                  })

                  return (
                    <tr
                      key={order.id}
                      onClick={() => setSelectedOrder(order)}
                      className={`hover:bg-slate-50/80 transition-colors cursor-pointer ${
                        order.isFraudAlert && order.status === 'pending'
                          ? 'bg-rose-50/60 hover:bg-rose-50 border-l-4 border-l-rose-500'
                          : ''
                      }`}
                    >
                      {/* Order Number & Time */}
                      <td className="py-4 px-4 sm:px-6 font-mono font-bold text-slate-900">
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{order.orderNumber}</span>
                        </div>
                        <span className="text-[11px] font-sans font-normal text-slate-400 flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {timeFormatted}
                        </span>
                      </td>

                      {/* Customer Info */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-slate-800">{order.customer.fullName}</div>
                        <div className="text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {order.customer.phone}
                        </div>
                      </td>

                      {/* Amount in USD and Bs */}
                      <td className="py-4 px-4">
                        <div className="font-black text-slate-900 text-sm">
                          ${order.totalUSD.toFixed(2)}
                        </div>
                        <div className="text-[11px] font-bold text-emerald-600">
                          Bs. {order.totalBs.toFixed(2)}
                        </div>
                      </td>

                      {/* Bank & Reference */}
                      <td className="py-4 px-4">
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          {order.paymentReport.referenceNumber}
                        </div>
                        <div className="text-[11px] text-slate-500 truncate max-w-36">
                          {order.paymentReport.bankOrigin}
                        </div>
                      </td>

                      {/* Status & Anti-Fraud Visual Alert */}
                      <td className="py-4 px-4">
                        {order.isFraudAlert ? (
                          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-100 text-rose-700 border border-rose-300 animate-pulse">
                            <AlertTriangle className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                            <span>REF DUPLICADA</span>
                          </div>
                        ) : order.status === 'verified' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                            <CheckCircle className="w-3 h-3" />
                            Verificada
                          </span>
                        ) : order.status === 'rejected' ? (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-700">
                            <XCircle className="w-3 h-3" />
                            Rechazada
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800">
                            <Clock className="w-3 h-3" />
                            Pendiente
                          </span>
                        )}
                      </td>

                      {/* Action Button */}
                      <td className="py-4 px-4 sm:px-6 text-right">
                        <button
                          onClick={e => {
                            e.stopPropagation()
                            setSelectedOrder(order)
                          }}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-[11px] transition-colors shadow-2xs cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Conciliar</span>
                        </button>
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Verification Modal with Split View & Antifraud Inspector */}
      {selectedOrder && (
        <VerificationModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  )
}
