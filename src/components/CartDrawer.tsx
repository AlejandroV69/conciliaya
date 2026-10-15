import React from 'react'
import { X, Plus, Minus, Trash2, ArrowRight, ShoppingBag, ShieldCheck } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'

export const CartDrawer: React.FC = () => {
  const {
    store,
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateCartQuantity,
    cartTotalUSD,
    cartTotalBs
  } = useApp()

  const navigate = useNavigate()

  if (!isCartOpen) return null

  const handleCheckout = () => {
    setIsCartOpen(false)
    navigate(`/t/${store.slug}/checkout`)
  }

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartOpen(false)}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-slate-200">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Tu Pedido</h2>
              <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                {cart.reduce((sum, item) => sum + item.quantity, 0)} items
              </span>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 rounded-xl transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 divide-y divide-slate-100">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-400">
                <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-3">
                  <ShoppingBag className="w-8 h-8 text-slate-300" />
                </div>
                <p className="font-semibold text-slate-700 text-base">El carrito está vacío</p>
                <p className="text-xs text-slate-400 mt-1 max-w-xs">
                  Agrega deliciosos productos de la vitrina para armar tu pedido.
                </p>
              </div>
            ) : (
              cart.map(({ product, quantity }) => {
                const itemTotalUSD = (product.priceUSD * quantity).toFixed(2)
                const itemTotalBs = (product.priceUSD * quantity * store.bcvRate).toFixed(2)

                return (
                  <div key={product.id} className="py-4 first:pt-0 last:pb-0 flex gap-3">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-18 h-18 rounded-xl object-cover border border-slate-100"
                    />
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-2">
                        <div>
                          <h4 className="font-semibold text-sm text-slate-900 leading-snug line-clamp-1">
                            {product.name}
                          </h4>
                          <p className="text-xs text-slate-500 mt-0.5">${product.priceUSD.toFixed(2)} c/u</p>
                        </div>
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="text-slate-400 hover:text-rose-500 p-1 transition-colors"
                          title="Eliminar producto"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between mt-2">
                        {/* Quantity controls */}
                        <div className="flex items-center gap-1.5 border border-slate-200 rounded-lg p-0.5 bg-slate-50">
                          <button
                            onClick={() => updateCartQuantity(product.id, quantity - 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-white rounded transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-7 text-center text-xs font-bold text-slate-900">
                            {quantity}
                          </span>
                          <button
                            onClick={() => updateCartQuantity(product.id, quantity + 1)}
                            className="w-6 h-6 flex items-center justify-center text-slate-600 hover:bg-white rounded transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Price */}
                        <div className="text-right">
                          <div className="text-sm font-bold text-slate-900">${itemTotalUSD}</div>
                          <div className="text-[11px] font-semibold text-emerald-600">
                            Bs. {itemTotalBs}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })
            )}
          </div>

          {/* Footer & Totals */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 border-t border-slate-200 bg-slate-50/80 space-y-4">
              {/* Tasa BCV info banner */}
              <div className="flex items-center justify-between text-xs text-slate-600 bg-emerald-50/80 border border-emerald-200/80 rounded-xl px-3 py-2">
                <span className="flex items-center gap-1.5 font-medium text-emerald-900">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Tasa oficial aplicada:
                </span>
                <span className="font-bold text-emerald-800">
                  {store.bcvRate.toFixed(2)} Bs/$
                </span>
              </div>

              {/* Totals */}
              <div className="space-y-1.5">
                <div className="flex justify-between items-baseline">
                  <span className="text-sm text-slate-600">Total a pagar (USD):</span>
                  <span className="text-2xl font-black text-slate-900">
                    ${cartTotalUSD.toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline">
                  <span className="text-xs text-slate-500 font-medium">Equivalente en Bolívares:</span>
                  <span className="text-base font-bold text-emerald-700">
                    Bs. {cartTotalBs.toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                onClick={handleCheckout}
                className="w-full py-3.5 px-4 bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold rounded-xl shadow-lg shadow-emerald-600/25 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <span>Proceder al Pago</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
