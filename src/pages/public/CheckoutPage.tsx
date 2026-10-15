import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Copy,
  Check,
  CreditCard,
  Building,
  MessageCircle,
  ShoppingBag
} from 'lucide-react'
import { useApp } from '../../context/AppContext'
import { PublicHeader } from '../../components/PublicHeader'
import type { CustomerInfo, PaymentReport, Order } from '../../types'

export const CheckoutPage: React.FC = () => {
  const { store, cart, cartTotalUSD, cartTotalBs, createOrder } = useApp()

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1)
  const [createdOrder, setCreatedOrder] = useState<Order | null>(null)
  const [copiedKey, setCopiedKey] = useState<string | null>(null)

  // Step 1: Customer details
  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '',
    phone: '',
    deliveryAddress: '',
    notes: ''
  })
  const [step1Errors, setStep1Errors] = useState<Partial<Record<keyof CustomerInfo, string>>>({})

  // Step 2: Payment method chosen
  const [selectedMethod, setSelectedMethod] = useState<'pago_movil' | 'transferencia' | 'usdt'>('pago_movil')

  // Step 3: Anti-fraud Payment Report
  const [report, setReport] = useState<Omit<PaymentReport, 'reportedAt'>>({
    method: 'pago_movil',
    referenceNumber: '',
    bankOrigin: 'Banco de Venezuela',
    senderPhone: '',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80'
  })
  const [step3Errors, setStep3Errors] = useState<{ referenceNumber?: string; senderPhone?: string; bankOrigin?: string }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text)
    setCopiedKey(key)
    setTimeout(() => setCopiedKey(null), 2000)
  }

  // Validate step 1
  const handleProceedToStep2 = () => {
    const errors: Partial<Record<keyof CustomerInfo, string>> = {}
    if (!customer.fullName.trim()) errors.fullName = 'El nombre completo es obligatorio'
    if (!customer.phone.trim()) errors.phone = 'El teléfono es obligatorio'
    if (!customer.deliveryAddress.trim()) errors.deliveryAddress = 'La dirección es obligatoria'

    if (Object.keys(errors).length > 0) {
      setStep1Errors(errors)
      return
    }
    setStep1Errors({})
    setReport(prev => ({ ...prev, senderPhone: prev.senderPhone || customer.phone }))
    setCurrentStep(2)
  }

  // Validate and submit step 3
  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const errors: { referenceNumber?: string; senderPhone?: string; bankOrigin?: string } = {}
    if (!report.referenceNumber.trim()) errors.referenceNumber = 'Ingresa el número de referencia bancaria'
    if (!report.senderPhone.trim()) errors.senderPhone = 'Ingresa el teléfono desde el que se pagó'
    if (!report.bankOrigin.trim()) errors.bankOrigin = 'Ingresa el banco emisor'

    if (Object.keys(errors).length > 0) {
      setStep3Errors(errors)
      return
    }

    setIsSubmitting(true)

    setTimeout(() => {
      const order = createOrder(customer, {
        ...report,
        method: selectedMethod,
        reportedAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      })
      setCreatedOrder(order)
      setIsSubmitting(false)
    }, 600)
  }

  // If cart is empty and no order created, redirect or show message
  if (cart.length === 0 && !createdOrder) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <PublicHeader showBackToCatalog={true} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
            <ShoppingBag className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Tu carrito está vacío</h2>
          <p className="text-sm text-slate-500 mt-1 max-w-sm mb-6">
            Selecciona productos en el catálogo antes de proceder al checkout.
          </p>
          <Link
            to={`/t/${store.slug}`}
            className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-sm shadow-md transition-colors"
          >
            Volver al Catálogo
          </Link>
        </div>
      </div>
    )
  }

  // SUCCESS SCREEN
  if (createdOrder) {
    const rawPhone = store.phone.replace(/[^0-9]/g, '')
    const whatsappMessage = encodeURIComponent(
      `¡Hola ${store.name}! Acabo de realizar el pedido con Orden *#${createdOrder.orderNumber}* por un monto de *$${createdOrder.totalUSD.toFixed(2)} USD* (Bs. ${createdOrder.totalBs.toFixed(2)}).\n\n` +
      `*Cliente:* ${createdOrder.customer.fullName}\n` +
      `*Referencia bancaria:* ${createdOrder.paymentReport.referenceNumber}\n` +
      `*Banco:* ${createdOrder.paymentReport.bankOrigin}\n\n` +
      `Quedo atento a la confirmación de la entrega. ¡Gracias!`
    )
    const whatsappUrl = `https://wa.me/${rawPhone}?text=${whatsappMessage}`

    return (
      <div className="min-h-screen bg-slate-50 flex flex-col pb-16">
        <PublicHeader showBackToCatalog={false} />

        <div className="max-w-xl mx-auto px-4 py-10 w-full">
          <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200 text-center">
            {/* Success icon */}
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <span className="inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 mb-2">
              Pago Reportado • En Verificación
            </span>

            <h2 className="text-2xl sm:text-3xl font-black text-slate-950">
              ¡Orden Recibida con Éxito!
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Tu pedido ha sido registrado en el sistema bajo el identificador:
            </p>

            <div className="my-5 p-4 rounded-2xl bg-slate-50 border border-slate-200 inline-block font-mono text-xl sm:text-2xl font-black text-slate-900 tracking-wider">
              {createdOrder.orderNumber}
            </div>

            {/* Order summary box */}
            <div className="bg-slate-50 rounded-2xl p-4 text-left border border-slate-200 text-xs space-y-2 mb-6">
              <div className="flex justify-between text-slate-600">
                <span>Total reportado:</span>
                <strong className="text-slate-900 text-sm">
                  ${createdOrder.totalUSD.toFixed(2)} / Bs. {createdOrder.totalBs.toFixed(2)}
                </strong>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Referencia:</span>
                <span className="font-mono font-bold text-slate-800">{createdOrder.paymentReport.referenceNumber}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Dirección:</span>
                <span className="text-slate-800 truncate max-w-xs">{createdOrder.customer.deliveryAddress}</span>
              </div>
            </div>

            {/* Direct WhatsApp notify CTA */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="w-full py-4 px-6 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/30 flex items-center justify-center gap-2.5 text-base transition-all active:scale-[0.99] cursor-pointer"
            >
              <MessageCircle className="w-5 h-5 fill-current" />
              <span>Notificar al Comerciante por WhatsApp</span>
            </a>

            <p className="text-[11px] text-slate-400 mt-3">
              Enviar el mensaje por WhatsApp acelera la verificación de tu pago y la preparación del delivery.
            </p>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <Link
                to={`/t/${store.slug}`}
                className="text-xs font-semibold text-slate-500 hover:text-emerald-700"
              >
                Volver a la tienda
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col pb-20">
      <PublicHeader showBackToCatalog={true} />

      <main className="max-w-3xl mx-auto px-4 py-8 w-full flex-1">
        {/* Stepper progress indicator */}
        <div className="mb-8">
          <div className="flex items-center justify-between max-w-md mx-auto">
            {/* Step 1 indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                1
              </div>
              <span className="text-[11px] font-semibold text-slate-600 mt-1">Entrega</span>
            </div>

            <div className={`flex-1 h-0.5 mx-2 ${currentStep >= 2 ? 'bg-emerald-600' : 'bg-slate-200'}`} />

            {/* Step 2 indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                2
              </div>
              <span className="text-[11px] font-semibold text-slate-600 mt-1">Instrucciones</span>
            </div>

            <div className={`flex-1 h-0.5 mx-2 ${currentStep >= 3 ? 'bg-emerald-600' : 'bg-slate-200'}`} />

            {/* Step 3 indicator */}
            <div className="flex flex-col items-center">
              <div
                className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  currentStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
                }`}
              >
                3
              </div>
              <span className="text-[11px] font-semibold text-slate-600 mt-1">Reporte</span>
            </div>
          </div>
        </div>

        {/* Content Box */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-200">
          {/* STEP 1: DATOS DE ENTREGA */}
          {currentStep === 1 && (
            <div className="space-y-5">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Paso 1: Datos de Entrega</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Ingresa tus datos para coordinar el despacho de tu pedido.
                </p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Nombre y Apellido *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Valentina Mendoza"
                    value={customer.fullName}
                    onChange={e => setCustomer({ ...customer, fullName: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  {step1Errors.fullName && (
                    <p className="text-xs text-rose-500 mt-1">{step1Errors.fullName}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Número de Teléfono / WhatsApp *
                  </label>
                  <input
                    type="tel"
                    placeholder="Ej. 0412-1234567"
                    value={customer.phone}
                    onChange={e => setCustomer({ ...customer, phone: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  {step1Errors.phone && (
                    <p className="text-xs text-rose-500 mt-1">{step1Errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Dirección de Entrega *
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Calle, Edificio/Casa, Número de Apto y Punto de Referencia"
                    value={customer.deliveryAddress}
                    onChange={e => setCustomer({ ...customer, deliveryAddress: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none resize-none"
                  />
                  {step1Errors.deliveryAddress && (
                    <p className="text-xs text-rose-500 mt-1">{step1Errors.deliveryAddress}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Notas adicionales (opcional)
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. Tocar timbre 4B o dejar con vigilancia"
                    value={customer.notes}
                    onChange={e => setCustomer({ ...customer, notes: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>
              </div>

              {/* Order total preview */}
              <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 flex items-center justify-between text-xs">
                <div>
                  <span className="text-slate-500 block">Total a transferir:</span>
                  <span className="text-base font-black text-slate-900">${cartTotalUSD.toFixed(2)} USD</span>
                </div>
                <div className="text-right">
                  <span className="text-slate-500 block">En Bolívares (Tasa BCV {store.bcvRate.toFixed(2)}):</span>
                  <span className="text-base font-extrabold text-emerald-700">Bs. {cartTotalBs.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={handleProceedToStep2}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
              >
                <span>Continuar a Métodos de Pago</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* STEP 2: INSTRUCCIONES DE PAGO */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Paso 2: Instrucciones de Pago</h2>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Transfiere el monto exacto utilizando cualquiera de las cuentas del comercio.
                </p>
              </div>

              {/* Amount to pay banner */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl flex items-center justify-between">
                <div>
                  <span className="text-xs text-slate-400 block font-medium">Monto a Transferir</span>
                  <span className="text-2xl font-black text-emerald-400">Bs. {cartTotalBs.toFixed(2)}</span>
                </div>
                <div className="text-right">
                  <span className="text-xs text-slate-400 block font-medium">Equivalente USD</span>
                  <span className="text-xl font-bold text-white">${cartTotalUSD.toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Method Selector Tabs */}
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedMethod('pago_movil')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                    selectedMethod === 'pago_movil'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <CreditCard className="w-4 h-4 text-emerald-600" />
                  <span>Pago Móvil</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('transferencia')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                    selectedMethod === 'transferencia'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <Building className="w-4 h-4 text-emerald-600" />
                  <span>Transferencia</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedMethod('usdt')}
                  className={`py-3 px-2 rounded-xl text-xs font-bold flex flex-col items-center gap-1.5 border transition-all cursor-pointer ${
                    selectedMethod === 'usdt'
                      ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                      : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  <ShieldCheck className="w-4 h-4 text-emerald-600" />
                  <span>USDT TRC20</span>
                </button>
              </div>

              {/* Payment details box based on selection */}
              <div className="bg-slate-50 rounded-2xl p-4 sm:p-5 border border-slate-200 space-y-3">
                {selectedMethod === 'pago_movil' && (
                  <>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-700">Banco Receptor</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-slate-900">
                          {store.paymentMethods.pagoMovil.bank}
                        </span>
                        <button
                          onClick={() => copyToClipboard(store.paymentMethods.pagoMovil.bank, 'bank')}
                          className="text-slate-400 hover:text-emerald-600"
                          title="Copiar"
                        >
                          {copiedKey === 'bank' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-700">Teléfono Pago Móvil</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {store.paymentMethods.pagoMovil.phone}
                        </span>
                        <button
                          onClick={() => copyToClipboard(store.paymentMethods.pagoMovil.phone, 'phone')}
                          className="text-slate-400 hover:text-emerald-600"
                          title="Copiar"
                        >
                          {copiedKey === 'phone' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-700">Cédula / RIF</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {store.paymentMethods.pagoMovil.idNumber}
                        </span>
                        <button
                          onClick={() => copyToClipboard(store.paymentMethods.pagoMovil.idNumber, 'id')}
                          className="text-slate-400 hover:text-emerald-600"
                          title="Copiar"
                        >
                          {copiedKey === 'id' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Beneficiario</span>
                      <span className="text-xs font-medium text-slate-600">
                        {store.paymentMethods.pagoMovil.beneficiary}
                      </span>
                    </div>
                  </>
                )}

                {selectedMethod === 'transferencia' && (
                  <>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-700">Banco</span>
                      <span className="text-xs font-semibold text-slate-900">
                        {store.paymentMethods.transferencia.bank}
                      </span>
                    </div>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-700">Número de Cuenta</span>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-slate-900">
                          {store.paymentMethods.transferencia.accountNumber}
                        </span>
                        <button
                          onClick={() => copyToClipboard(store.paymentMethods.transferencia.accountNumber, 'acc')}
                          className="text-slate-400 hover:text-emerald-600"
                        >
                          {copiedKey === 'acc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700">Titular y RIF</span>
                      <span className="text-xs text-slate-600">
                        {store.paymentMethods.transferencia.beneficiary} ({store.paymentMethods.transferencia.idNumber})
                      </span>
                    </div>
                  </>
                )}

                {selectedMethod === 'usdt' && (
                  <>
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <span className="text-xs font-bold text-slate-700">Red</span>
                      <span className="text-xs font-semibold text-slate-900">
                        {store.paymentMethods.usdt.network}
                      </span>
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-700 block mb-1">Dirección de Billetera</span>
                      <div className="flex items-center justify-between bg-white p-2.5 rounded-xl border border-slate-200 text-xs">
                        <span className="font-mono text-slate-800 break-all">
                          {store.paymentMethods.usdt.walletAddress}
                        </span>
                        <button
                          onClick={() => copyToClipboard(store.paymentMethods.usdt.walletAddress, 'wallet')}
                          className="p-1.5 text-slate-400 hover:text-emerald-600"
                        >
                          {copiedKey === 'wallet' ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Atrás</span>
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentStep(3)}
                  className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
                >
                  <span>Ya transferí, Reportar Pago</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: FORMULARIO ANTIFRAUDE */}
          {currentStep === 3 && (
            <form onSubmit={handleFinalSubmit} className="space-y-5">
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-xl font-bold text-slate-900">Paso 3: Formulario Antifraude</h2>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300">
                    ConciliaYa Secure
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Ingresa los datos exactos del comprobante para la conciliación bancaria instantánea.
                </p>
              </div>

              {/* Inputs */}
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Número de Referencia Bancaria *
                  </label>
                  <input
                    type="text"
                    placeholder="Ej. 839201 o últimos 6 a 8 dígitos"
                    value={report.referenceNumber}
                    onChange={e => setReport({ ...report, referenceNumber: e.target.value })}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                  {step3Errors.referenceNumber && (
                    <p className="text-xs text-rose-500 mt-1">{step3Errors.referenceNumber}</p>
                  )}
                  <p className="text-[11px] text-slate-400 mt-1">
                    (Tip: Para probar la alerta antifraude visual del dashboard, puedes ingresar la referencia de prueba: <strong>839201</strong>)
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Banco Emisor *
                    </label>
                    <input
                      type="text"
                      placeholder="Ej. Banco de Venezuela / Banesco / Mercantil"
                      value={report.bankOrigin}
                      onChange={e => setReport({ ...report, bankOrigin: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    {step3Errors.bankOrigin && (
                      <p className="text-xs text-rose-500 mt-1">{step3Errors.bankOrigin}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                      Teléfono desde el que pagó *
                    </label>
                    <input
                      type="tel"
                      placeholder="Ej. 04121234567"
                      value={report.senderPhone}
                      onChange={e => setReport({ ...report, senderPhone: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                    {step3Errors.senderPhone && (
                      <p className="text-xs text-rose-500 mt-1">{step3Errors.senderPhone}</p>
                    )}
                  </div>
                </div>

                {/* Comprobante image attachment preview */}
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                    Captura del Comprobante (Screenshot)
                  </label>
                  <div className="mt-1 flex items-center gap-4 p-4 rounded-2xl border-2 border-dashed border-slate-300 bg-slate-50/70">
                    <img
                      src={report.receiptUrl}
                      alt="Vista previa comprobante"
                      className="w-16 h-16 rounded-xl object-cover border border-slate-200 shadow-xs"
                    />
                    <div className="flex-1">
                      <p className="text-xs font-bold text-slate-800">
                        Comprobante adjunto listo para verificación
                      </p>
                      <p className="text-[11px] text-slate-400 mt-0.5">
                        El comerciante comparará esta imagen contra los fondos en su cuenta.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Navigation buttons */}
              <div className="flex items-center gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(2)}
                  className="px-5 py-3 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-2xl text-xs flex items-center gap-2 cursor-pointer transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Atrás</span>
                </button>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 cursor-pointer transition-all disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span>Procesando y validando antifraude...</span>
                  ) : (
                    <>
                      <span>Confirmar y Enviar Orden</span>
                      <CheckCircle2 className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </main>
    </div>
  )
}
