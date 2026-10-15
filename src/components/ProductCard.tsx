import React from 'react'
import { Plus, Check } from 'lucide-react'
import type { Product } from '../types'
import { useApp } from '../context/AppContext'

interface ProductCardProps {
  product: Product
}

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { store, addToCart, cart } = useApp()
  const priceBs = (product.priceUSD * store.bcvRate).toFixed(2)
  const cartItem = cart.find(item => item.product.id === product.id)
  const isAdded = Boolean(cartItem)

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-xl hover:border-emerald-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Product Image */}
      <div className="relative aspect-4/3 w-full bg-slate-100 overflow-hidden">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />
        <div className="absolute top-2.5 right-2.5">
          <span className="inline-block px-2.5 py-1 text-[11px] font-bold tracking-wide uppercase bg-white/90 backdrop-blur-md text-slate-800 rounded-lg shadow-xs">
            {product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-emerald-700 transition-colors line-clamp-1">
            {product.name}
          </h3>
          <p className="mt-1 text-xs sm:text-sm text-slate-500 line-clamp-2 leading-relaxed">
            {product.description}
          </p>
        </div>

        {/* Pricing & Add button */}
        <div className="mt-4 pt-3.5 border-t border-slate-100 flex items-end justify-between gap-2">
          <div>
            <div className="flex items-baseline gap-1 text-slate-900">
              <span className="text-xl sm:text-2xl font-black tracking-tight text-slate-950">
                ${product.priceUSD.toFixed(2)}
              </span>
              <span className="text-xs text-slate-400 font-medium">USD</span>
            </div>
            <div className="text-xs font-semibold text-emerald-600 flex items-center gap-0.5 mt-0.5">
              <span>≈ Bs. {priceBs}</span>
            </div>
          </div>

          <button
            onClick={() => addToCart(product, 1)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 active:scale-95 shadow-xs ${
              isAdded
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-300 hover:bg-emerald-100'
                : 'bg-emerald-600 text-white hover:bg-emerald-500 shadow-emerald-600/20'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-4 h-4 text-emerald-600 stroke-[2.5]" />
                <span>{cartItem?.quantity} en carrito</span>
              </>
            ) : (
              <>
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>Agregar</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
