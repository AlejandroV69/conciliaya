import React, { useState } from 'react'
import {
  X,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Receipt,
  User,
  Phone,
  MapPin,
  ExternalLink,
  ShieldAlert,
  CreditCard,
  ZoomIn
} from 'lucide-react'
import type { Order } from '../types'
import { useApp } from '../context/AppContext'

interface VerificationModalProps {
  order: Order | null
  onClose: () => void
}

export const VerificationModal: React.FC<VerificationModalProps> = ({ order, onClose }) => {
  const { verifyOrder, rejectOrder } = useApp()
  const [rejectReason, setRejectReason] = useState('')
  const [showRejectInput, setShowRejectInput] = useState(false)
  const [zoomReceipt, setZoomReceipt] = useState(false)

  if (!order) return null

  const handleApprove = () => {
    verifyOrder(order.id)
    onClose()
  }

  const handleReject = () => {
    rejectOrder(order.id, rejectReason || 'Comprobante no coincide o fondos no acreditados')
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden z-10 flex flex-col max-h-[92vh]">
        {/* Top Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-mono font-bold text-sm">
              {order.orderNumber.replace('CY-', '#')}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-lg text-slate-900">
                  Conciliación de Orden {order.orderNumber}
                </h3>
                {order.isFraudAlert && (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-100 text-rose-700 border border-rose-300 animate-pulse">
                    <ShieldAlert className="w-3.5 h-3.5" />
                    Posible Fraude
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                Reportado {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • Tasa BCV: Bs. {order.bcvRateUsed.toFixed(2)}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Anti-Fraud Banner if flagged */}
        {order.isFraudAlert && (
          <div className="bg-rose-50 border-b border-rose-200 px-6 py-3 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
            <div className="text-xs text-rose-800">
              <span className="font-bold">¡ALERTA ANTIFRAUDE ACTIVA! </span>
              {order.fraudAlertReason ||
                `Esta referencia bancaria (${order.paymentReport.referenceNumber}) ya fue utilizada en otra transacción.`}
            </div>
          </div>
        )}

        {/* Split View Content */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Column: Comprobante Screenshot */}
          <div className="flex flex-col">
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                <Receipt className="w-4 h-4 text-emerald-600" />
                Comprobante Adjunto por el Cliente
              </label>
              <button
                onClick={() => setZoomReceipt(!zoomReceipt)}
                className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 flex items-center gap-1"
              >
                <ZoomIn className="w-3.5 h-3.5" />
                {zoomReceipt ? 'Vista normal' : 'Ampliar'}
              </button>
            </div>

            <div
              className={`relative rounded-2xl border-2 overflow-hidden bg-slate-900 flex items-center justify-center transition-all ${
                zoomReceipt ? 'h-96' : 'h-80'
              } ${order.isFraudAlert ? 'border-rose-300' : 'border-slate-200'}`}
            >
              <img
                src={order.paymentReport.receiptUrl}
                alt="Comprobante de pago"
                className="w-full h-full object-contain cursor-pointer"
                onClick={() => window.open(order.paymentReport.receiptUrl, '_blank')}
                title="Hacer clic para abrir en tamaño completo"
              />
              <a
                href={order.paymentReport.receiptUrl}
                target="_blank"
                rel="noreferrer"
                className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-lg flex items-center gap-1 hover:bg-slate-900"
              >
                <ExternalLink className="w-3 h-3" />
                Original
              </a>
            </div>

            <div className="mt-2 text-[11px] text-slate-500 text-center">
              Comprueba que el número de referencia y el monto coincidan con tu estado de cuenta bancario.
            </div>
          </div>

          {/* Right Column: Transfer Data & Customer */}
          <div className="space-y-4">
            {/* Payment Summary Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-slate-700" />
                  Datos Reportados del Pago
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 uppercase">
                  {order.paymentReport.method.replace('_', ' ')}
                </span>
              </div>

              <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-xs text-slate-500 block">Monto en Bolívares</span>
                  <span className="text-lg font-black text-emerald-600">
                    Bs. {order.totalBs.toFixed(2)}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Equivalente USD</span>
                  <span className="text-lg font-black text-slate-900">
                    ${order.totalUSD.toFixed(2)}
                  </span>
                </div>
                <div className="col-span-2 bg-white p-3 rounded-xl border border-slate-200">
                  <span className="text-xs text-slate-500 block font-medium">Nº de Referencia Bancaria</span>
                  <span className="font-mono text-base font-extrabold tracking-wider text-slate-900 select-all">
                    {order.paymentReport.referenceNumber}
                  </span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Banco Emisor</span>
                  <span className="font-semibold text-slate-800">{order.paymentReport.bankOrigin}</span>
                </div>
                <div>
                  <span className="text-xs text-slate-500 block">Teléfono Emisor</span>
                  <span className="font-semibold text-slate-800">{order.paymentReport.senderPhone}</span>
                </div>
              </div>
            </div>

            {/* Customer Details */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 text-xs space-y-2">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1.5 pb-1 border-b border-slate-200">
                <User className="w-3.5 h-3.5 text-slate-700" />
                Cliente y Entrega
              </span>
              <div className="flex items-center gap-2 pt-1">
                <span className="font-bold text-slate-900">{order.customer.fullName}</span>
                <span className="text-slate-400">•</span>
                <span className="text-slate-600 flex items-center gap-1">
                  <Phone className="w-3 h-3 text-slate-400" />
                  {order.customer.phone}
                </span>
              </div>
              <div className="flex items-start gap-1.5 text-slate-600">
                <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                <span>{order.customer.deliveryAddress}</span>
              </div>
              {order.customer.notes && (
                <div className="bg-white p-2 rounded-lg border border-slate-200 text-slate-600 italic">
                  "{order.customer.notes}"
                </div>
              )}
            </div>

            {/* Ordered Items summary */}
            <div className="text-xs text-slate-600">
              <span className="font-bold text-slate-700">Artículos ({order.items.length}): </span>
              {order.items.map(item => `${item.quantity}x ${item.product.name}`).join(', ')}
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Estado actual:{' '}
            <span
              className={`font-bold capitalize ${
                order.status === 'verified'
                  ? 'text-emerald-600'
                  : order.status === 'rejected'
                  ? 'text-rose-600'
                  : 'text-amber-600'
              }`}
            >
              {order.status === 'verified'
                ? 'Verificada'
                : order.status === 'rejected'
                ? 'Rechazada'
                : 'Pendiente de Conciliación'}
            </span>
          </div>

          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            {showRejectInput ? (
              <div className="flex items-center gap-2 w-full sm:w-auto">
                <input
                  type="text"
                  placeholder="Motivo del rechazo..."
                  value={rejectReason}
                  onChange={e => setRejectReason(e.target.value)}
                  className="px-3 py-2 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-rose-500 outline-none w-full sm:w-64"
                />
                <button
                  onClick={handleReject}
                  className="px-3 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Confirmar Rechazo
                </button>
                <button
                  onClick={() => setShowRejectInput(false)}
                  className="px-2.5 py-2 text-slate-500 hover:text-slate-800 text-xs font-medium"
                >
                  Cancelar
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => setShowRejectInput(true)}
                  className="flex items-center gap-1.5 px-4 py-2.5 text-xs sm:text-sm font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors cursor-pointer"
                >
                  <XCircle className="w-4 h-4" />
                  <span>Rechazar Pago</span>
                </button>

                <button
                  onClick={handleApprove}
                  className="flex items-center gap-2 px-5 py-2.5 text-xs sm:text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 rounded-xl shadow-md shadow-emerald-600/20 active:scale-95 transition-all cursor-pointer"
                >
                  <CheckCircle className="w-4 h-4" />
                  <span>Aprobar y Conciliar</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
